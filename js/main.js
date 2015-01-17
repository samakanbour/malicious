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
	$("#reputation").show();
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
		
		if ($(this)[0].title == "attacker") {
			d3WorldMap(dataCountries(data.url), "qatar");
			$("#visuals").css("background", "#FF5732");
		} else {
			$("#visuals").css("background", "#FFF");
		}

		if ($(this)[0].title == "social") {
			$("#social .box").removeClass("selected");
			$("#social .box.qatar").addClass("selected");
			bubble.show('qatar');
		} else {
			bubble.hide();
		}
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

	$("#attacker .box").click(function() {
		$("#attacker .box").removeClass("selected");
		if ($(this).hasClass("qatar") == true) {
			d3WorldMap(dataCountries(data.url), "qatar");
		} else {
			d3WorldMap(dataCountries(data.url), "world");
		}
		$(this).addClass("selected");
	});

	$("#search .box").click(function() {
		$("#search .box").removeClass("selected");
		if ($(this).hasClass("qatar") == true) {
			dataWord(words.first.qatar, 	"#search article#first", colors[0]);
			dataWord(words.second.qatar, 	"#search article#second", colors[0]);
			dataWord(words.third.qatar, 	"#search article#third", colors[0]);
		} else {
			dataWord(words.first.world, 	"#search article#first", colors[1]);
			dataWord(words.second.world, 	"#search article#second", colors[1]);
			dataWord(words.third.world, 	"#search article#third", colors[1]);
		}
		$(this).addClass("selected");
	});

	$("#subcategory .box").click(function() {
		$("#subcategory .box").removeClass("selected");
		if ($(this).hasClass("qatar") == true) {
			pie.change(dataPie(data.url).qatar);
		} else {
			pie.change(dataPie(data.url).world);
		}
		$(this).addClass("selected");
	});

	$("#social .box").click(function() {
		$("#social .box").removeClass("selected");
		if ($(this).hasClass("qatar") == true) {
			bubble.show('qatar');
		} else {
			bubble.show('world');
		}
		$(this).addClass("selected");
		
	});

});