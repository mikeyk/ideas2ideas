<div id="sidebar" align="center" style="top:100px;">
{% if watchingideas %}
{% for idea in watchedideas %}
	<div id="yellow_sticky" onclick='ideaboard.rgraph.recenterOnId({{idea.postit.id}});' style="margin:6px;background-color:#FFFF99; font-size:80%; width:100px; padding:6px">
		{{idea.postit.content}}<br/><br/>
		<a href='#' onclick='ideaboard.stopWatchingIdea(event, {{idea.postit.id}});'>stop watching</a>
		<br/>
		<a href='#' onclick='ideaboard.addTo(event,{{idea.postit.id}});'>add to this</a>
	</div>
{% endfor%}
{% endif %}
{% if clustermode %}
<input type="button" value="Create new cluster" onClick="ideaboard.createNewCluster(event);"/>
	{% for cluster in clusters %}
	<div id='cluster' name='{{cluster.id}}' style="margin:6px; background-color:#3333CC; font-size:90%; width:100px; height:70px">
		{% ifequal cluster.author user %}
			<input type="text" size=12 id='clustertitle_{{cluster.id}}' value="{{cluster.title}}" onChange="ideaboard.saveCluster(this.value, {{cluster.id}})" onkeydown="ideaboard.saveCluster(this.value, {{cluster.id}})"/><br/>
		{% else %}
			<p align="center" onClick='ideaboard.editCluster(event, {{cluster.id}});'>{{cluster.title}}</p>
		{% endifequal %}
		<div onClick='ideaboard.editCluster(event, {{cluster.id}});'>{{ cluster.postits.count }} ideas in this cluster	</div>
	</div>
	{% endfor %}
{% endif %}
</div>
{% if clustermode %}
<br/><div id="relevant cluster" style="top:90px;">
<input type="button" value="Show clusters with current idea" onClick="ideaboard.showClustersWithCurrentIdea();" />
</div>
{%endif%}