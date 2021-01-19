$(function(){
	initTile();

	!Modernizr.touch && initEnter();
});


function initTile(){
	var $3DContainer = $(".tile_3d"),
		$tiles = $3DContainer.find('.tile'),
		$subTiles_left = $('.tile-sub_left'),
		$subTiles_right = $('.tile-sub_right'),
		$subTiles_top = $('.tile-sub_top'),
		$subTiles_bottom = $('.tile-sub_bottom'),
		$overlay = $('.tile-overlay'),
		_current = {};

	function resetSubTiles(){
		TweenLite.set($subTiles_left, {css:{rotationY:90}});
		TweenLite.set($subTiles_right, {css:{rotationY:-90}});
		TweenLite.set($subTiles_top, {css:{rotationX:-90}});
		TweenLite.set($subTiles_bottom, {css:{rotationX:90}});
	}

	function getRandom(max, min){
		return Math.floor(Math.random() * (1 + max - min) + min);
	}

	//初始化
	TweenLite.set($3DContainer, {css:{transformPerspective:400, perspective:400, transformStyle:"preserve-3d"}});
	resetSubTiles();

	if(Modernizr.touch) return;
	//事件
	$tiles.on('mouseenter',function(e){
		var $this = $(this),
			$parent = $this.parent('.tile_3d'),
			$subTiles = $parent.find('.tile-sub');

		_current.$parent = $parent.css({'z-index':'30'});

		$overlay.show();
		TweenLite.to($overlay,0.6,{css:{autoAlpha:0.6}});

		$subTiles.each(function(i,e){
			TweenLite.to(e, getRandom(400,800)/1000, {css:{rotationY:0,rotationX:0},ease:Back.easeInOut});
		});
	}).on('mouseleave',function(e){
		_current.$parent.css({'z-index':''});
		$overlay.css({'opactiy':0}).hide();

		resetSubTiles();
	});
}

function initEnter(){
	var $win = $(window),
		$body = $('body'),
		$btn_enter = $('.enterpage-skip,.site-enterpage'),
		$date = $('.enterpage-time_date'),
		$time = $('.enterpage-time_time'),
		update_id = 0,
		monthes = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
		dates = {
			'1': 'st',
			'2': 'nd',
			'3': 'rd',
			'21': 'st',
			'22': 'nd',
			'23': 'rd',
			'31': 'rd'
		};


	$win.width() >= 800 && $body.css('overflow','hidden');
	

	(function upateTime(){
		var now = new Date(),
			month = monthes[now.getMonth()],
			date = now.getDate(),
			hours = now.getHours(),
			minutes = now.getMinutes(),
			noon = hours<12 ? 'am' : 'pm',
			suffix = dates[date];

		hours = hours>12 ? hours-12 : hours;
		suffix = suffix === undefined ? 'th' : suffix;
		hours = ('0'+hours).substr(-2);
		minutes = ('0'+minutes).substr(-2);
		
		$date.text(month+' '+date+suffix);
		$time.text(hours+':'+minutes+' '+noon);

		//update_id = setTimeout(upateTime,1000*30);
		//console.log(month,date,suffix,hours,minutes,noon);
	})();

	$btn_enter.on('click',function(e){

		clearTimeout(update_id);
		$('.w-site-enterpage').fadeOut(800,function(){
			$body.css('overflow','');
			$win.off('resize',enterResizeHandler);
			tweenArrowL.kill();
			tweenArrowR.kill();
		});
		return false;
	});


	//进入页面动画
	var initWidth = 4300,
		initHeight = 1400,
		initDur = 20,
		barHeight = $('.enterpage-bar').height(),
		tween,
		tweenArrowL,
		tweenArrowR,/*
		tweenProgress = 0,
		tweenTarget = 0,
		tweenDirect = 0,
		picCenterX = 0,
		clientX = 0,*/
		picRatio = initWidth/initHeight,
		tranRadio = initDur/initHeight,
		$picwrap = $('.enterpage-pic'),
		$picul = $picwrap.find('.ep-list'),
		$picli = $picul.children('.ep-item'),

		curTime = new Date().getHours(),
		srcPrefix = 'a';
	if(curTime>=6 && curTime<16){
		srcPrefix = 'a'
	}else if(curTime>=16 && curTime<21){
		srcPrefix = 'b'
	}else if((curTime>=21 && curTime<24)||curTime<6){
		srcPrefix = 'c'
	}
	$('.enterpage-gif_'+srcPrefix).show();

	$picli.each(function(i,o){
		var $img = $(o).find('img'),
			src = $img.attr('data-src');
		$img.attr('src',src.replace('$',srcPrefix));
	});

	$picwrap.on('mousemove',function(e){

		var direct = e.clientX - $win.width()/2 >= 10  ? +1 : e.clientX - $win.width()/2 <=-10 ? -1: 0,
			height = $picul.height(),
			target = height*picRatio-$win.width(),
			duration = initDur * (1.2-Math.abs(e.clientX*2/$win.width()-1));//height*picRatio*tranRadio*(1.2-(Math.abs(e.clientX*2/$win.width() - 1)));
		
		if(direct == 0){
			tween && tween.pause();
			return;
		}
		tween = TweenLite.to($picul, duration, {css:{x:(direct==1 ? -target : 0)},ease:Linear.ease});//Power3.easeOut


	}).on('mouseout',function(e){
		tween && tween.pause();
	});

	$win.on('resize',enterResizeHandler).trigger('resize');

	function enterResizeHandler(e){
		var height = $win.height()-barHeight,
			target = height*picRatio-$win.width();

		if(target<=0){
			height = $picul.height();
		}
		picCenterX = -(height*picRatio-$win.width())/2;
		$picul.height(height).width(height*picRatio);
		TweenLite.set($picul, {css:{x:picCenterX}});
	}

	tweenArrowL = TweenLite.to($('.enterpage-tips_l'),1.2, {css:{x:'-=30',alpha:0},onComplete:function(){
		tweenArrowL.restart();
	}});
	tweenArrowR = TweenLite.to($('.enterpage-tips_r'),1.2, {css:{x:'+=30',alpha:0},onComplete:function(){
		tweenArrowR.restart();
	}});
	
}

