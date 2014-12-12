$(document).ready(function(){
	function preload(arrayOfImages) {
		$(arrayOfImages).each(function(){
			$('<img/>')[0].src = this;
		});
	}
	
	function preloader() {
		preload([
			'http://paulineosmont.com/portfolio/projects/tokkunacademy/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/IM2A/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Origami3D/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/DptEvt/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Witchatt/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/SouloftheDeadTree/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Art-Spire/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/LaTarteTropezienne/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/LeRecyclagePasAPas/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Delirium/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/RE6/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/TheWorkManual/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/TheWatchers/Cover.jpg',	
			'http://paulineosmont.com/portfolio/projects/WebdesignKingdom/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Mariage/Cover.jpg',	
			'http://paulineosmont.com/portfolio/projects/Mirage/Cover.jpg',
			'http://paulineosmont.com/portfolio/projects/Triangle/Cover.jpg',	
		]);
	}
	
	function addLoadEvent(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				if (oldonload) {
					oldonload();
				}
				func();
			}
		}
	}
	addLoadEvent(preloader);

});