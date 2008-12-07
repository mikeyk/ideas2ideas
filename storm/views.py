# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from ideas2ideas.storm.models import Board, PostIt, Cluster, WatchedPostIts
from ideas2ideas.storm import json
from ideas2ideas.storm.json import json_encode
from django.contrib.auth import authenticate, login
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.template import loader, Context
import MySQLdb
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

@login_required
def board(request, board_id):
    # study-specific
    voting_enabled = False
    sort_by_popular = False
    if "cond" in request.GET:
        if request.GET['cond'] == '1':
            voting_enabled = True
        elif request.GET['cond'] == '2':
            sort_by_popular = True
    board_obj = get_object_or_404(Board, pk=board_id)
    if(len(board_obj.postit_set.all()) == 0):
        first_postit = PostIt()
        first_postit.content = board_obj.prompt
        first_postit.author = board_obj.author
        first_postit.board = board_obj
        first_postit.save()
        board_obj.root_postit = first_postit
        print "added prime post it, id:"+str(first_postit.id)
    board_obj.visits += 1
    board_obj.save()
    request.session['board'] = board_obj;
    # for postit in board_obj.postit_set.all():
    #     for build in postit.postit_set.all():
    #         print build
    num_clusters = Cluster.objects.filter(prompt=board_obj).count()   
   # user = request.session['user']
    user = None
    if "user" in request.session:
        user = request.session['user']
    else:
        request.session['user'] = None
    if user is None:
        return render_to_response('board.tpl', {'board':board_obj,'user':request.user, 'num_clusters':num_clusters, 'voting_enabled':voting_enabled, 'sort_by_popular':sort_by_popular})
    else:
        watched = WatchedPostIts.objects.filter(user=user, board=board_obj)
        return render_to_response('board.tpl', {'board':board_obj,'user':user, 'watched_ideas':watched, 'num_clusters':num_clusters, 'voting_enabled':voting_enabled, 'sort_by_popular':sort_by_popular})
        
def index(request):
    boards = Board.objects.filter(active="1").order_by('-id')
    return render_to_response("index.tpl", {'board_set': boards, 'user':request.user,'login_failed':False})

def addvote(request):
    post = request.POST
    post_it = PostIt.objects.filter(id=post['id'])[0]
    if post['positive_vote']:
        post_it.positive_votes = post_it.positive_votes + 1
    else:
       post_it.negative_votes = post_it.negative_votes + 1
    post_it.save()
    return HttpResponse(post_it.positive_votes)

def showclusterswithidea(request):
    post = request.POST
    pid = post['id']
    user = request.user
    board = request.session.get('board', "")
    postit = PostIt.objects.filter(id=pid)[0]
    clusters = postit.cluster_set.all()
    t = loader.get_template('sidebar.tpl')
    c = Context({'clusters':clusters, 'clustermode':True, 'user':user})
    rendered = t.render(c)
    return HttpResponse(rendered)

def watchidea(request):
    post = request.REQUEST
    user = request.user
    if user is not None:
        if request.method == 'POST':
            key = post['id']
            post_it = PostIt.objects.filter(id=key)[0]
            watched = WatchedPostIts.objects.filter(postit=post_it, user=user, board=request.session['board']).count()
            if watched == 0:
                w = WatchedPostIts(postit=post_it, user=user, board=request.session['board'])
                w.save()
        user_watched =WatchedPostIts.objects.filter(user=user, board=request.session['board'])
        t = loader.get_template('sidebar.tpl')
        c = Context({'watchedideas':user_watched, 'watchingideas':True})
        rendered = t.render(c)
        return HttpResponse(rendered)
    else:
        return HttpResponse("Failed")

def showclusters(request):
    user = request.user
    board = request.session['board']
    clusters = Cluster.objects.filter(prompt=board, author=user)
    t = loader.get_template('sidebar.tpl')
    for cluster in clusters:
        if cluster.postits.count() == 0:
            cluster.delete()
    c = Context({'clusters':clusters, 'clustermode':True, 'user':user})
    rendered = t.render(c)
    return HttpResponse(rendered)

def addcluster(request):
    user = request.user
    board = request.session['board']
    if user is None:
        cluster = Cluster(prompt=board)
    else:
        cluster = Cluster(prompt=board, author=user, title="New cluster")
    cluster.save()
    return HttpResponse(cluster.id)

def addideatocluster(request):
    post = request.POST
    pid = post['id']
    cid = post['clusterid']
    editable=False
    postit = PostIt.objects.filter(id=pid)[0]
    cluster = Cluster.objects.filter(id=cid)[0]
    print request.user
    if request.user.is_authenticated():
        if request.user == cluster.author:
            editable = True
    elif cluster.author is None:
        editable = True

    if editable == True:
        cluster.postits.add(postit)
        t = loader.get_template('cluster_edit.tpl')
        c= Context({'cluster':cluster, 'editable':editable, 'ideas':cluster.postits.all()})
        rendered = t.render(c)
        return HttpResponse(rendered)
    else:
        return HttpResponse("Failed")

def savecluster(request):
    post = request.POST
    cid = post['id']
    value= post['value']
    cluster = Cluster.objects.filter(id=cid)[0]
    cluster.title = value
    cluster.save()
    return HttpResponse(cluster.title)

def removeideafromcluster(request) :
    post = request.POST
    pid = post['id']
    cid = post['clusterid']
    postit = PostIt.objects.filter(id=pid)[0]
    cluster = Cluster.objects.filter(id=cid)[0]
    editable = False
    if cluster.author is None:
        editable = True
    if request.user.is_authenticated():
        if request.user == cluster.author:
            editable = True
    if editable == True:
        cluster.postits.remove(postit)
        t = loader.get_template('cluster_edit.tpl')
        c= Context({'cluster':cluster, 'editable':editable, 'ideas':cluster.postits.all()})
        rendered = t.render(c)
        return HttpResponse(rendered)
    else:
        return HttpResponse("Failed")

