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

def lbl_display(request):
    response = crsf_render_string(request, 'lbl_display.html')
    data = LBL_Entry.objects.all()
    s = ""
    for entry in data:
        s += entry.render()
    return HttpResponse(response.replace('*inject*', s))

@csrf_exempt
def lbl_app(request):
    raw = request.POST.keys()[0]
    request = None
    query = None
    error = None
    points = None
    try:
        request = json.loads(raw)
        query = request['query'];
        if(query == 'save_points'):
            count = 0
            fields = 0
            values = 0
            locs = 0
            points = request['points']
            for point in points:
                count += 1
                values += len(point['values'])
                fields += len(point['fields'])
                if point['loc_type'] != 'none':
                    locs += 1
            store = LBL_Entry(text=raw)
            store.save();
            return HttpResponse(json.dumps({'success': count,
                                            'fields': fields,
                                            'values': values,
                                            'locs': locs}))
    except Exception as e:
        error = e.message
    return HttpResponse(json.dumps({'success': -1,
                                    'error': error if error else 'none',
                                    'query': query if query else 'none',
                                    'count': count}))

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
