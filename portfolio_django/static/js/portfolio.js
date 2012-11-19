var prefix = "https://dl.dropbox.com/sh/";
var left_btn=prefix+"631wm7d11mdr3mj/zXoFz1gIIO/portfolio/static/images/left_btn.png";
var right_btn=prefix+"631wm7d11mdr3mj/OAjEfNhU4k/portfolio/static/images/right_btn.png";
var left_btn_pressed=prefix+"631wm7d11mdr3mj/tnXjEd_4H-/portfolio/static/images/left_btn_pressed.png";
var right_btn_pressed=prefix+"631wm7d11mdr3mj/hM3iXwe34W/portfolio/static/images/right_btn_pressed.png";

var scigraph = [
    prefix+"631wm7d11mdr3mj/svvpe0Hm88/portfolio/static/images/SciGraph_Calculator/screenshot0.png",
    prefix+"631wm7d11mdr3mj/fO-jv2P70d/portfolio/static/images/SciGraph_Calculator/screenshot1.png",
    prefix+"631wm7d11mdr3mj/Yf4NBoo95P/portfolio/static/images/SciGraph_Calculator/screenshot2.png",
    prefix+"631wm7d11mdr3mj/PbVeiMs_vD/portfolio/static/images/SciGraph_Calculator/screenshot3.png",
    prefix+"631wm7d11mdr3mj/WAZKQ0n2kI/portfolio/static/images/SciGraph_Calculator/screenshot4.png",
    prefix+"631wm7d11mdr3mj/zkbbFQNQ9w/portfolio/static/images/SciGraph_Calculator/screenshot5.png",
    prefix+"631wm7d11mdr3mj/yHEtpILoOv/portfolio/static/images/SciGraph_Calculator/screenshot6.png" ];

var mmc = [
    prefix+"631wm7d11mdr3mj/ffUbZSRWoN/portfolio/static/images/Molecular_Mass_Calculator/screenshot0.png",
    prefix+"631wm7d11mdr3mj/2zAMib0kJh/portfolio/static/images/Molecular_Mass_Calculator/screenshot1.png",
    prefix+"631wm7d11mdr3mj/WZyo1lzP2m/portfolio/static/images/Molecular_Mass_Calculator/screenshot2.png" ];

var cube = [
    prefix+"631wm7d11mdr3mj/v4GmmeD5oo/portfolio/static/images/Cube_Droid/screenshot0.png",
    prefix+"631wm7d11mdr3mj/LTbbAVcrj8/portfolio/static/images/Cube_Droid/screenshot1.png",
    prefix+"631wm7d11mdr3mj/Czud-P6-mT/portfolio/static/images/Cube_Droid/screenshot2.png" ];

var quiz = [
    prefix+"631wm7d11mdr3mj/207uRPrb5F/portfolio/static/images/Quiz_Droid/screenshot0.png",
    prefix+"631wm7d11mdr3mj/JDwCQLHJC_/portfolio/static/images/Quiz_Droid/screenshot1.png",
    prefix+"631wm7d11mdr3mj/hHnyRbpZLt/portfolio/static/images/Quiz_Droid/screenshot2.png",
    prefix+"631wm7d11mdr3mj/QmHKlXGBU9/portfolio/static/images/Quiz_Droid/screenshot3.png" ];

var comics = [
    prefix+"631wm7d11mdr3mj/94X5dCyQ5U/portfolio/static/images/Web_Comic_Reader/screenshot0.png",
    prefix+"631wm7d11mdr3mj/Bzn7XX2Q8L/portfolio/static/images/Web_Comic_Reader/screenshot1.png",
    prefix+"631wm7d11mdr3mj/uSLGi9I_6T/portfolio/static/images/Web_Comic_Reader/screenshot2.png" ];

