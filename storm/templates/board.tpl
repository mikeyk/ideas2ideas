{% extends "base.tpl" %}

{% block includes %}
<link rel="stylesheet" href="/static/storm/board.css" type="text/css" media="screen" title="no title" charset="utf-8">
<script src="/static/storm/script/jquery-ui.packed.js" type="text/javascript" charset="utf-8"></script>
<script src="/static/storm/script/RGraph.js" type="text/javascript" charset="utf-8"></script>
<script src="http://www.google.com/jsapi"></script>
<script>
  // Load jQuery
  google.load("jquery", "1");
</script>

<script type="text/javascript" charset="utf-8">
$(document).ready(function(){
   $("#newPostDialog").dialog({'width':'200', 'height':'20', 'close':function(){$('#newPostAddition').attr("value","")}});
	$('#newPostDialog').dialog('close');
 });

</script>

{# <script type="text/javascript" src="/static/storm/script/Hypertree.js" ></script> #}
<script src="/static/storm/script/board.js" type="text/javascript" charset="utf-8"></script>
{% endblock %}
{% block title %}IdeaBoard for "{{board.prompt}}"{% endblock %}

{% block content %}

<a href="{% url index  %}">Back home</a>

<div id="preinstructions" style="display:none;color:red;font-size:120%">Please accept this HIT before participating</div>
<div id="instructions"></div>
<script type="text/javascript" charset="utf-8">
if(mTurk && mTurk.active == true){
	$('#instructions').html("Please note that this HIT requires either Firefox 2+ or Safari 3+. <br/>In this HIT, you'll be participating in a brainstorm. You are asked to contribute three ideas, either by Adding New Ideas (by clicking the Add New Idea) button, or by adding to / building off existing ideas (By clicking on \"add to this idea\" on any of the Post-It notes). If none of the ideas inspire you, click \"Shuffle ideas\" to get a new set. After you\'ve added/added to three or more ideas, please click \"Done Participating\". Thanks -- we're researching brainstorming for a graduate research class. Please let us know if you have any comments or suggestions.<br/><br/><strong>{{ board.prompt }}</strong><br/>");
}
</script>
<script type="text/javascript" charset="utf-8">
var counter = 0;

{% for postit in board.postit_set.all %}
	{% for build in postit.postit_set.all %}
		if(ideaboard.ideasToChildrenMap['{{postit.id}}'] == undefined){
			ideaboard.ideasToChildrenMap['{{postit.id}}'] = new Array();
		}
		ideaboard.ideasToChildrenMap['{{postit.id}}'].push({'content': '{{ build.content }}', 'id':{{build.id}}});
	{% endfor %}
    ideaboard.ideasFromServer['{{postit.id}}'] = {'content': '{{ postit.content }}', 'id':{{postit.id}}, 'parent':'{{postit.parent.id}}'};
	counter++;
{% endfor %}

{% for postit in watched_ideas %}
	ideaboard.watchedIdeas['{{postit.postit.id}}'] = true;
{% endfor %}

ideaboard.ideasToChildrenMap['0'] = ideaboard.ideasToChildrenMap[{{board.root_postit.id}}];
ideaboard.ideasFromServer['length'] = counter;
ideaboard.board_id = {{board.id}};
ideaboard.root_id = {{board.root_postit.id}};
{% if voting_enabled %} ideaboard.votingEnabled = true; {% endif %}
{% if sort_by_popular %} ideaboard.sortMode = 'popular'; {% endif %}
</script>

<div id="topButtons">
{# <input type="button" value="Add new Idea" onclick="ideaboard.newIdea()"/> #}
<input type="button" onclick="ideaboard.populateWithShuffled()" value="Shuffle ideas to see new ones"/>
{# <input type="button" id="close_vis_button" value="Close tree view"/> #}
<form id="mturk_form" method="POST" action="http://www.mturk.com/mturk/externalSubmit">
	<input type="hidden" id="assignmentId" name="assignmentId" value="">
	{# <input type="submit" id="done_participating_button"  value="Done Participating"/> #}
	<input type="hidden" id="idList" name="idList"/>
</form>
<input type="button" onclick="ideaboard.toggleSidebar();" value="Toggle clustering/watching sidebar"/>
<input type="button" onclick="ideaboard.recenterOnPrompt();" value="Recenter ideas around the prompt" />
</div>
	<div id="sideboard_container">
 	Show:
    <a href="#" onclick="ideaboard.enterClusterMode(event);return false">Clusters</a>
    <a href="#" onclick="ideaboard.showWatched();return false">Watched ideas</a>
     <div id="sideboard"></div>
</div>        
<div id="status_msgs"></div>

<div id="vis_container">
	<div id="zoom" align="center"> 
        <input type="button" id="zoom_in" value="+" onclick="ideaboard.zoom_in(event)" /> <br/>
    	<span id="level_5" style="margin:8px;">-</span><br/>
        <span id="level_4" style="margin:8px;">-</span><br/>
        <span id="level_3" style="margin:8px; font-size:18px">-</span><br/>
        <span id="level_2" style="margin:8px;">-</span><br/>
        <span id="level_1" style="margin:8px;">-</span><br/>
        <input type="button" id="zoom_out" value="-" onclick="ideaboard.zoom_out(event)" /></div>
	<canvas id="infovis"></canvas>
	<div id="label_container"></div>
    <div id="error_container"></div>
</div>

{# <div id="ideaBoard"> #}
	{#  #}
	{# <div id="collectionSpaceContainer"> #}
	{# 	<div id="collectionSpace"></div> #}
	{# 	<input type="button" id="save_cluster_btn" value="Save as Cluster"/> #}
	{# 	<input type="button" id="tag_ideas_btn" value="Tag all"/> #}
	{# 	<input type="button" value="These are great!"/> #}
	{# 	<input type="button" value="These are irrelevant."/> #}
	{# 	<input type="button" value="Clear"/> #}
	{# </div> #}
		{# <div id="mainIdeaSpace">	 #}
		{# </div> #}
	{# </div> #}

<div id="newPostDialog" class="flora" title="Add (to) Idea">You are building off: <div id="newPostPrev"></div><br/><br/>You'd like to add:<br/> <textarea id="newPostAddition"></textarea><br/><input type="button" id="saveDialogButton" value="Add"/><input type="button" onclick="$('#newPostDialog').dialog('close');" value="Close"/></div>

{% endblock %}
