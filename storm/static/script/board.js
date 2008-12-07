$(document).ready(function(){
  ideaboard.init();
  var container = document.getElementById('infovis');
  container.width = '780';
  container.height = '375';
  ideaboard.rgraph= new RGraph(ideaboard.canvas);
  ideaboard.canvas= new Canvas('infovis', '#ccddee', '#772277');
  ideaboard.origLevelDistance = Config.levelDistance;
  if(ideaboard.sortMode == 'shuffle') ideaboard.populateWithShuffled();
 //  else if(ideaboard.sortMode == 'popular') idealogger.log("Sort by popular");
 //  else idealogger.log("NO SORTMODE SPECIFIED");
})

var idealogger = {
  log: function(msg){
     if(window.console){
         window.console.log(msg);
     }
  }
};

/* Mechanical Turk Functions */

var mTurk = {
    gup: function( name )
    {
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var tmpURL = window.location.href;
      var results = regex.exec( tmpURL );
      if( results == null )
        return "";
      else
        return results[1];
    },
    
    // Mechanical Turk-specific code:
    ideas_added: 0,
    id_list: new Array,
    active: false,
    minimum: 3,
    accepted: false
  
    
};

/* Main object that runs the brainstorm. Most functionality encapsulated here */
var ideaboard = {
  postitArray: new Array(),
  visiblePostIts: new Array(),
  ideasFromServer: new Object(),
  ideasToChildrenMap: new Object(),
  watchedIdeas: new Object(),
  watchingEnabled: true,
  addPostitPtr: undefined,
  visActive: false, // is our infovis up?
  postitWidth: undefined,
  postitHeight: undefined,
  postitSpacing: 20, // in px
  shader: undefined,
  shaderZindex: 1000000,
  level:3,
  postitcounter: 0,
  lastZindex: 0,
  activecluster:0,
  currentShuffleIndex: 0,
  ideasAsArray: undefined,
  selectedIdeas: new Object(),
  currentClusterIdeas: new Object(),
  treejson: new Object(),
  board_id: undefined,
  cluster_mode: false,
  sidebarOpen: false,
  initialIdeaSetSize: 5,
  // Study-specific:
  votingEnabled: true,
  sortMode: 'shuffle',
  /* Called on page load; Calculates a width and height for postits,
     assigns a few drag/drop functions */
  init: function(){
    $('#ideaBoard').height('100%');
    $('#sideboard_container').dialog({'width':'300','height':'500px', 'autoOpen':false, 'close':function(){ideaboard.sidebarOpen = false}});
    ideaboard.postitWidth = $('#ideaBoard').width()/8;
    ideaboard.postitHeight = ideaboard.postitWidth * 1.2;
    $('#close_vis_button').click(function(event){
       if(ideaboard.visActive == true){
           $('#vis_container').hide();
           ideaboard.unshadeBoard();
           ideaboard.visActive = false;
       }
        
    });
    
    if(mTurk && mTurk.active == true){
        $('#header').hide();
        if (mTurk.gup('assignmentId') == "ASSIGNMENT_ID_NOT_AVAILABLE")
        {
            $('#preinstructions').show();
            $('#done_participating_button').attr("value", "You must Accept this HIT before participating in it").click(function(){return false});
        } else{
            mTurk.accepted = true;
            $('#assignmentId').attr('value', mTurk.gup('assignmentId'));
            if (document.referrer && ( document.referrer.indexOf('workersandbox') != -1) ) {
                $('#mturk_form').attr("action", "http://workersandbox.mturk.com/mturk/externalSubmit");
            }
        } 
        
    };
	
	$('#save_cluster_btn').click(function(event) {
		var list = "";
		for(var i =0; i < ideaboard.postitArray.length; i++) {
			if(ideaboard.postitArray[i][0].id in ideaboard.selectedIdeas) {
				if(list == "") {
					list = ideaboard.postitArray[i][0].id.split('-')[1];
				} else {
					list += ","+ideaboard.postitArray[i][0].id.split('-')[1];
				}
			}
		}
		var post = {}
		post.board_id = ideaboard.board_id;
		post.ideas = list;
		var successFn = function(msg){
        	document.getElementById('numClusters').innerHTML = parseInt(msg) + " clusters";
      	};
		$.post("/storm/r/", post, successFn);
	});
	
	$('#tag_ideas_btn').click(function(event) {
		var answer = prompt("What are your tags? (CSV)");
		var list = "";
		for(var i =0; i < ideaboard.postitArray.length; i++) {
			if(ideaboard.postitArray[i][0].id in ideaboard.selectedIdeas) {
				if(list == "") {
					list = ideaboard.postitArray[i][0].id.split('-')[1];
				} else {
					list += ","+ideaboard.postitArray[i][0].id.split('-')[1];
				}
			}
		}
		var post = {}
		post.board_id = ideaboard.board_id;
		post.ideas = list;
		post.tags = answer;
		$.post("/storm/tagallideas/", post);
	});

	
    
    $('#mturk_form').submit(function(){
        var difference = mTurk.ideas_added - mTurk.minimum;
        if(difference >= 0){
            $('#idList').attr("value", mTurk.id_list);
            return true;
        }
        else{
            alert("Sorry, you haven't entered enough ideas yet. You need "+-difference+ " more.");
            return false;
        }
        
    });

  },
  
  /* Lay out as many postits as possible in a grid */
  arrangeInGrid: function(elements, rows, columns){
    if(elements == null) elements = this.currentIdeaSet;
    
    var fitInRow = Math.floor($('#mainIdeaSpace').width() / (this.postitWidth+ideaboard.postitSpacing));
    // idealogger.log(ideaboard.postitHeight);

    var fitInCol = Math.floor($('#mainIdeaSpace').height() / (ideaboard.postitHeight+ideaboard.postitSpacing));
    var curOffsetX = 0;
    var curRow = 0;
    var placedInRow = 0;
    $(elements).each(function(){
      if(placedInRow >= fitInRow){
          curOffsetX = 0;
          curRow++;
          if(curRow >= fitInCol) return;
          placedInRow = 0;
      }
          var pointX = curOffsetX;
          var pointY = curRow * Number(ideaboard.postitHeight+ideaboard.postitSpacing);
          curOffsetX += Number(ideaboard.postitWidth+ideaboard.postitSpacing);          
          placedInRow++;
      var created = ideaboard.createPostit(0,0, this.title, this.content, 'none', this.id, this.children);
      // created.css({'z-index' : ideaboard.lastZindex++});
      created.css({'left':pointX,'top':pointY});
      ideaboard.postitArray.push(created);
    });

  },
  
  clearMainSpace: function(clearIdeasToo){
      if(clearIdeasToo == undefined) clearIdeasToo = false;
      // idealogger.log(ideaboard.selectedIdeas);
      $(ideaboard.postitArray).each(function(index) {

        if(!(this[0].id in ideaboard.selectedIdeas)){
            $(this).fadeOut('slow', function(){
                $(this).remove();
            });
        }
      });
      // idealogger.log(clearIdeasToo);
      if(clearIdeasToo) ideaboard.currentIdeaSet = new Array();
  },

recenterOnPrompt:function(eve) {
	 ideaboard.rgraph.recenterOnId(ideaboard.root_id);
},

createNewCluster:function(eve) {
	  var successFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = e;
		} else {
			ideaboard.editCluster(eve, e);
		}
	 };
	  
 	$.ajax({
		type:"POST",
		url:"/storm/addcluster/",
		success: successFn});
  },
  
