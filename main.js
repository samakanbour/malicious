var contentWidth = $(window).width() - 250;
var contentHeight = $(window).height();
var demiHeight = contentHeight / 2;
$(document).ready(function() {
	$("#content, #btn_workgrid, #lettres").removeClass("depart");
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
	$("#btn_workgrid, .open_works, #retourgrid").click(function() {
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
			$("#sousmenu, .fleche").addClass("visible");
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
			$("#sousmenu, .fleche").removeClass("visible");
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
				$("#sousmenu, .fleche").removeClass("visible");
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
	$("#sousmenu ul li").click(function() {
		$(".case1, .case2").css("opacity", "0.2");
		$("#sousmenu ul li").removeClass("current");
		$(".case1, .case2").removeClass("actif");
		if ($(this).hasClass("nofiltre") == true) {
			$(".case1, .case2").css("opacity", "1");
			$(".case1, .case2").addClass("actif");
			$(this).addClass("current") == true;
		}
		if ($(this).hasClass("filtre_web") == true) {
			$(".web").css("opacity", "1");
			$(".web").addClass("actif");
			$(this).addClass("current") == true;
		}
		if ($(this).hasClass("filtre_print") == true) {
			$(".print").css("opacity", "1");
			$(".print").addClass("actif");
			$(this).addClass("current") == true;
		}
		if ($(this).hasClass("filtre_illu") == true) {
			$(".illu").css("opacity", "1");
			$(".illu").addClass("actif");
			$(this).addClass("current") == true;
		}
		if ($(this).hasClass("filtre_craft") == true) {
			$(".craft").css("opacity", "1");
			$(".craft").addClass("actif");
			$(this).addClass("current") == true;
		}
		if ($(this).hasClass("filtre_logo") == true) {
			$(".logotype").css("opacity", "1");
			$(".logotype").addClass("actif");
			$(this).addClass("current") == true;
		}
	});
	$(".case1, .case2").click(function() {
		$("#about, #contact").css("left", -contentWidth);
		$("#retourgrid").removeClass();
		if ($(this).hasClass("actif")) {
			if ($(this).hasClass("projet01")) {
				$("#container").load("tokkunacademy.html", function() {
					$("#retourgrid").addClass("tokkunacademy");
					openproject()
				});
			};
			if ($(this).hasClass("projet02")) {
				$("#container").load("artspire.html", function() {
					$("#retourgrid").addClass("artspire");
					openproject()
				});
			};
			if ($(this).hasClass("projet03")) {
				$("#container").load("Witchatt.html", function() {
					$("#retourgrid").addClass("witchatt");
					openproject()
				});
			};
			if ($(this).hasClass("projet04")) {
				$("#container").load("pmmt.html", function() {
					$("#retourgrid").addClass("pmmt");
					openproject()
				});
			};
			if ($(this).hasClass("projet05")) {
				$("#container").load("delirium.html", function() {
					$("#retourgrid").addClass("delirium");
					openproject()
				});
			};
			if ($(this).hasClass("projet06")) {
				$("#container").load("re6.html", function() {
					$("#retourgrid").addClass("re6");
					openproject()
				});
			};
			if ($(this).hasClass("projet07")) {
				$("#container").load("WebdesignKingdom.html", function() {
					$("#retourgrid").addClass("webdesignkingdom");
					openproject()
				});
			};
			if ($(this).hasClass("projet08")) {
				$("#container").load("mirage.html", function() {
					$("#retourgrid").addClass("mirage");
					openproject()
				});
			};
			if ($(this).hasClass("projet09")) {
				$("#container").load("origami3D.html", function() {
					$("#retourgrid").addClass("origami");
					openproject()
				});
			};
			if ($(this).hasClass("projet10")) {
				$("#container").load("DptEvt.html", function() {
					$("#retourgrid").addClass("dptevt");
					openproject()
				});
			};
			if ($(this).hasClass("projet11")) {
				$("#container").load("SouloftheDeadTree.html", function() {
					$("#retourgrid").addClass("deadtree");
					openproject()
				});
			};
			if ($(this).hasClass("projet12")) {
				$("#container").load("latartetropezienne.html", function() {
					$("#retourgrid").addClass("tarte");
					openproject()
				});
			};
			if ($(this).hasClass("projet13")) {
				$("#container").load("lerecyclagepasapas.html", function() {
					$("#retourgrid").addClass("recyclage");
					openproject()
				});
			};
			if ($(this).hasClass("projet14")) {
				$("#container").load("theworkmanual.html", function() {
					$("#retourgrid").addClass("theworkmanual");
					openproject()
				});
			};
			if ($(this).hasClass("projet15")) {
				$("#container").load("TheWatchers.html", function() {
					$("#retourgrid").addClass("thewatchers");
					openproject()
				});
			};
			if ($(this).hasClass("projet16")) {
				$("#container").load("Mariage.html", function() {
					$("#retourgrid").addClass("mariage");
					openproject()
				});
			};
			if ($(this).hasClass("projet17")) {
				$("#container").load("Triangle.html", function() {
					$("#retourgrid").addClass("triangle");
					openproject()
				});
			};
		}
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
			//$("#container").css("width", LargeurProjet);
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
			$("#sousmenu, .fleche").removeClass("visible");
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