<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <link rel="stylesheet" href="/site_media/style2.css" />
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
			<img src="/site_media/logo.png">
		</span>
        <img class = "stripe" src="/site_media/stripe.jpg" alt="" width="100%" height="25" />
        {% endblock %}
    </div>
   <div id="mainmenu">
    		  <a href="/news/"> {% if news %}
           		<img src ="/site_media/newshighlighted.png" />
                {% else %}
                <img src="/site_media/news.png" />
                {% endif %} 
           </a>
           <br/><br/>
           <a href="/profile/myprompts/">  {% if myprompts %}
           		<img src ="/site_media/minehighlighted.png" />
                {% else %}
                <img src="/site_media/mine.png" />
                {% endif %} 
           </a>
           <br/><br/>
            <a href="/profile/watchedprompts/">  {% if watchedprompts %}
           		<img src ="/site_media/watchedhighlighted.png" />
                {% else %}
                <img src="/site_media/watched.png" />
                {% endif %} 
           </a>
           <br/><br/>
             <a href="/browseprompts/">  {% if browseprompts %}
           		<img src ="/site_media/browsehighlithed.png" />
                {% else %}
                <img src="/site_media/browse.png" />
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