enterClusterMode: function(e) {
	 ideaboard.cluster_mode = true;
	 var successFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = e;
		} else {
			document.getElementById('sideboard').innerHTML = e;
		}
	 };
	 
 	$.ajax({
		type:"GET",
		url:"/storm/showclusters/",
		success: successFn});
  },

removeIdeaFromCluster: function(e, id) {
	e.stopPropagation();
	var data = 'id='+id +'&'+'clusterid='+ideaboard.activecluster;
	var successFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = "I'm sorry you must be logged in to watch ideas";
	  	} else {
			ideaboard.currentClusterIdeas[id] = true;
			document.getElementById('sideboard').innerHTML = e;
			document.getElementById("clusterthis_"+id).innerHTML = "<a href='#' onclick='ideaboard.addIdeaToCluster(event,"+id+");'>add to cluster</a>";
		}
	  };
	  $.ajax({
      type: "POST",
      url: "/storm/removeideafromcluster/",
      data: data,
      success: successFn});
},

saveCluster: function(value, id) {
	var data='id='+id+'&'+'value='+value;
	var successFn = function(e) {
	}
	$.ajax({
		   type:"POST",
		   url:"/storm/savecluster/",
		   data:data,
		   success:successFn});
},
	
addIdeaToCluster: function(e,id) {
	e.stopPropagation();
	var data = 'id='+id +'&'+'clusterid='+ideaboard.activecluster;
	var successFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = "I'm sorry you must be logged in to watch ideas";
	  	} else {
			ideaboard.currentClusterIdeas[id] = true;
			document.getElementById('sideboard').innerHTML = e;
			document.getElementById("clusterthis_"+id).innerHTML = "<a href='#' onclick='ideaboard.removeIdeaFromCluster(event,"+id+");'>remove from cluster</a>";
		}
	  };
	  $.ajax({
      type: "POST",
      url: "/storm/addideatocluster/",
      data: data,
      success: successFn});
},

