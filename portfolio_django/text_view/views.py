from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt   
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, get_object_or_404
from django.utils import simplejson as json
from django.http import HttpResponse
from django.utils import timezone
from django.template.loader import render_to_string
from models import *

def crsf_render(request, url):
    c = {}
    c.update(csrf(request))
    return render_to_response(url, c)

def crsf_render_string(request, url):
    c = {}
    c.update(csrf(request))
    return render_to_string(url, c)

def base(request):
    return crsf_render(request, 'base.html');

@ensure_csrf_cookie
def games(request):
    return crsf_render(request, 'games.html');

@ensure_csrf_cookie
def space_game(request):
    return crsf_render(request, 'space_game.html');

def test(request):
    return crsf_render(request, 'test.html');

def index_test(request):
    return crsf_render(request, 'index_test.html');

def portfolio_test(request):
    return crsf_render(request, 'portfolio_test.html');

@ensure_csrf_cookie
def games_test(request):
    return crsf_render(request, 'games_test.html');

@ensure_csrf_cookie
def space_game_test(request):
    return crsf_render(request, 'space_game_test.html');

def getHighScores(rank):
    top = Highscore.objects.all().order_by("-score")[rank-1:rank+9]
    names = []
    scores = []
    for hs in top:
        names.append(hs.name)
        scores.append(str(hs.score))
    return {'names': names, 'scores': scores}

def post_request(request):
    query = request.POST["query"];
    if query == "set_highscore":
        name = request.POST["name"];
        val = request.POST["val"];
        hs = Highscore(name=name, score=val, date=timezone.now())
        hs.save()
        rank = hs.ranking()
        r = 1 if rank <= 10 else rank-4
        resp = getHighScores(r)
        resp["rank"] = str(rank)
        resp["ind"] = str(r)
        resp["refresh"] = "1"
        return HttpResponse(json.dumps(resp))
    elif query == "get_highscores":
        rank = int(request.POST["rank"])
        return HttpResponse(json.dumps(getHighScores(rank)))
    elif query == "submit_feedback":
        fb = Feedback(text=request.POST["text"], date=timezone.now())
        fb.save()
        return HttpResponse(json.dumps({"success": 1}))
