function loadMainStyles() {
    $("#header").corner("bottom 20px");
    $("#footer").corner("top 30px");
    //$(".footer_icon_holder").tipsy({title: function() { return $(this).find("a").attr('id');}, fade: true, gravity: 's' });
}

$(document).ready(function(){
    loadMainStyles();
});
