from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, get_object_or_404
from django.utils import simplejson as json
from django.http import HttpResponse
from django.utils import timezone
from models import Highscore
from models import Feedback

def crsf_render(request, url):
    c = {}
    c.update(csrf(request))
    return render_to_response(url, c)

def index(request):
    return crsf_render(request, 'index.html');

def portfolio(request):
    return crsf_render(request, 'portfolio.html');

def resume(request):
    return crsf_render(request, 'resume.html');

def contact(request):
    return crsf_render(request, 'contact.html');

@ensure_csrf_cookie
def games(request):
    return crsf_render(request, 'games.html');

@ensure_csrf_cookie
def space_game(request):
    return crsf_render(request, 'space_game.html');

@ensure_csrf_cookie
def space_game_test(request):
    return crsf_render(request, 'space_game_test.html');

@ensure_csrf_cookie
def test(request):
    return crsf_render(request, 'test.html');

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