duplicateCluster: function(id) {
	ideaboard.cluster_mode = true;
	var successFn = function(e) {
		if(e == "Failed") {}
		else {
			ideaboard.editCluster(null, e);
		}
	};
	data="id="+id;
	
	$.ajax({
    type: "POST",
    url: "/storm/duplicatecluster/",
    data: data,
    success: successFn});
},

  showClustersWithCurrentIdea: function(event) {
	  var root = ideaboard.rgraph.getRoot();
	  var data = "id="+root.id;
	   var successFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = e;
		} else {
			document.getElementById('sideboard').innerHTML = e;
		}
	 };
	 
 	$.ajax({
		type: "POST",
		url:"/storm/showclusterswithidea/",
		data: data,
		success: successFn});
	  
  },
  
editCluster: function(e, id) {
	 ideaboard.cluster_mode = true;
	 ideaboard.activecluster = id;
	 var successFn = function(e) {
		if(e == "Failed") {
		  	document.getElementById('status_msgs').innerHTML = "Please duplicate this cluster to edit.";
		} else {
			for(var i =0; i < e.length;  ++i) {
				var idea = e[i];				
				ideaboard.currentClusterIdeas[idea.id] = true;
			}
			for(var i = 0; i < ideaboard.visiblePostIts.length; ++i) {
				var idea = ideaboard.visiblePostIts[i];
				var element = document.getElementById('clusterthis_'+idea);
				if(ideaboard.currentClusterIdeas[idea]) {
					element.innerHTML ="<a href='#' onclick='ideaboard.removeIdeaFromCluster(event,"+idea+");'>remove from cluster</a>";
				}else {
					element.innerHTML ="<a href='#' onclick='ideaboard.addIdeaToCluster(event,"+idea+");'>add to cluster</a>";
				}
			}
		}
	 };
	 
 	$.getJSON("/storm/getclusterideas/"+id, successFn);
	
	 var nextFn = function(e) {
		if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = "Please duplicate this cluster to edit";
		} else {
			document.getElementById('sideboard').innerHTML = e;
		}
	 };
	 
	$.ajax({
	type:"GET",
	url:"/storm/editcluster/" + id,
	success: nextFn});
  },
  
  bringIdeaForward: function(postit){
      postit = $(postit);
      postit.css({'z-index' : ideaboard.lastZindex++}); 
  },
  
  showWatched: function() {
	  ideaboard.cluster_mode = false;
	  var successFn = function(e) {
		  if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = e;
		  } else {
			document.getElementById('sideboard').innerHTML = e;
		  }
	  };
	  
 	$.ajax({
		type:"GET",
		url:"/storm/watchidea/",
		success: successFn});
  },
  
  watchIdea: function(e, id) {
	  e.stopPropagation();
	  var data = "id="+id;
	  var successFn = function(e) {
		  if(e == "Failed" ) {
		  	document.getElementById('status_msgs').innerHTML = "I'm sorry you must be logged in to watch ideas";
		  } else {
			  ideaboard.watchedIdeas[id] = true;
			  document.getElementById("watchthis_"+id).innerHTML = "<a href='#' onclick='ideaboard.stopWatchingIdea(event, "+id+");'>stop watching</a>";
			  if(ideaboard.cluster_mode == false) {
			  	document.getElementById('sideboard').innerHTML = e;
			  } else {
				  document.getElementById('status_msgs').innerHTML = "Successfully watching idea";
			  }
		  }
	  };
	  $.ajax({
      type: "POST",
      url: "/storm/watchidea/",
      data: data,
      success: successFn});
  },
  
  stopWatchingIdea: function(e, id) {
	  e.stopPropagation();
	  var data = "id="+id+"&board_id+"+ideaboard.board_id;
	  var successFn = function(e) {
		if(e == "Failed") {
			document.getElementById('status_msgs').innerHTML = e;
	  	} else {
		  ideaboard.watchedIdeas[id] = true;
		  document.getElementById("watchthis_"+id).innerHTML = "<a href='#' onclick='ideaboard.watchIdea(event, "+id+");'>watch this</a>";
		  document.getElementById('sideboard').innerHTML = e;
		 }
	  };
	  $.ajax({
      type: "POST",
      url: "/storm/unwatchidea/",
      data: data,
      success: successFn});
	  
  },
  
  positiveVote: function(e, id) {
    e.stopPropagation();
	var post = {}
	post.positive_vote = true;
	post.id = id;
	var successFn = function(e){
	  document.getElementById('status_msgs').innerHTML = "Thank you for your vote!";	
	  $('#vote_'+id).html('+');
	};
	$.post("/storm/addvote/", post, successFn);
  },
  
  negativeVote: function(e, id) {
      e.stopPropagation();
	  var post = {}
	  post.positive_vote = false;
	  post.id = id;
  	var successFn = function(e){
	  document.getElementById('status_msgs').innerHTML = "Thank you for your vote!";		
  	  $('#vote_'+id).html('-');
  	};
  	$.post("/storm/addvote/", post, successFn);
  },
	  
  /* If possible (ie: if there are parents/children)
    build an info vis view with parents/children */
  showAddons: function(e, id){
      if(e) e.stopPropagation();
      var toHighlight = ideaboard.getPostitById(id);
      var inheritanceList = new Array();
      var curElem = ideaboard.ideasFromServer[id];

      while(curElem){
          if(curElem.id != id) inheritanceList.push(curElem.id);
          if(curElem.parent == "") break;
          curElem = ideaboard.ideasFromServer[curElem.parent];
      }
      // if there are any parents, start the search at the first parent
      var curjson = id != ideaboard.root_id ? ideaboard.findAllChildren(inheritanceList[inheritanceList.length-1], id, false) : ideaboard.findAllChildren(id, id, true);
      // window._firebug.log(curjson);
      // if(curjson.children.length == 0) return;
      $('#vis_container').show();

      
      ideaboard.visActive = true;
        //load graph from tree data.  
       // ideaboard.shadeBoard();
        ideaboard.canvas.clear();
        $('#label_container').empty();
       	ideaboard.rgraph = new RGraph(ideaboard.canvas);
        // idealogger.log(curjson);
        ideaboard.rgraph.loadTreeFromJSON(curjson); 
        ideaboard.rgraph.controller =  {  
             onCreateLabel: function(domElement, node) {
				 ideaboard.visiblePostIts.push(node.id);
				 if(ideaboard.votingEnabled) domElement.innerHTML = "<div id='vote_"+node.id+"'><a class='vote_button' href='#' title='Vote Idea Up' onclick='ideaboard.positiveVote(event, "+node.id+");return false;'>+</a><br /><a href='#' class='vote_button' title='Vote Idea Down' onclick='ideaboard.negativeVote(event, "+node.id+");return false;'>-</a></div>";
				 domElement.innerHTML += "<div class='postit_content' id='content_"+node.id+"'>" + node.name + "</div>";
				 $("#vote_"+node.id).addClass("postit_vote");
                 //window._firebug.log(node);

				 if(ideaboard.cluster_mode) {
					 if(ideaboard.currentClusterIdeas[node.id]) {
					 	domElement.innerHTML+="<br/><div id='clusterthis_"+node.id+"'><a href='#' onclick='ideaboard.removeIdeaFromCluster(event,"+node.id+");'>remove from cluster</a></div>";
				 	}else {
						domElement.innerHTML+="<br/><div id='clusterthis_"+node.id+"'><a href='#' onclick='ideaboard.addIdeaToCluster(event,"+node.id+");'>add to cluster</a></div>";
					}
				 } else {
					 domElement.innerHTML+="<br/><div id='clusterthis_"+node.id+"'></div>";
				 }
				 if(ideaboard.watchingEnabled){
    				 if(ideaboard.watchedIdeas[node.id]) {
    				 	domElement.innerHTML += "<div id='watchthis_"+node.id+"'><a href='#' onclick='ideaboard.stopWatchingIdea(event, "+node.id+");'>stop watching</a></div>";
    				 } else {
    					domElement.innerHTML += "<div id='watchthis_"+node.id+"'><a href='#' onclick='ideaboard.watchIdea(event, "+node.id+");'>watch this</a></div>";
    				 }				     
				 }
				 domElement.innerHTML += "<div id='links'><a href='#' id='addto_"+node.id+"'>add to this</a></div>";
				 $('#addto_'+node.id).click(function(e){
				     ideaboard.addTo(e,node.id);
				     return false;
				 });
             },
            //Take off previous width and height styles and  
            //add half of the *actual* label width to the left position.  
            // That will center your label (do the math, man).  
            onPlaceLabel: function(domElement, node) {  
                if(node.id == parseInt(ideaboard.root_id)){
                   // idealogger.log(domElement);
                   $(domElement).addClass('originalNode');
                } else if (node.data[0]['value'] == false){
                    $(domElement).addClass('parentNode');
                } else if (node.data[0]['value'] == true){
                    $(domElement).addClass('childNode');
                }
                var left = parseInt(domElement.style.left);  
				var top = parseInt(domElement.style.top);
                domElement.style.width = '100px';  
                domElement.style.height = '';  
                var w = domElement.offsetWidth;
				//var t = domElement.offsetHeight;
				//domElement.style.top = (top) + 'px';
                domElement.style.left = (left - w /2) + 'px';  
            }  
        
         };
        //compute positions  
        ideaboard.rgraph.compute();  
        //make first plot  
        ideaboard.rgraph.plot();
        ideaboard.rgraph.recenterOnId(id);

  },
  
  // id is current id, source_id is the center of the graph
  findAllChildren: function(id, source_id, areChildren, limit){
      // idealogger.log("finding children for:"+id);
      // are we at the 'focused' node?
      if(id == source_id) areChildren = true;
      var cur = ideaboard.ideasFromServer[id];
      var curjson = {'id':id, 'data':[{'key':'areChildren','value':areChildren}], 'name':cur.content};
      curjson['children'] = new Array();
      if((id in ideaboard.ideasToChildrenMap)){
          var counter = 0;
          for(child in ideaboard.ideasToChildrenMap[id]){
              var curChild = ideaboard.ideasToChildrenMap[id][child];
              curjson['children'].push(ideaboard.findAllChildren(curChild.id, source_id, areChildren));
              counter++;
              // idealogger.log(counter);
              if(id == String(ideaboard.root_id) && counter >= ideaboard.initialIdeaSetSize) break;
          }
      }
      return curjson;
  },
  
  getPostitById: function(id){
    return $('#postit-'+id);
  },
  
  zoom_out: function(event) {
	  if(ideaboard.level > 1) {
	  	Config.levelDistance -=30;
	  	ideaboard.canvas.clear();
	 	var current = document.getElementById("level_"+ideaboard.level);
	  	current.style.fontSize='16px';
	  	ideaboard.level--;
	 	current = document.getElementById("level_"+ideaboard.level);
		current.style.fontSize='18px';
	  	ideaboard.populateWithCurrent();
	  }
  },
  
  zoom_in: function(event) {
	  if(ideaboard.level < 5) {
	  	Config.levelDistance +=30;
	  	ideaboard.canvas.clear();
	 	var current = document.getElementById("level_"+ideaboard.level);
	  	current.style.fontSize='16px';
	  	ideaboard.level++;
	 	current = document.getElementById("level_"+ideaboard.level);
		current.style.fontSize='18px';
	  	ideaboard.populateWithCurrent();
	  }
  },
  
  populateWithCurrent: function() {
	  ideaboard.showAddons(null, ideaboard.root_id);
  },
  
  populateWithShuffled: function(){
      idealogger.log("Populating...");
      ideaboard.clearMainSpace(true);
          // ideaboard.postitArray.push(created);
      var num_picked = 0;
      var picked_set = new Object();
      var iterations = 0;
	  ideaboard.visiblePostIts = new Array();
      // build up an array
      if(ideaboard.ideasAsArray == undefined){
          ideaboard.ideasAsArray = new Array();
          for(idea in ideaboard.ideasFromServer){
              // not the length!
              if(idea != 'length' && ideaboard.ideasFromServer[idea].parent == ideaboard.root_id){
              // half a chance it goes in front, half it goes in back
                  if(Math.random() > 0.5)           ideaboard.ideasAsArray.push(ideaboard.ideasFromServer[idea]);
                  else ideaboard.ideasAsArray.unshift(ideaboard.ideasFromServer[idea]);   
              }
          };
      }
      var counter_added = 0;
      if(ideaboard.ideasAsArray.length <= ideaboard.initialIdeaSetSize){
          for(elem in ideaboard.ideasAsArray){
              var cur = ideaboard.ideasAsArray[elem];
              if(cur && cur.id != ideaboard.root_id){
                  ideaboard.currentIdeaSet.push(cur);     
              }
          }
      } else {
          for(var i = 0; i < ideaboard.initialIdeaSetSize; i++){
              var toGet = i + ideaboard.currentShuffleIndex;
              if(toGet > ideaboard.ideasAsArray.length-1){
                  ideaboard.currentShuffleIndex = 0;
                  toGet = 0;
                  i = 0;
              }
              idealogger.log(toGet);
              var cur = ideaboard.ideasAsArray[toGet];
              if(cur && cur.id != ideaboard.root_id){
                  ideaboard.currentIdeaSet.push(cur);     
                  counter_added++;
                  if(counter_added >= ideaboard.ideasAsArray.length) break;
              } 
          }          
      }
      ideaboard.ideasToChildrenMap[String(ideaboard.root_id)] = ideaboard.currentIdeaSet;
      ideaboard.currentShuffleIndex += i;
      // if(ideaboard.currentShuffleIndex >= ideaboard.ideasAsArray.length) ideaboard.currentShuffleIndex = ideaboard.currentShuffleIndex - ideaboard.ideasAsArray.length;
      // while(num_picked < ideaboard.initialIdeaSetSize || num_picked == ideaboard.ideasFromServer['length']){
      //     iterations++;
      //     if(iterations > 500) break;
      //     // idealogger.log(num_picked);
      //     var selected = Math.floor(Math.random() * ideaboard.ideasFromServer['length'])+1;
      //     var idea = ideaboard.ideasFromServer[String(selected)];
      //     if(idea){
      //         // conditions for adding idea:
      //         // it's not the parent; it hasn't already been chosen; it's a child
      //         // of the root node; and it's not currently in a "Selected" state
      //         if(selected != ideaboard.root_id && !picked_set[String(selected)] && idea.parent == String(ideaboard.root_id) && !('postit-'+selected in ideaboard.selectedIdeas)){
      //            ideaboard.currentIdeaSet.push(ideaboard.ideasFromServer[String(selected)]);
      //            picked_set[String(selected)] = true;
      //            num_picked++;
      //         }              
      //     }
      //     // replace the 'real' list of children of the root with the 
      //     // current, subset of the children; there's a copy of the full
      //     // list in ideasToChildrenMap['0'], if we need it for some reason
      //     ideaboard.ideasToChildrenMap[String(ideaboard.root_id)] = ideaboard.currentIdeaSet;
      // };
          // if(counter < 15 && Math.random()<1 && !('postit-'+idea.id in ideaboard.selectedIdeas)){
          //     ideaboard.currentIdeaSet.push(ideaboard.ideasFromServer[idea]);
          //     counter++;
          // }
      ideaboard.showAddons(null, ideaboard.root_id);
      // ideaboard.arrangeInGrid();
  },
  
  // inspired by greghoustondesign.com
  arrangeInCircle: function(elements, centerX, centerY, radius){
    if(elements == null) elements = this.currentIdeaSet;
    centerX = centerX ? centerX :  $('#infovis').offsetWidth()/2;
    centerY = centerY ? centerY :  $('#infovis').offsetHeight()/2;
    radius = radius ? radius : $('#infovis').offsetHeight()/2;
  	var indexLevel = 1;
  	var i = 1;
  	var sides = ($(elements).length);
      // idealogger.log(sides);
    $(elements).each(function(){
      indexLevel++;           
      this.css({'z-index' : indexLevel}); 
      var pointRatio = i/sides;
      var xSteps = Math.cos(pointRatio*2*Math.PI);
      var ySteps = Math.sin(pointRatio*2*Math.PI);
      var pointX = centerX + xSteps * radius;
      var pointY = centerY + ySteps * radius;
      this.css({'left':pointX,'top':pointY});
      // this.draggable({'containment':"#ideaBoard"});
      i++;    
    });
  },
  /* ToDo -- implement this with cool clickable editing */
  // newPostit: function(){
  //     if(this.addPostitPtr == undefined){
  //         this.shadeBoard();
  //         this.addPostitPtr = this.createPostit(100,50,"New Idea", "Write in here", "Your name", true);
  //         this.addPostitPtr.attr('id', 'add-postit-container');
  //         var contentBox = $('#add-postit-container > .postit-content');
  //         contentBox.click(this.setupContentEdit);function(){
  //             var editContent = $('<textarea></textarea>');
  //             editContent.css({
  //                'width':'100%' 
  //             });
  //             c
  //             editContent.appendTo(contentBox);
  //         });
  //     }
  // },
  
  /* Shade and unshade bring up a semi-transparent div */
  unshadeBoard: function(){
      this.shader.hide();
  },
  
  shadeBoard: function(){
    if(this.shader == undefined){
        this.shader = $('<div></div>');
        this.shader.css({
            // 'display':'none',
            'position':'absolute',
            'left':'0',
            'top':'0',
            'width':'100%',
            'height': '100%',
            'background-color': 'white',
            'z-index': ++this.lastZindex,
            'opacity':0.7
        })
        this.shader.appendTo('#ideaBoard');
    } else {
        this.shader.css({
           'z-index': ++ideaboard.lastZindex
        });
        this.shader.show();
    }
    
  },
  
  addIdea: function(arguments){
    var localargs = arguments;
    // All new ideas have the board-postit as their parent
    if(arguments['parent_id'] == undefined) arguments['parent_id'] = ideaboard.root_id;
    var successFn = function(msg){
        //mturk-specific:
        if(mTurk.active){
            mTurk.ideas_added++;
            mTurk.id_list.push(parseInt(msg));
            if(mTurk.ideas_added == mTurk.minimum){
                alert("Thanks! You've added the minimum (or more than the minimum) ideas. You can keep going, but whenever you're ready, hit the 'Done' button to submit the results to Mechanical Turk");
            }
        }
        
        // idealogger.log(localargs);
        var newObj = {'children':[], 'id':parseInt
        (msg),'content':localargs['content'], 'parent':String(localargs['parent_id'])};
        ideaboard.ideasFromServer[msg] = newObj;
        // idealogger.log( "Data Saved: " + msg );
        // FIX THIS FOR NON-ADDON
        if(!ideaboard.ideasToChildrenMap[localargs['parent_id']]){
            ideaboard.ideasToChildrenMap[localargs['parent_id']] = new Array();
        };
        ideaboard.ideasToChildrenMap[localargs['parent_id']].unshift(newObj);
        // if(localargs['parent_id'] == 1) ideaboard.currentIdeaSet.unshift(newObj);

        // ideaboard.clearMainSpace(false);
        // ideaboard.arrangeInGrid();
        // We've dirtied the file, so we should reset the ideasArray for next time it
        // gets shuffled
        ideaboard.ideasAsArray = undefined;
        if(ideaboard.visActive) ideaboard.showAddons(null, String(localargs['parent_id']));
      };
    var data = "board_id="+ideaboard.board_id+"&content="+arguments['content']+"&parent_id="+arguments['parent_id'];
    if(mTurk.accepted == true) data += "&user=mturk";
    $.ajax({
      type: "POST",
      url: "/storm/addidea/",
      data: data,
      success: successFn});
  },
  
  addTo: function(e,id){
      e.stopPropagation();
      $('#newPostPrev').html(ideaboard.ideasFromServer[String(id)]['content']);
      $('#newPostDialog').dialog('open');
      $('#newPostAddition').focus();
      $('#saveDialogButton').unbind('click');
      $('#saveDialogButton').bind('click', function(e){
          var subText = $('#newPostAddition').attr('value');
          if(subText.length <= 5){
              alert('Please make your answer a bit longer');
              return false;
          } else{         
              ideaboard.addIdea({'content':subText,'parent_id':id});
	          $('#newPostDialog').dialog('close');
          }
      });
  },
  
  toggleSidebar: function(){
    if(ideaboard.sidebarOpen == false){
        $('#sideboard_container').dialog('open');
        ideaboard.sidebarOpen = true;
    } else {
        $('#sideboard_container').dialog('close');
        ideaboard.sidebarOpen = false;
    }
      
  },
  
  /* add totally new postit (not a build) */
  newIdea: function(){
        var content = prompt("Please describe your idea");
        if(content){
            ideaboard.addIdea({'content':content});
        }
    },
    
  /* create a Postit on the main idea space */
  createPostit: function(x,y,title,content,author,id, bringtotop){
	  alert("createpit");
    x = x ? x : 0;
    y = y ? y : 0;
    author = author ? author : "Anonymous";
    title = title ? title : 'Untitled';
    content = content ? content : "No content";
    id = id ? id : this.postitcounter++;
    var newPost = $('<div></div>');
    newPost.addClass('postit-container');
    
    newPost.css({
      'left' : x +'px',
      'top' : y+'px',
      'width': ideaboard.postitWidth,
      'height': ideaboard.postitHeight
    });
    newPost.attr('id', 'postit-'+id);
    var newPostTitle = $('<div>'+title+'</div>');
    newPostTitle.addClass('postit-title');
    newPostContent = $('<div>'+content+'</div>');
    newPostContent.addClass('postit-content');
    newPostVote = $("<div id='vote_"+id+"'><a href='#' onclick='ideaboard.positiveVote(event, '+id+');return false;'>+</a><br /><a href='#' onclick='ideaboard.negativeVote(event, '+id+');return false;'>-</a>");
	newPostVote.addClass('postit_vote');

    newPost.appendTo('#mainIdeaSpace');
    newPostTitle.appendTo(newPost);
	
    newPostContent.height(newPost.height() - 25 - 13);
    newPostContent.appendTo(newPost);
    
	//newPostVote.appendTo(newPost);

    var numChildren = ideaboard.ideasToChildrenMap[id] ? ideaboard.ideasToChildrenMap[id].length : 0;
    if(numChildren > 0){
        newPostAddCount = $("<div><a href='#' onclick='ideaboard.showAddons(event,"+id+")'>"+numChildren+" idea(s) add to this idea</a></div>");
        newPostAddCount.addClass('postit-addcounter');
        newPostAddCount.appendTo(newPost);        
    }
    
    newPostAddTo = $("<div><a href='#' id='addto_"+id+"'>Add to this idea</a></div>");
    newPostAddTo.addClass('postit-addto');    
    newPostAddTo.appendTo(newPost);
    $('#addto_'+id).click(function(e){
        ideaboard.addTo(event,"+id+");
    });
    newPost.mouseover(function() {
        $('#postit-'+id+' .postit-addto').show();
    });
    newPost.mouseout(function() {
        $('#postit-'+id+' .postit-addto').hide();
    });
    newPost.click(function(){
        ideaboard.bringIdeaForward(newPost);
        /* selection code */
        // if(id in ideaboard.selectedIdeas){
        //     newPost.css({
        //         'border':'none'
        //     });
        //     delete ideaboard.selectedIdeas[id];
        // } else {
        //     newPost.css({
        //         'border':'3px solid green'
        //     });
        //     ideaboard.selectedIdeas[id] = true;
        // }
    });
    
    newPost.draggable({'stop':ideaboard.bringIdeaForward, 'containment':"#ideaBoard"});
    newPost.fadeIn('slow');
    return newPost;
  }
  
};
