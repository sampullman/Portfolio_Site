from django.db import models
from django.db.models import Count
from django.utils import timezone
import datetime

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
