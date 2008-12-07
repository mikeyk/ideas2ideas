from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.admin import site

class Category(models.Model):
  name = models.TextField()
  def __unicode__(self):
    return self.name
  class Admin:
    pass

class Board(models.Model):
  prompt = models.TextField()
  author = models.ForeignKey(User)
  categories = models.ManyToManyField(Category, blank=True, null=True)
  visits = models.IntegerField(default=0, editable=False)
  responses = models.IntegerField(default=0, editable=False)
  added = models.DateTimeField(default=datetime.now(), null=True, editable=False)
  active = models.IntegerField(default=1)
  root_postit = models.ForeignKey('PostIt', related_name="root", blank=True, null=True)
  def __unicode__(self):
    return "%s by %s" % (self.prompt, self.author)
  class Admin:
    pass

class Tag(models.Model):
  title = models.TextField()
  count = models.IntegerField(default=0)
  def __unicode__(self):
    return "%s" % (self.title)
  class Admin:
    pass
  
class PostIt(models.Model):
  content = models.TextField()
  author = models.ForeignKey(User)
  board = models.ForeignKey(Board, null=True)
  added = models.DateTimeField(default=datetime.now(), null=True, editable=False)
  tags = models.ManyToManyField(Tag)
  modified = models.DateField(auto_now=True, null=True)
  parent = models.ForeignKey('self', null=True)
  positive_votes = models.IntegerField(default=0)
  negative_votes = models.IntegerField(default=0)
  def __unicode__(self):
    return "%s - %s" % (str(self.id), self.content)
  class Admin:
    pass

class WatchedPostIts(models.Model):
  postit = models.ForeignKey(PostIt)
  user = models.ForeignKey(User)
  board = models.ForeignKey(Board)
  def __unicode__(self):
    return "%s" % (str(self.postit.id))
  class Admin:
    pass
  
class Cluster(models.Model):
  title = models.TextField()
  prompt=models.ForeignKey(Board)
  author = models.ForeignKey(User, null=True, blank=True)
  postits = models.ManyToManyField(PostIt)
  added = models.DateTimeField(default=datetime.now(), null=True, editable=False)
  def __unicode__(self):
    return self.title
  class Admin:
    pass
    
site.register(Cluster)
site.register(PostIt)
site.register(Board)


