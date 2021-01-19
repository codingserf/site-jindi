$(function(){
	var $fw_btns = $('.fw-btn'),
		$floor_num = $('.floor-tips-num ul'),
		fw_btn_curclass = 'fw-btn_current',
		ft_list_curtype = 'mom';

	var $floor_type_switchbtn_prev = $('.floor-type-switchbtn_prev'),
		$floor_type_switchbtn_next = $('.floor-type-switchbtn_next'),
		$floor_types_lists = $('.floor-types-list'),
		floor_types_list_curclass = 'floor-types-list_current';

	var $floor_svg = $('#floor-svg'),
		draw = SVG('floor-svg').size('100%', '100%').viewbox(0, 0, 1440, 640),
		svgCache = {
			rawSvg : [],
			jsons: []
		},
		svgTween;
	var $svg_tips = $('.svg-tips'),
		$svg_tips_logo = $svg_tips.find('.st-logo img'),
		$svg_tips_name = $svg_tips.find('.st-name span'),
		$svg_tips_address = $svg_tips.find('.st-info-address span'),
		$svg_tips_tel = $svg_tips.find('.st-info-tel span'),
		$svg_tips_link = $svg_tips.find('.w-st-main a'),
		$svg_wrap = $('.w-floor-svg'),
		$svg_stores = $(),
		svg_stores = [],
		svg_icons = [];
	var $panzoom;

	var current = {
		type: null,
		floor: null
	}

	initTips();	
	initType();
	setType(g_initData.type);
	setTimeout(function(){
		setFloor(g_initData.floor);
	},500);
	
	$window.on('resize',handleResponsive);

	function handleResponsive(){
		var ww = $window.width();
			//$links = $floor_svg.find('a');

		if(ww <= breakpoint_1){
			draw.attr('viewBox',null);
			//$links.on('click','#floor-svg',svgLinkHanler);
			$panzoom.panzoom('enable');
			$panzoom.panzoom('zoom',ww/1440);
			$panzoom.panzoom('pan',0,30);
		}
		if(ww > breakpoint_1){
			draw.viewbox({ x: 0, y: 0, width: 1440, height: 640 });
			//$links.off('click','#floor-svg',svgLinkHanler);

			$panzoom.panzoom('reset');
			$panzoom.panzoom('disable');

		}
	}
	function svgLinkHanler(e){
		return false;
	}
	//处理楼层导航和提示
	function initTips(){
		$fw_btns.each(function(i,e){
			var $e = $(e);

			$e.on('click',function(e){
				if(svgTween !== undefined && svgTween.isActive()) return;
				var $this = $(this),
					floor = $this.attr('id').replace('fw-btn_',''),
					index = $fw_btns.index($this);
				if(current.floor == floor) return;
				//切换当前btn和tip
				$fw_btns.removeClass(fw_btn_curclass);
				$this.addClass(fw_btn_curclass);
				switchFloorTips(index);
				$floor_svg.css('background-color','');
				svgTween = TweenLite.to($floor_svg,0.3,{autoAlpha:0,onComplete:function(){
					if(svgCache.rawSvg[index] === undefined){
						$.get('assets/page-floor/svg/'+floor+'.svg',function(data){
							svgCache.rawSvg[index] = data;
							draw.clear().svg(data);
							$panzoom && $panzoom.panzoom("destroy");
							$panzoom = $("#svgviewport").panzoom({
								cursor: 'move',
								increment: 0.2,
								minScale: 0.22,
								maxScale: 1,
								transition: true
							});
							handleResponsive();

							$.getJSON('assets/temp/'+floor+'.json',function(json){
								svgTween.reverse();
								svgCache.jsons[index] = json;
								initSvg(json);
							});
						},'text');
					}else{
						draw.clear().svg(svgCache.rawSvg[index]);
						svgTween.reverse();
						initSvg(svgCache.jsons[index]);
					}
					$floor_svg.css('background-color','#eff0f4');
					current.floor = floor;
				}});

				return false;
			});
		});
		

		function switchFloorTips(index){
			TweenLite.to($floor_num, 0.3, {bottom: -index+'00%',immediateRender:true});
		}
	}
	function setFloor(floor){
		$('#fw-btn_'+floor).trigger('click');
	}


	//切换店铺类型
	function initType(){
		$floor_type_switchbtn_prev.on('click',function(){
			var index = $floor_types_lists.index($('#floor-types_'+current.type));
			setType($floor_types_lists.eq(index-1).attr('id').replace('floor-types_',''));

		});
		$floor_type_switchbtn_next.on('click',function(){
			var index = $floor_types_lists.index($('#floor-types_'+current.type));
			index = index+1>=$floor_types_lists.length ? 0 : index+1;
			setType($floor_types_lists.eq(index).attr('id').replace('floor-types_',''));
		});
	}
	function setType(type){
		var $current = $floor_types_lists.filter('.'+floor_types_list_curclass);
			$next = $('#floor-types_'+type),
			$subtypes = $next.find('.floor-subtype'),
			timeline = new TimelineLite();

		TweenLite.to($current,0.2,{opacity:0,onComplete:function(){
			TweenLite.set($current,{zIndex:0});
			TweenLite.set($next,{opacity:1,zIndex:5});
			timeline.staggerFrom($subtypes, 0.4, {autoAlpha:0,scaleX:0.5,scaleY:0.5, ease:Elastic.easeOut}, 0.06);
		}});
		current.type = type;
		
		//reset icons
		$.each(svg_stores,function(i,e){
			svg_icons[i].animate(200).opacity(0).after(function(){
				svg_stores[i].hasClass('type_'+current.type) && svg_icons[i].animate(200).opacity(1);
			});
		});
		$floor_types_lists.removeClass(floor_types_list_curclass);
		$next.addClass(floor_types_list_curclass);
	}


	/*初始化数据*/

	function initSvg(json){
		var _oldShape;
		svg_stores = [];
		svg_icons = [];
		$svg_stores = $('[id^="store"]').each(function(i,e){
			var $this = $(e),
				store_id = $this.attr('id').replace('store-',''),
				_store = e.instance,
				_icon = $this.find('[id^="plus"]')[0].instance,
				_shape = $this.find('[id^="shape"]')[0].instance,
				store_info = json[store_id],
				type_classes;

			if(store_info===undefined){
				console.log('no '+i+' id:'+store_id);
				return;
			} 
			//init store info
			store_info.address = store_id.replace('.','+');
			store_info.types = store_info.type1.concat(store_info.type2);
			//缓存
			svg_icons.push(_icon);
			svg_stores.push(_store);
			//识别当前type并亮起ico
			if(store_info.types.indexOf(current.type)>=0) {
				_icon.opacity(1);
			}

			_shape.remember('originalFill',_shape.attr('fill'));

			//给店铺加type标识 和 link
			_store.linkTo(function(link) {
				link.to('/shop/'+store_info.address.toLowerCase()).target('_self');
			});
			type_classes = 'type_' + store_info.types.join(' type_');
			_store.addClass(type_classes);

			$this.on('touchstart mouseenter',function(e){
				_shape.animate(200).fill('#424f64');
				resetSvgTips(store_info);
				/*alert(Modernizr.touch);*/
				if(!Modernizr.touch && e.type=='mouseenter'){
					$svg_tips.show();
				}
				if(e.type=='touchstart'){
					_oldShape && _oldShape.animate(200).fill(_oldShape.remember('originalFill'))
					$svg_tips.slideDown();
					_oldShape = _shape;
				}
			}).on('mousemove',function(e){
				if(Modernizr.touch) return;
				$svg_tips.css({
					left: e.pageX-$svg_wrap.offset().left-50+'px',
					top: e.pageY-$svg_wrap.offset().top -$svg_tips.height()-20+'px'
				});
			}).on('mouseleave',function(e){
				_shape.animate(200).fill(_shape.remember('originalFill'));
				if(!Modernizr.touch && e.type=='mouseleave'){
					$svg_tips.hide();
				}
			});
		});
	}
	/* svg tips 相关*/
	function resetSvgTips(data){
		$svg_tips_link.attr('href','/shop/'+data.address.toLowerCase());
		$svg_tips_logo.attr('src',data.logo);
		$svg_tips_name.text(data.name);
		$svg_tips_address.text(data.address);
		$svg_tips_tel.text(data.tel);
	}

});