var contentWidth = $(window).width() - 200;
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
		contentWidth = $(window).width() - 200;
		contentHeight = $(window).height();
		demiHeight = contentHeight / 2;
		demiHeight = parseInt(demiHeight) + 1;
		$("#content, #about").css("width", contentWidth);
		$("#content").css("height", contentHeight);
		if ($("#content").hasClass("etatabout") == false) {
			$("#about").css("left", -contentWidth + 200);
		}
		positionarrow = $(".open_story").offset().top - 2;
		$(".arrow").css("top", positionarrow + "px");
	};
	$("#btn_home, .open_story").click(function() {
		if (isMoving == false) {
			isMoving = true;
			setTimeout(function() {
				$("#about").css("left", -contentWidth + 300);
				isMoving = false;
			}, 700);
			$("#visuals").removeClass("etatspecial");
			$("#visuals").css("left", "300px");
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
				$("#about").css("left", -contentWidth + 300);
			}
			$("#content, #visuals").addClass("etat1");
			$("#content").css("left", "200px")
			$("#ligne1, #ligne2").addClass("visible");
			$("#submenu, .arrow").addClass("visible");
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
			$("#about").css("left", "200px");
			$("#content, #visuals").css("left", "100%");
			setTimeout(function() {
				isMoving = false;
			}, 700);
			$("#submenu, .arrow").removeClass("visible");
			rubActive = labels[1];
		}
	});
	$(".logo").click(function() {
		$("body, html").css("overflow", "hidden");
		if (isMoving == false) {
			isMoving = true;
			$("#about").css("left", -contentWidth + 200);
			$("#menu ul li").removeClass("current");
			if ($("#content").hasClass("etat1") == true) {
				$("#content, #visuals").removeClass("etat1");
				$("#submenu, .arrow").removeClass("visible");
				$("#ligne1, #ligne2").removeClass("visible");
				$("#visuals").css("left", "200px");
			}
			if ($("#content").hasClass("etatabout") == true) {
				$("#about").removeClass("etatabout");
				setTimeout(function() {
					$("#content, #visuals").removeClass("etatabout");
				}, 700);
				setTimeout(function() {
					$("#about").removeClass("visible");
				}, 700);
				$("#about").css("left", -contentWidth + 200);
			}
			$("#content").css("width", contentWidth);
			setTimeout(function() {
				$("#visuals").css("left", "70px");
				isMoving = false;
			}, 700);
			$("#content").css("left", "200px");
			rubActive = labels[0];
		}
	});
	$("#submenu ul li").click(function() {
		$("#submenu ul li").removeClass("current");
		$(this).addClass("current");
		$("section").hide();
		$("#" + $(this)[0].title).show();
	});
	$(".reach div").click(function() {
		if ($(this).hasClass("fa-toggle-on") == true) {
			$(this).removeClass("fa-toggle-on").addClass("fa-toggle-off");
			$("#malicious article").html('');
			d3Bars(dataBars(data.url), "#malicious article", 'count');
		} else {
			$(this).removeClass("fa-toggle-off").addClass("fa-toggle-on");
			$("#malicious article").html('');
			d3Bars(dataBars(data.url), "#malicious article", 'reach');
		}
	});

});