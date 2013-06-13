function loadMainStyles() {
    $(".contact_icon_holder").tipsy({title: function() {
		return $(this).find("a").attr('id');
	},
	fade: true, gravity: 'n' });
}