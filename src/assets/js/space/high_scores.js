import { withId } from '../util.js';

export { initHighScores };

var hsRank;
var end = false;

function initHighScores() {
    getHighScores(1);
    withId('highscore_button').onclick = submitHighscore;
    withId('hs_left').onclick = function() {
        getHighScores(hsRank-10);
    };
    withId('hs_right').onclick = function() {
        getHighScores(hsRank+10);
    };
    withId('hs_goto_button').onclick = function() {
        getHighScores(parseInt(withId('hs_goto').val()));
    };
    withId('feedback_button').onclick = function() {
        submitFeedback()
    };
    withId('feedback_input').onfocusin = function() {
        keysEnabled = true;
    };
    withId('feedback_input').onfocusout = function() {
        keysEnabled = false;
    };
}

function feedbackPosted(request) {
    alert('Your feedback has been recorded. Thanks a bunch!');
}

function submitFeedback() {
    var text = withId('feedback_input').text();
    if(text.length > 500) text = text.substring(0, 499);
     $.post('/portfolio/query/',
       { 'query': 'submit_feedback',
         'text': text },
       feedbackPosted,
        'json'
    );
}

function highScorePosted(response) {
    if(response.refresh == '1') {
    fillHighScores(response);
    }
    var rankText = 'Rank: '+response.rank
    var s = rankText.size(c.font)
    c.fillText(rankText, C_WIDTH / 2 - s[0]/2, C_HEIGHT / 2 + 160);
    withId('submit_highscore').hide();
}

function submitHighscore() {
    var name = escapeHtml(withId('highscore_name').val());
    if(name.length < 2 || name.length > 20) {
        alert('Name must be between 2 and 20 characters (inclusive).');
        return;
    }
    $.post('/portfolio/query/',
        {
            'query': 'set_highscore',
            'name': name,
            'val': score.toString()
        },
        highScorePosted,
        'json'
    );
}

function fillHighScores(response) {
    var data = '';
    var names = response.names;
    var scores = response.scores;
    var rank = hsRank;
    if(response.ind) {
        rank = parseInt(response.ind);
        hsRank = rank;
    }
    for(var i = 0; i < names.length; i++) {
        data += '<tr><td>' + (rank + i) + '.</td><td>' + escapeHtml(names[i]) + '</td><td>'+scores[i] + '</td></tr>';
    }
    withId('scores').html(data);
    end = names.length < 10;
}

function getHighScores(rank) {
    if(rank <= -9 || (rank > hsRank && end)) return;
    if(rank < 1) rank = 1;
    end = false;
    hsRank = rank;
    $.post('/portfolio/query/',
        { 'query': 'get_highscores', 'rank': rank },
        fillHighScores,
        'json'
    );
}
