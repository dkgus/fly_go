$(function() {
	$(".navbar__menu li a").mouseenter(function() {
		$(".navbar__menu li").removeClass("on");
		$(this).closest("li").addClass("on");
	});
	
	$(".navbar__menu li ol").mouseleave(function() {
		$(this).closest("li").removeClass("on");
	});
});