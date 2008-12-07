<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <link rel="stylesheet" href="/static/storm/style2.css" />
    <title>{% block title %}Homepage{% endblock %}</title>
</head>

<body>
    <div id="header">
        {% block header %}
        <div id="loginform">
			{% if user.is_authenticated %}
		    	<p>Logged in as {{ user.username }}. <a href="/accounts/logout/">Log out?</a></p>
            {% endif %}
		</div>
		<span id="logo">
			<img src="/static/storm/logo.png">
		</span>
        <img class = "stripe" src="/static/storm/stripe.jpg" alt="" width="100%" height="25" />
        {% endblock %}
    </div>
   <div id="mainmenu">
    		  <a href="/news/"> {% if news %}
           		<img src ="/static/storm/newshighlighted.png" />
                {% else %}
                <img src="/static/storm/news.png" />
                {% endif %} 
           </a>
           <br/><br/>
           <a href="/profile/myprompts/">  {% if myprompts %}
           		<img src ="/static/storm/minehighlighted.png" />
                {% else %}
                <img src="/static/storm/mine.png" />
                {% endif %} 
           </a>
           <br/><br/>
            <a href="/profile/watchedprompts/">  {% if watchedprompts %}
           		<img src ="/static/storm/watchedhighlighted.png" />
                {% else %}
                <img src="/static/storm/watched.png" />
                {% endif %} 
           </a>
           <br/><br/>
             <a href="/browseprompts/">  {% if browseprompts %}
           		<img src ="/static/storm/browsehighlithed.png" />
                {% else %}
                <img src="/static/storm/browse.png" />
                {% endif %} 
           </a>
          <br/><br/>
   </div>
    <div id="container">
    	<div id ="submenu">
    		{% block menu %} {% endblock %}
   		<div id="content">
        	{% block content %}{% endblock %}
    	</div>
   </div>
   
</body>
</html>