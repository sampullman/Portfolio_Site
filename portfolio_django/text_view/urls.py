from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'text_view.views',
    url(r'^$', 'base'),
    url(r'^contact/$', 'contact'),
    url(r'^portfolio/query/$', 'post_request'),
    url(r'^portfolio/$', 'portfolio'),
    url(r'^resume/$', 'resume'),
    url(r'^games/space_game/$', 'space_game'),
    url(r'^games/$', 'games'),

    url(r'^_test$', 'index_test'),
    url(r'^test$', 'test'),
    url(r'^demo$', 'test'),
    url(r'^portfolio_test/$', 'portfolio_test'),
    url(r'^games_test/$', 'games_test'),
    url(r'^games/space_game_test/$', 'space_game_test'),
)