var number_slide = [
    prefix+"631wm7d11mdr3mj/r2mGvEGcJi/portfolio/static/images/Number_Slide/screenshot0.png",
    prefix+"631wm7d11mdr3mj/3bApQ-1Sxx/portfolio/static/images/Number_Slide/screenshot1.png",
    prefix+"631wm7d11mdr3mj/uIzza-1GQv/portfolio/static/images/Number_Slide/screenshot2.png",
    prefix+"631wm7d11mdr3mj/ic7hRGAUgo/portfolio/static/images/Number_Slide/screenshot3.png" ];

var screenshots = [scigraph, mmc, cube, quiz, comics, number_slide];

$(document).ready(function(){
    var urlParams = {};
    (function () {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

	while (match = search.exec(query))
	    urlParams[decode(match[1])] = decode(match[2]);
    })();

    var appNames = ['SciGraph_Calculator', 'Molecular_Mass_Calculator', 'Cube_Droid', 'Quiz_Droid',
		    'Web_Comic_Reader', 'Number_Slide'];
    var numImgs = [7, 3, 3, 4, 3, 4];
    var imgInd = 0;
    var curApp = 0;

    function getAppTitle(ind) {
	return appNames[ind].replace(/_/g, ' ');
    }

    for(var i=0;i<appNames.length;i+=1) {
	$('#android_selector').append('<span class="android_selector_item" id="android_app_'+
				      i.toString()+'"><a href="#nothing" >'+getAppTitle(i)+'</a></span>');
    }
    $("#android_app_0").css('background-color', '#32B4E6');
    $("#android_app_0").css('border-top-style', 'solid');

    $(".screenshot").attr('src', screenshots[curApp][imgInd]);
    $("#android_portfolio_subtitle").html(getAppTitle(curApp));
    $("#android_portfolio_text").html($("#"+appNames[curApp]+".hidden_portfolio_text").html());

    function switchImg(incr) {
	imgInd += incr;
	if(imgInd < numImgs[curApp] && imgInd >= 0) {
	    setImg();
	} else {
	    imgInd -= incr;
	}
    }

    function setImg() {
	$(".screenshot")
	    .fadeOut(400, function() {
		$(".screenshot").attr('src', screenshots[curApp][imgInd]);
	    })
	    .fadeIn(400);
    }

    $(".android_selector_item").click(function(e) {
	var idArr = $(this).attr('id').split("_");
	var newApp = parseInt(idArr[idArr.length-1]);
	if(newApp != curApp) {
	    $("#android_app_"+curApp.toString()).css('background-color', 'transparent');
	    $("#android_app_"+newApp.toString()).css('background-color', '#32B4E6');
	    curApp = newApp;
	    imgInd = 0;
	    setImg();
	    $("#android_portfolio_subtitle").html(getAppTitle(curApp));
	    $("#android_portfolio_text").html($("#"+appNames[curApp]+".hidden_portfolio_text").html());
	    $("#img_nav_right").css('visibility','visible');
	    $("#img_nav_left").css('visibility','hidden');
	}
    });

    $("#img_nav_right").click(function(e) {
	switchImg(1);
	$("#img_nav_left").css('visibility','visible');
	if(imgInd == numImgs[curApp]-1) {
	    $("#img_nav_right").css('visibility','hidden');
	}
    });
    $("#img_nav_right").mousedown(function(e) {
	$(this).attr('src', right_btn_pressed);
    }).mouseup(function(e) {
	$(this).attr('src', right_btn);
    }).mouseout(function(e) {
	$(this).attr('src', right_btn);
    });

    $("#img_nav_left").click(function(e) {
	switchImg(-1);
	$("#img_nav_right").css('visibility','visible');
	if(imgInd == 0) {
	    $("#img_nav_left").css('visibility','hidden');
	}
    });
    $("#img_nav_left").mousedown(function(e) {
	$(this).attr('src', left_btn_pressed);
    }).mouseup(function(e) {
	$(this).attr('src', left_btn);
    }).mouseout(function(e) {
	$(this).attr('src', left_btn);
    });
});