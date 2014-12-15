var contentWidth = $(window).width() - 250;
var contentHeight = $(window).height();
var demiHeight = contentHeight / 2;
var labels = ["home", "about", "story"];

$(document).keydown(function(e){
	if (rubActive != labels[2] || !$("#submenu ul li.current")[0]) {
		return false;
	}
	var sibling = null;
    if (e.keyCode == 38) {
    	sibling = $("#submenu ul li.current")[0].previousElementSibling;
    } else if (e.keyCode == 40) { 
    	sibling = $("#submenu ul li.current")[0].nextElementSibling;
    }
    if (sibling) {
    	$(sibling).click();
	}
    return false;
});

$(document).ready(function() {
	$("section").hide();
	$("#interest").show();
	var isMoving = false;
	gestionResize();
	$(window).resize(function() {
		gestionResize();
	});

	function gestionResize() {
		contentWidth = $(window).width() - 250;
		contentHeight = $(window).height();
		demiHeight = contentHeight / 2;
		demiHeight = parseInt(demiHeight) + 1;
		$("#content, #about").css("width", contentWidth);
		$("#content").css("height", contentHeight);
		if ($("#content").hasClass("etatabout") == false) {
			$("#about").css("left", -contentWidth + 250);
		}
		positionFleche = $(".open_story").offset().top - 2;
		$(".fleche").css("top", positionFleche + "px");
	};
	$("#btn_home, .open_story").click(function() {
		if (isMoving == false) {
			isMoving = true;
			setTimeout(function() {
				$("#about").css("left", -contentWidth + 350);
				isMoving = false;
			}, 700);
			$("#visuals").removeClass("etatspecial");
			$("#visuals").css("left", "350px");
			$("#menu ul li").removeClass("current");
			$(".open_story").addClass("current");
			if ($("#content").hasClass("etatabout") == true) {
				$("#about").removeClass("etatabout");
				setTimeout(function() {
					$("#content, #visuals").removeClass("etatabout");
				}, 700);
				setTimeout(function() {
					$("#about").removeClass("visible");
				}, 700);
				$("#about").css("left", -contentWidth + 350);
			}
			$("#content, #visuals").addClass("etat1");
			$("#content").css("left", "250px")
			$("#ligne1, #ligne2").addClass("visible");
			$("#submenu, .fleche").addClass("visible");
			rubActive = labels[2];
		}
	});
	$(".open_about").click(function() {
		$("body, html").css("overflow", "hidden");
		if (isMoving == false) {
			isMoving = true;
			$("#about").addClass("visible");
			$("#about").css("width", contentWidth);
			$("#menu ul li").removeClass("current");
			$(".open_about").addClass("current");
			$("#about, #content, #visuals").addClass("etatabout");
			$("#about").css("left", "250px");
			$("#content, #visuals").css("left", "100%");
			setTimeout(function() {
				isMoving = false;
			}, 700);
			$("#submenu, .fleche").removeClass("visible");
			rubActive = labels[1];
		}
	});
	$(".logo").click(function() {
		$("body, html").css("overflow", "hidden");
		if (isMoving == false) {
			isMoving = true;
			$("#about").css("left", -contentWidth + 250);
			$("#menu ul li").removeClass("current");
			if ($("#content").hasClass("etat1") == true) {
				$("#content, #visuals").removeClass("etat1");
				$("#submenu, .fleche").removeClass("visible");
				$("#ligne1, #ligne2").removeClass("visible");
				$("#visuals").css("left", "250px");
			}
			if ($("#content").hasClass("etatabout") == true) {
				$("#about").removeClass("etatabout");
				setTimeout(function() {
					$("#content, #visuals").removeClass("etatabout");
				}, 700);
				setTimeout(function() {
					$("#about").removeClass("visible");
				}, 700);
				$("#about").css("left", -contentWidth + 250);
			}
			$("#content").css("width", contentWidth);
			setTimeout(function() {
				$("#visuals").css("left", "70px");
				isMoving = false;
			}, 700);
			$("#content").css("left", "250px");
			rubActive = labels[0];
		}
	});
	$("#submenu ul li").click(function() {
		$("#submenu ul li").removeClass("current");
		$(this).addClass("current");
		$("section").hide();
		$("#" + $(this)[0].title).show();
	});
});