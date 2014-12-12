var contentWidth = $(window).width() - 250;
var contentHeight = $(window).height();
var demiHeight = contentHeight / 2;
$(document).ready(function() {
	$("#content, #btn_home").removeClass("start");
	var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
	var ratio = $(window).height() / 700;
	var largeurCase1, largeurCase2, hauteurCase, placementtitre, margeHomeLeft, margeHomeTop, positionFleche, largeurContainer, largeurVisu, largeurCaptureBis, previousOpen;
	var isMoving = false;
	var largeurVisuBase = 0;
	var largeurCaptureBisBase = 0;
	$("#grid").css("width", contentWidth + 180);
	$("#container").css("width", contentWidth);
	$("#grid, #container").css("overflow", "hidden");
	gestionResize();
	$(window).resize(function() {
		gestionResize();
	});

	function gestionResize() {
		ratio = $(window).height() / 700;
		largeurCase1 = 600 * ratio;
		largeurCase2 = 400 * ratio;
		hauteurCase = 350 * ratio;
		largeurCase1 = parseInt(largeurCase1);
		largeurCase2 = parseInt(largeurCase2);
		hauteurCase = parseInt(hauteurCase) + 1;
		$(".case1, .case1 img").css("width", largeurCase1 + "px");
		$(".case2, .case2 img").css("width", largeurCase2 + "px");
		$(".case1 img, .case2 img").css("height", hauteurCase + "px");
		contentWidth = $(window).width() - 250;
		contentHeight = $(window).height();
		demiHeight = contentHeight / 2;
		demiHeight = parseInt(demiHeight) + 1;
		$("#content, #about, #contact").css("width", contentWidth);
		$("#content").css("height", contentHeight);
		if ($("#content").hasClass("etat1") == true) {
			$("#grid").css("width", 4000 * ratio);
		}
		if ($("#content").hasClass("etatcontact") == false) {
			$("#contact").css("left", -contentWidth + 250);
		}
		if ($("#content").hasClass("etatabout") == false) {
			$("#about").css("left", -contentWidth + 250);
		}
		$("#ligne1, #ligne2").css("width", 4000 * ratio);
		$("#intro").css("width", 900 * ratio + "px");
		placementtitre = (parseInt(contentHeight) - parseInt(450 * ratio)) / 2 - 37.5;
		$("#titre").css("bottom", placementtitre + "px");
		positionFleche = $(".open_works").offset().top - 2;
		$(".fleche").css("top", positionFleche + "px");
		if ($("#content").hasClass("etat2") == true) {
			largeurCaptureBis = largeurCaptureBisBase * ratio;
			largeurVisu = largeurVisuBase * ratio;
			$("#visu").css("width", largeurVisu);
			$("#capturesbis").css("width", largeurCaptureBis + 1);
			if (iOS == true) {
				$("#visu img").css("width", "auto");
				$("#visu img").css("height", 700 * ratio);
				$("#capturesbis img").css("width", "auto");
				$("#capturesbis img").css("height", 700 * ratio);
			}
			largeurContainer = $("#intro").width() + $("#description").width() + parseInt(largeurVisu) + 1 + $(".showcase").width() + 1 + parseInt(largeurCaptureBis) + 1 + 50;
			$("#container").css("width", largeurContainer + "px");
		}
	};
	$("#btn_home, .open_works, #retourgrid").click(function() {
		if (isMoving == false) {
			isMoving = true;
			$("#retourgrid").removeClass();
			$(".open_works").html("Works");
			setTimeout(function() {
				$("#about").css("left", -contentWidth + 430);
				$("#contact").css("left", -contentWidth + 430);
				isMoving = false;
			}, 700);
			$("#grid").css("width", 4000 * ratio);
			$("#grid").css("overflow", "visible");
			if ($("#content").hasClass("etat2") == true) {
				if (window.pageXOffset + $(window).width() > 4000 * ratio) {
					var variableplacement = window.pageXOffset - (4000 * ratio - $(window).width());
					$("#grid").css("left", variableplacement);
					setTimeout(function() {
						$("#grid").removeClass("etatspecial");
					}, 700);
					setTimeout(function() {
						$("#grid").css("left", "430px");
					}, 700);
				} else {
					$("#grid").css("left", "430px");
					$("#grid").removeClass("etatspecial");
				}
			} else {
				$("#grid").removeClass("etatspecial");
				$("#grid").css("left", "430px");
			}
			$("#menu ul li").removeClass("current");
			$(".open_works").addClass("current");
			if ($("#content").hasClass("etat2") == true) {
				$("#content, #grid, #container").removeClass("etat2");
				setTimeout(function() {
					$("#container").css("width", contentWidth);
					$("#container").css("overflow", "hidden");
				}, 700);
			} else {
				$("#container").css("width", contentWidth);
			}
			if ($("#content").hasClass("etatcontact") == true) {
				$("#contact").removeClass("etatcontact");
				setTimeout(function() {
					$("#content, #grid, #container").removeClass("etatcontact");
				}, 700);
				setTimeout(function() {
					$("#contact").removeClass("visible");
				}, 700);
				$("#contact").css("left", -contentWidth + 430);
				$("#about").css("left", -contentWidth + 250);
			}
			if ($("#content").hasClass("etatabout") == true) {
				$("#about").removeClass("etatabout");
				setTimeout(function() {
					$("#contact, #content, #grid, #container").removeClass("etatabout");
				}, 700);
				setTimeout(function() {
					$("#about").removeClass("visible");
				}, 700);
				$("#about").css("left", -contentWidth + 430);
				$("#contact").css("left", -contentWidth + 250);
			}
			$("#content, #grid, #container").addClass("etat1");
			$("#content, #container").css("left", "250px")
			$("#ligne1, #ligne2").addClass("visible");
			$("#submenu, .fleche").addClass("visible");
			rubActive = "works";
		}
	});
	$(".open_about").click(function() {
		if (isMoving == false) {
			isMoving = true;
			$("#retourgrid").removeClass();
			$(".open_works").html("Works");
			$("#about").addClass("visible");
			$("#about").css("width", contentWidth);
			$("#menu ul li").removeClass("current");
			$(".open_about").addClass("current");
			$("#about, #contact, #content, #grid, #container").addClass("etatabout");
			$("#about").css("left", "250px");
			$("#content, #grid, #container").css("left", "100%");
			setTimeout(function() {
				$("#grid, #container").css("width", 0);
				$("#content, #grid, #container").css("overflow", "hidden");
				isMoving = false;
			}, 700);
			$("#submenu, .fleche").removeClass("visible");
			if ($("#content").hasClass("etatcontact") == true) {
				$("#contact, #content, #grid, #container").removeClass("etatcontact");
				setTimeout(function() {
					$("#contact").removeClass("visible");
				}, 700);
				if ($("#about").offset().left >= contentWidth) {
					$("#contact").css("left", -contentWidth + 250);
				} else {
					$("#contact").css("left", "100%");
				}
			}
			rubActive = "about";
			previousOpen = "about";
		}
	});
	$(".logo").click(function() {
		if (isMoving == false) {
			isMoving = true;
			$("#retourgrid").removeClass();
			$(".open_works").html("Works");
			$("#about").css("left", -contentWidth + 250);
			$("#contact").css("left", -contentWidth + 250);
			$("#content, #container").css("overflow", "hidden");
			$("#menu ul li").removeClass("current");
			$("#grid").css("width", "auto");
			if ($("#content").hasClass("etat1") == true) {
				$("#content, #grid, #container").removeClass("etat1");
				$("#submenu, .fleche").removeClass("visible");
				$("#ligne1, #ligne2").removeClass("visible");
				$("#grid").css("left", "250px");
			}
			if ($("#content").hasClass("etat2") == true) {
				$("#grid").css("overflow", "visible");
				$("#content, #grid, #container").removeClass("etat2");
				setTimeout(function() {
					$("#container").css("width", contentWidth);
				}, 700);
				$("#grid").css("width", 4000 * ratio);
				if (window.pageXOffset + $(window).width() > 4000 * ratio) {
					var variableplacement = window.pageXOffset - (4000 * ratio - $(window).width());
					$("#grid").css("left", variableplacement);
					setTimeout(function() {
						$("#grid").removeClass("etatspecial");
					}, 700);
					setTimeout(function() {
						$("#grid").css("left", "70px");
					}, 700);
				} else {
					$("#grid").css("left", "70px");
					$("#grid").removeClass("etatspecial");
				}
			} else {
				$("#container").css("width", contentWidth);
			}
			if ($("#content").hasClass("etatcontact") == true) {
				$("#contact").removeClass("etatcontact");
				setTimeout(function() {
					$("#content, #grid, #container").removeClass("etatcontact");
				}, 700);
				setTimeout(function() {
					$("#contact").removeClass("visible");
				}, 700);
				$("#contact").css("left", -contentWidth + 250);
				$("#container").css("left", "250px");
			}
			if ($("#content").hasClass("etatabout") == true) {
				$("#about").removeClass("etatabout");
				setTimeout(function() {
					$("#contact, #content, #grid, #container").removeClass("etatabout");
				}, 700);
				setTimeout(function() {
					$("#about").removeClass("visible");
				}, 700);
				$("#about").css("left", -contentWidth + 250);
				$("#container").css("left", "250px");
			}
			$("#content").css("width", contentWidth);
			setTimeout(function() {
				$("#grid").css("width", contentWidth + 180);
				$("#grid").css("overflow", "hidden");
				$("#grid").css("left", "70px");
				isMoving = false;
			}, 700);
			$("#content").css("left", "250px");
			rubActive = "home";
		}
	});
	$("#submenu ul li").click(function() {
		$("#submenu ul li").removeClass("current");
		$(this).addClass("current");
	});

	function openproject() {
		if (isMoving == false) {
			isMoving = true;
			$("#retourgrid").addClass("visible");
			$(".open_works").html("Back to grid");
			$("#container").css("overflow", "visible");
			var posS = window.pageXOffset + 250;
			$("#content, #grid, #container").removeClass("etat1");
			$("#content, #grid, #container").addClass("etat2");
			$("#container").css("left", posS + "px");
			$("#intro").css("width", 900 * ratio + "px");
			placementtitre = (parseInt(contentHeight) - parseInt(450 * ratio)) / 2 - 37.5;
			$("#titre").css("bottom", placementtitre + "px");
			setTimeout(function() {
				$("#container").css("left", 250);
				$('html, body').stop().animate({
					scrollLeft: 0
				}, 0, 'easeOutQuad');
				isMoving = false;
			}, 700);
			setTimeout(function() {
				$("#grid").css("overflow", "hidden");
				$("#grid").addClass("etatspecial");
			}, 700);
			$("#grid").css("width", contentWidth + 180);
			$("#grid").css("left", "70px");
			rubActive = "project";
			$("#submenu, .fleche").removeClass("visible");
			var testexistence = $("#capturesbis");
			if (testexistence.length) {
				largeurCaptureBisBase = parseInt($("#capturesbis").css("width"));
			} else {
				largeurCaptureBisBase = 0;
			}
			largeurVisuBase = parseInt($("#visu").css("width"));
			largeurCaptureBis = largeurCaptureBisBase * ratio;
			largeurVisu = largeurVisuBase * ratio;
			$("#visu").css("width", largeurVisu);
			$("#capturesbis").css("width", largeurCaptureBis + 1);
			if (iOS == true) {
				$("#visu img").css("width", "auto");
				$("#visu img").css("height", 700 * ratio);
				$("#capturesbis img").css("width", "auto");
				$("#capturesbis img").css("height", 698 * ratio);
			}
			largeurContainer = $("#intro").width() + $("#description").width() + parseInt(largeurVisu) + 1 + $(".showcase").width() + 1 + parseInt(largeurCaptureBis) + 1 + 50;
			$("#container").css("width", largeurContainer + "px");
		}
	};
});