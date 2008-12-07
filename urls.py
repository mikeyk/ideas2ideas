from django.conf.urls.defaults import *
from django.contrib.admin import site
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^i2i/', include('i2i.foo.urls')),

    url(r'^$', 'ideas2ideas.storm.views.index', name="index"),
    url(r'^board/(?P<board_id>\d+)/$', 'ideas2ideas.storm.views.board', name="board"),
    (r'^addidea/$', 'ideas2ideas.storm.views.addidea'),
    (r'^tagallideas/$', 'ideas2ideas.storm.views.tagideas'),
    (r'^addcluster/$', 'ideas2ideas.storm.views.addcluster'),
    (r'^addvote/$', 'ideas2ideas.storm.views.addvote'),
    # (r'^accounts/login/$', 'ideas2ideas.storm.views.login'),
    url(r'^accounts/$', 'ideas2ideas.storm.views.index'),        
    url(r'^accounts/login/', 'django.contrib.auth.views.login', name="login"),    
    url(r'^accounts/postregister/', 'django.contrib.auth.views.login', name="post-register"),        
    (r'^accounts/logout/$', 'django.contrib.auth.views.logout'),
    url(r'^accounts/register/$', 'ideas2ideas.storm.views.create_account', name='create-account'),
    (r'^profile/myprompts/$', 'ideas2ideas.storm.views.myprompts'),
    (r'^watchidea/$', 'ideas2ideas.storm.views.watchidea'),
    (r'^unwatchidea/$', 'ideas2ideas.storm.views.unwatchidea'),
    (r'^showclusters/$', 'ideas2ideas.storm.views.showclusters'),
    (r'^addcluster/$', 'ideas2ideas.storm.views.addcluster'),
    (r'^addideatocluster/$', 'ideas2ideas.storm.views.addideatocluster'),
    (r'^duplicatecluster/$', 'ideas2ideas.storm.views.duplicatecluster'),
    (r'^showclusterswithidea/$', 'ideas2ideas.storm.views.showclusterswithidea'),
    (r'^removeideafromcluster/$', 'ideas2ideas.storm.views.removeideafromcluster'),
    (r'^savecluster/$', 'ideas2ideas.storm.views.savecluster'),
    (r'^getclusterideas/(\d+)/$', 'ideas2ideas.storm.views.getclusterideas'),
    (r'^editcluster/(\d+)/$', 'ideas2ideas.storm.views.editcluster'),
    (r'^news/$', 'ideas2ideas.storm.views.news'),                   
    (r'^static/storm/(?P<path>.*)$', 'django.views.static.serve', {'document_root': '/Users/mkrieger/src/i2i/ideas2ideas/storm/static/'}),
    # Uncomment this line for admin:
    (r'^admin/(.*)', site.root),
)
