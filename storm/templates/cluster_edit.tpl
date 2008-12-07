<div id="sidebar" align="center">
{# <input type="button" value="Start clustering" onClick="ideaboard.createNewCluster();"/><br/> #}
<!--<input type="button" value="Duplicate cluster" onClick='ideaboard.duplicateCluster({{cluster.id}});'/><br/>-->
{% if editable %}
	<input type="text" value='{{cluster.title}}' size='15' onChange="ideaboard.saveCluster(this.value, {{cluster.id}})"  onkeydown="ideaboard.saveCluster(this.value, {{cluster.id}})" "style="margin-top:5px;"/>
{% else %}
	<p align="center">Start adding ideas by choosing "add to cluster" from them</p>
{% endif %}
<input type="button" value="Done" onClick="ideaboard.enterClusterMode();"/><br/>
{% for idea in ideas %}
	<div id="yellow_sticky" style="margin:6px; background-color:#FFFF99; font-size:80%; width:100px; padding:6px">
		{{idea.content}}<br/><br/>
		{% if editable %}
			<a href='#' onclick='ideaboard.removeIdeaFromCluster(event, {{idea.id}});'>remove from cluster</a>
		{% endif %}
		<br/>
		<a href='#' onclick='ideaboard.addTo(event,{{idea.id}});'>add to this</a>
	</div>
{% endfor %}
</div>