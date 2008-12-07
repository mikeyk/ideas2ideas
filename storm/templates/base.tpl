<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <link rel="stylesheet" href="/static/storm/style.css" />
	<script src="http://www.google.com/jsapi"></script>
	<script>
	  // Load jQuery
	  google.load("jquery", "1");
	</script>
{#	<script src="/static/storm/script/ui/effects.core.min.js" type="text/javascript" charset="utf-8"></script> #}
{#	<script src="/static/storm/script/jquery.corner.js" type="text/javascript" charset="utf-8"></script> #}
{#	<script src="/static/storm/script/ui/jquery.dimensions.min.js" type="text/javascript" charset="utf-8"></script> #}
	{# <script src="/static/storm/script/ui/ui.core.min.js" type="text/javascript" charset="utf-8"></script> #}
	{# <script src="/static/storm/script/ui/ui.draggable.min.js" type="text/javascript" charset="utf-8"></script> #}
	{# <script src="/static/storm/script/ui/ui.droppable.min.js" type="text/javascript" charset="utf-8"></script> #}

	<script src="/static/storm/script/ui/jquery.dropshadow.js" type="text/javascript" charset="utf-8"></script>
	{% block styles %}{% endblock %}
		

	{% block includes %} {% endblock %}
    <title>{% block title %}My amazing site{% endblock %}</title>
</head>

<body>
    <div id="header">
        {% block header %}
        <div id="loginform" >
			{% if user.is_authenticated %}
		    	<p>Logged in as {{ user.username }}. <a href="/accounts/logout/">Log out?</a></p>
			{% else %}
			<a href="{% url login %}">Log in</a>
			{# <form method="post" action="/accounts/login/"> #}
			{# <!-- <label for="id_username">Username:</label> --> <input type="text" name="username"> #}
			{# <!-- <label for="id_password">Password:</label> --> <input type="password" name="password" /> #}
			{# <input type="submit" value="Login"> #}
			{# </form> #}
            <a href="{% url create-account %}">Sign up</a>
            {% endif %}
        	{% if login_failed %}
            	<span id="error"> Your username and password do not match, please try again. Or sign up :) </p>
            {% endif %}
		</div>
{# <span id="logo"> #}
{# 	<img src="/static/storm/logo.png"> #}
{# </span> #}
{# <img class = "stripe" src="/static/storm/stripe.jpg" alt="" width="100%" height="25" /> #}
        {% endblock %}
    </div>
    <div id="content">
        {% block content %}{% endblock %}
    </div>
</body>
</html>