(function(){
	// once you create a GSPreloader instance, call preloader.active(true) to open it, preloader.active(false) to close it, and preloader.active() to get the current status.
	function GSPreloader(options) {
		options = options || {};
		var parent = options.parent || document.body,
			element = this.element = document.createElement("div"),
			radius = options.radius || 42,
			dotSize = options.dotSize || 15,
			animationOffset = options.animationOffset || 1.8, //jumps to a more active part of the animation initially (just looks cooler especially when the preloader isn't displayed for very long)
			createDot = function(rotation) {
				var dot = document.createElement("div");
				element.appendChild(dot);
				TweenLite.set(dot, {width:dotSize, height:dotSize, transformOrigin:(-radius + "px 0px"), x: radius, backgroundColor:colors[colors.length-1], borderRadius:"50%", position:"absolute", rotation:rotation});
				dot.className = options.dotClass || "preloader-dot";
				return dot;
			},
			i = options.dotCount || 10,
			rotationIncrement = 360 / i,
			colors = options.colors || ["#61AC27","black"],
			animation = new TimelineLite({paused:true}),
			dots = [],
			isActive = false,
			box = document.createElement("div"),
			tl, dot, closingAnimation, j;
		colors.push(colors.shift());

		//setup background box
		TweenLite.set(box, {width: radius * 2 + 70, height: radius * 2 + 70, borderRadius:"14px", backgroundColor:options.boxColor || "white", border: options.boxBorder || "1px solid #AAA", position:"absolute", xPercent:-50, yPercent:-50, opacity:((options.boxOpacity != null) ? options.boxOpacity : 0.3)});
		box.className = options.boxClass || "preloader-box";
		if (options.boxOpacity === 0) {
			TweenLite.set(box, {display:"none"});
		}
		element.appendChild(box);

		parent.appendChild(element);
		TweenLite.set(element, {position:"fixed", top:"45%", left:"50%", perspective:600, overflow:"visible", zIndex:2000});
		animation.from(box, 0.1, {opacity:0, scale:0.1, ease:Power1.easeOut}, animationOffset);
		while (--i > -1) {
			dot = createDot(i * rotationIncrement);
			dots.unshift(dot);
			animation.from(dot, 0.1, {scale:0.01, opacity:0, ease:Power1.easeOut}, animationOffset);
			//tuck the repeating parts of the animation into a nested TimelineMax (the intro shouldn't be repeated)
			tl = new TimelineLite({repeat:-1, repeatDelay:0.25});
			for (j = 0; j < colors.length; j++) {
				tl.to(dot, 2.5, {rotation:"-=360", ease:Power2.easeInOut}, j * 2.9)
					.to(dot, 1.2, {skewX:"+=360", backgroundColor:colors[j], ease:Power2.easeInOut}, 1.6 + 2.9 * j);
			}
			//stagger its placement into the master timeline
			animation.add(tl, i * 0.07);
		}
		if (TweenLite.render) {
			TweenLite.render(); //trigger the from() tweens' lazy-rendering (otherwise it'd take one tick to render everything in the beginning state, thus things may flash on the screen for a moment initially). There are other ways around this, but TweenLite.render() is probably the simplest in this case.
		}

		//call preloader.active(true) to open the preloader, preloader.active(false) to close it, or preloader.active() to get the current state.
		this.active = function(show) {
			if (!arguments.length) {
				return isActive;
			}
			if (isActive != show) {
				isActive = show;
				if (closingAnimation) {
					closingAnimation.kill(); //in case the preloader is made active/inactive/active/inactive really fast and there's still a closing animation running, kill it.
				}
				if (isActive) {
					element.style.visibility = "visible";
					TweenLite.set([element, box], {rotation:0});
					animation.play(animationOffset);
				} else {
					closingAnimation = new TimelineLite();
					if (animation.time() < animationOffset + 0.3) {
						animation.pause();
						closingAnimation.to(element, 1, {rotation:-360, ease:Power1.easeInOut}).to(box, 1, {rotation:360, ease:Power1.easeInOut}, 0);
					}
					closingAnimation.staggerTo(dots, 0.3, {scale:0.01, opacity:0, ease:Power1.easeIn, overwrite:false}, 0.05, 0).to(box, 0.4, {opacity:0, scale:0.2, ease:Power2.easeIn, overwrite:false}, 0).call(function() { animation.pause(); closingAnimation = null; }).set(element, {visibility:"hidden"});
				}
			}
			return this;
		};
	}

	window.preloader = new GSPreloader({colors:["#ff8531", "#d8d8d8"], boxOpacity:0});
	

	preloader.active(true);

	$(window).on('load',function(){
		preloader.active(false);
		$('.preloaderMask').fadeOut(800);
	});

})();















