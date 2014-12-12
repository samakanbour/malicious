if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) { 
	$(document).ready(function() {
		$('body, html').bind('mousewheel', function(event, delta, deltaX, deltaY) {
			//$('html, body').stop().animate({scrollLeft: '-='+(400*delta)+'px' });
			this.scrollLeft -= (delta * 40);
			 /*if(delta < 0){
				 $('body, html').scrollLeft($('body, html').scrollLeft()+50);
			   }else{
				 $('body, html').scrollLeft($('body, html').scrollLeft()-50);
			 }*/
			event.preventDefault();
		});
	}); 
}
else {
	$(function() {
        $('body, html').bind('mousewheel', function(event, delta, deltaX, deltaY) {
			$('html, body').stop().animate({scrollLeft: '-='+(500*delta)+'px' }, 400, 'easeOutQuint');
			event.preventDefault();
		});
  	});
};
	
	var xStart, yStart = 0;
 
	document.addEventListener('touchstart',function(e) {
		xStart = e.touches[0].screenX;
		yStart = e.touches[0].screenY;
	});
	 
	document.addEventListener('touchmove',function(e) {
		var xMovement = Math.abs(e.touches[0].screenX - xStart);
		var yMovement = Math.abs(e.touches[0].screenY - yStart);
		if((yMovement * 3) > xMovement) {
			e.preventDefault();
		}
	});