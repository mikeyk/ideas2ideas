{% extends "homepage.tpl" %}
{% block title %}My Prompts{% endblock %}
{% block menu %}
	<a href="/profile/addboard/"> 
        <img src ="/site_media/newbrainstorm.png" />
	</a>
{% endblock %}
{% block content %}
{% for board in boards %}
<div class="miniboard">
	<span class="activity"> 
    	{% if board.active %}
		Open
        {% else %}
        Closed
        {% endif %}
    </span>		
	<span class="promptname">board.prompt</span></div>
</div>
{% endfor %}
{% endblock %}