def editcluster(request, clusterid):
    user = request.session['user']
    editable = False
    cluster = Cluster.objects.filter(id=clusterid)[0]
   # if cluster.author is None:
   #        editable = True
    if user is not None:
        board = request.session['board']
        cluster = Cluster.objects.filter(id=clusterid)[0]
        if cluster.author == user:
            editable = True
    elif cluster.author is None:
        editable=True
    t = loader.get_template('cluster_edit.tpl')
    c= Context({'cluster':cluster, 'editable':editable, 'ideas':cluster.postits.all()})
    rendered = t.render(c)
    return HttpResponse(rendered)
                      
def unwatchidea(request):
    post = request.REQUEST
    user = request.session['user']
    if user is not None:
        if request.method == 'POST':
            key = post['id']
            post_it = PostIt.objects.filter(id=key)[0]
            watched = WatchedPostIts.objects.filter(postit=post_it, user=user, board=request.session['board'])[0]
            watched.delete()
        user_watched =WatchedPostIts.objects.filter(user=user, board=request.session['board'])
        t = loader.get_template('sidebar.tpl')
        c = Context({'watchedideas':user_watched, 'watchingideas':True})
        rendered = t.render(c)
        return HttpResponse(rendered)
    else:
        return HttpResponse("Failed")

def duplicatecluster(request):
    post = request.POST
    pid = post['id']
    cluster = Cluster.objects.filter(id=pid)[0]
    new_cluster = Cluster(prompt=request.session['board'], author=request.session['user'], title=cluster.title + "duplicate")
    new_cluster.save()
    for postit in cluster.postits.all():
        new_cluster.postits.add(postit)
    return HttpResponse(new_cluster.id)
                          
def getclusterideas(request, clusterid):
    cluster = Cluster.objects.filter(id=clusterid)[0]
    pits = cluster.postits.all()
    user = request.user
    #if the user exists
    if cluster.author is None:
        data = json_encode(pits)
        return HttpResponse(data, mimetype='application/json')
    elif user == cluster.author:
        data = json_encode(pits)
        return HttpResponse(data, mimetype='application/json')
    return HttpResponse("Failed")

def addidea(request):
    auth_user = None
    if request.user.is_authenticated():
        auth_user = request.user
    # HACK for mturk users
    elif 'user' in request.REQUEST and request.REQUEST['user'] == 'mturk':
        auth_user = authenticate(username='mturk', password='mturk')
    else:
        raise Exception
        
    if 'board_id' in request.REQUEST  and 'content' in request.REQUEST and 'parent_id' in request.REQUEST:
        newIdea = PostIt()
        board_obj = get_object_or_404(Board, pk=request.REQUEST['board_id'])
        newIdea.board = board_obj
        newIdea.author = auth_user
        newIdea.content = request.REQUEST['content']
        try:
            newIdea.parent = PostIt.objects.get(id=request.REQUEST['parent_id'])
        except ObjectDoesNotExist:
            print "Specified parent doesn't exist"
        newIdea.save()
        return HttpResponse(newIdea.id)
    else:
        return HttpResponse("FAILED")

#def addcluster(request):
#    post = request.POST
#    if 'board_id' in post and 'user' in request.session and 'ideas' in post:
#        try:
#            board_obj = get_object_or_404(Board, pk=post['board_id'])
#            cluster = Cluster()
#            cluster.title=''
#            cluster.author = request.session['user']
#            cluster.prompt = board_obj
#            cluster.save()
#            ideas = post['ideas'].split(',')
#            for idea in ideas:
#                postit= PostIt.objects.filter(id=idea)[0]
#                cluster.postits.add(postit)
#            cluster.save()
#            num_clusters = Cluster.objects.filter(prompt=board_obj).count()
#            return HttpResponse(num_clusters)
#        except Exception, e:
#            return HttpResponse(e)
#    else:
#       return HttpResponse("Not Saved")
            
def tagideas(request):
    post = request.POST
    board_obj = get_object_or_404(Board, pk=post['board_id'])
    tags = post['tags'].split(',')
    ideas = post['ideas'].split(',')
    for idea in ideas:
        postit= PostIt.objects.filter(id=idea)[0]
        for tag in tags:
            postit.tags.add(tag)
            
# def get_ideas_for_board(request):
#     if 'board_id' in request.POST and 'num_ideas' in request.POST:
#         board_id = request.POST['board_id']
#         num_ideas = request.POST['num_ideas']
#         board_obj = get_object_or_404(Board, pk=board_id)
#         

def create_account(request):

    form = UserCreationForm()
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect("/accounts/login?next="+request.REQUEST.get("next", ""))
    t = loader.get_template('registration/create.html')
    c = Context({'form':form})
    return HttpResponse(t.render(c))

def login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            # request.session['user']=user
            return news(request)
        else:
            return render_to_response("index.tpl", {'user':request.user,'login_failed':True})
    else:
        return render_to_response("index.tpl", {'user':request.user,'login_failed':True})
    
def news(request):
    # user = request.session['user']
    return render_to_response("homepage.tpl", {'user':request.user, 'news':True})

def myprompts(request):
    user = request.session['user']
    boards = Board.objects.filter(author=request.user.username);
    return render_to_response("myprompts.tpl", {'user':user, 'myprompts':True})
