from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'text_view.views',
    url(r'^$', 'index'),
    url(r'^contact/$', 'contact'),
    url(r'^portfolio/query/$', 'post_request'),
    url(r'^portfolio/$', 'portfolio'),
    url(r'^resume/$', 'resume'),
    url(r'^test/$', 'test'),
    url(r'^games/space_game_test/$', 'space_game_test'),
    url(r'^games/space_game/$', 'space_game'),
    url(r'^games/$', 'games'),
)
