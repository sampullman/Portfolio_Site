import datetime
from django.db import models
from django.db.models import Count
from django.utils import timezone
from django.utils import simplejson as json
from django.core.serializers.json import DjangoJSONEncoder

class Highscore(models.Model):
    name = models.CharField(max_length=30)
    date = models.DateTimeField('date published')
    score = models.IntegerField()

    class META:
        ordering = ['-score']

    def ranking(self):
        scores = Highscore.objects.filter(score__gt=self.score)
        return len(scores)+1

    def __unicode__(self):
        return self.name+": "+str(self.score)

class Feedback(models.Model):
    text = models.CharField(max_length=500)
    date = models.DateTimeField('date published')

    def __unicode__(self):
        return self.text[:10]

class LBL_Entry(models.Model):
    text = models.CharField(max_length=2000)

    def to_python(self):
        """Convert our string value to JSON after we load it from the DB"""
        value = json.loads(self.text)
        assert isinstance(value, dict)
        return value

    def get_json(value):
        """Convert our JSON object to a string before we save"""
        assert isinstance(value, dict)
        value = json.dumps(value, cls=DjangoJSONEncoder)
        return json

    def render(self):
        data = self.to_python()
        s = "<p>"
        points = data['points']
        for p in points:
            loc = p['loc']
            time = datetime.datetime.fromtimestamp(float(p['time']))
            s += "Time: "+str(time)+"<br />"
            if loc == "none":
                s += "Location: none<br />"
            else:
                s += "Location from "+p['loc_type']+" = "+loc[0]+", "+loc[1]+"<br />"
            for f, v in zip(p['fields'], p['values']):
                s += "Field="+f+", Value="+v+"<br />"
            s += "<br />"
        s += "<br />"
        return s

    def __unicode__(self):
        return self.text

    
