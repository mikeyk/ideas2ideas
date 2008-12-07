{% extends "base.tpl" %}

{% block title %}
ideas2ideas home
{% endblock %}

{% block styles %}
<style>
	li {
		list-style: none inside;
	}
</style>
{% endblock %}

{% block content %}
	
<div id="newsfeed_container">
	<div id="popular_boards"><span class="list-title">Popular Brainstorms</span>
		{% for board in board_set %}
			<li><a href="{% url board board_id=board.id %}">&ldquo;{{board.prompt}}&rdquo;</a> by {{board.author}}</a></li>
		{% endfor %}
		{# <ul> #}
		{# 	<li><a href="/storm/board/1">"How can we reduce energy consumption?"</a> by the <a href="/storm/profile/1">Department of Energy</a></li> #}
		{# 	<li><a href="/storm/board/1">"What's the next big thing in design?"</a> by <a href="/storm/profile/1">IDEO</a></li> #}
		{# 	<li><a href="/storm/board/1">"What would you like to see in a brainstorming product?"</a> by <a href="/storm/profile/1">ideas2ideas</a></li>	 #}
		{# 	</ul> #}
		</div>
	<div id="recent_boards"><span class="list-title">Recent Brainstorms</span>
		<ul>
			<li><a href="/storm/board/1">"How can we reduce energy consumption?"</a> by the <a href="/storm/profile/1">Department of Energy</a></li>
			<li><a href="/storm/board/1">"What's the next big thing in design?"</a> by <a href="/storm/profile/1">IDEO</a></li>
			<li><a href="/storm/board/1">"What would you like to see in a brainstorming product?"</a> by <a href="/storm/profile/1">ideas2ideas</a></li>	
			</ul>

	</div>
</div>
{% endblock %}