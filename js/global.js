var $window = $(window);
	breakpoint_1 = 800;
$(function(){
	initNav();
	initTypeSubnav();
	initSearch();
	initMobiMenu();

	initNavResponsive();

	function initNavResponsive(){
		//for responsive
		var $window = $(window);
			
		$window.on('resize',function(e){
			var ww = $window.width();
			if(ww <= breakpoint_1){
				$('.snm_current').trigger('click');
			}
			if(ww > breakpoint_1){
				$('.mobi-mask').trigger('tap');
			}
		});
	}
});



function initNav(){
	var $navs = $('.js-hasSSN'),
		$subnavs = $('.ssn-item'),
		$subnav_inner = $('.site-subnav').css('height','auto'),
		$subnav_wrap = $('.site-header_subnav').slideUp(0),
		current_sncls = 'snm_current';

	$navs.on('click',function(e){
		var $this = $(this),
			$ssn = $('.'+$this.attr('data-ssncls'));

		if($this.hasClass(current_sncls)){
			$subnav_wrap.slideUp(400,function(){
				$navs.removeClass(current_sncls);
			});
			return;
		}
		//切换主类
		$navs.removeClass(current_sncls);
		$this.addClass(current_sncls);
		//切换子类
		$subnavs.hide();
		$ssn.show();
		//下拉
		$subnav_wrap.slideDown(400);
	});
}
function initTypeSubnav(){
	var $ssntype_lists = $('.ssn-type-list'),
		current_typecls = 'z-on';
	
	//初始化显示默认type
	$ssntype_lists.find('.'+current_typecls).each(function(i,e){
		$('.'+$(e).attr('data-ssntypecls')).show();
	});

	$ssntype_lists.each(function(i,e){
		var $this = $(e),
			$parent = $this.parent('.ssn-block'),
			$ssntypes = $this.find('li'),
			$ssnlink_lists = $parent.find('.ssn-link-list_hasType');
			

		$ssntypes.on('click',function(e){
			var $this = $(this),
				$linklist = $parent.find('.'+$this.attr('data-ssntypecls'));
			if($this.hasClass(current_typecls)){
				return;
			}
			$ssntypes.removeClass(current_typecls);
			$this.addClass(current_typecls);
			$ssnlink_lists.hide();
			$linklist.show();
		});
	});
}

function initSearch(){
	$('.ssn-search-hwlist li').on('click',function(e){
		$('#nav-searchbox').val($(this).find('span').text());
	})
}


function initMobiMenu(){
	var $window = $(window),
		$html = $('html'),
		$body = $('body'),
		$doc = $('html,body'),
		$main = $('.site-main'),
		$menu_wrap = $('.w-site-mobimenu'),
		$menu_cont = $('.mobimenu-nav-cont'),
		$overlay = $('.mobi-mask'),
		$menu_btn = $('.mobi-btn-menu'),
		$menu_inner = $('.site-mobimenu'),
		$menu_nav_btns = $('.mobimenu-nav-list li'),
		$menu_back_btn = $('.mobimenu-btn_back, .mobimenu-subnav .mobimenu-title'),
		$menu_subnavs = $('.mobimenu-subnav'),
		$menu_subnav_btns = $('.mobimenu-subnav-list li h3'),
		$menu_subnav_icons = $('.mobimenu-subnav-list li em'),
		$menu_thirdmenu = $('.mobimenu-subnav-list li dl'),
		menu_width = 220,
		menu_opened = false,
		submenu_opened = false,
		tw_menu,
		tw_submenu;

	$window.on('resize',function(e){
		var win_height = $window.height();
		$menu_cont.height(win_height-45);
		$menu_wrap.height(win_height);
	}).trigger('resize');

	$menu_btn.on('tap',function(e){
		e.stopPropagation();
		if (tw_menu && tw_menu.isActive()) { return; }
		
		
		tw_menu = TweenLite.to($main, 0.2,{left: -menu_width,onStart:function(){
			$overlay.show();
			$menu_wrap.show();
			$doc.css({'overflow-y':'hidden'});
		},onComplete:function(){
			menu_opened = true;
		},onReverseComplete:function(){
			menu_opened = false;
			$doc.css({'overflow-y':''});
			$overlay.hide();
			$menu_wrap.hide();
		}});
	});
	$overlay.on('tap',function(e){
		e.stopPropagation();
		if(menu_opened){
			tw_menu.reverse();
			tw_submenu && tw_submenu.reverse();
		}
		return false;
	});

	$menu_nav_btns.on('tap',function(e){
		e.stopPropagation();
		var $menu_subnav = $('#'+$(this).attr('id')+'-subnav');
		
		if (tw_submenu && tw_submenu.isActive() || $menu_subnav.size()==0) { return; }
		$menu_subnav.show();
		tw_submenu = TweenLite.to($menu_inner, 0.2,{left: -menu_width,onComplete:function(){
			submenu_opened = true;
		},onReverseComplete:function(){
			submenu_opened = false;
			$menu_subnavs.hide();
		}});
		return false;
	});

	$menu_back_btn.on('tap',function(e){
		e.stopPropagation();
		if(submenu_opened){
			tw_submenu.reverse();
		}
		return false;
	});

	$menu_subnav_btns.on('tap',function(e){
		e.stopPropagation();
		var $this = $(this),
			$icon = $this.find('em'),
			$thirdmenu = $this.siblings('dl'),
			icons = ['–','+'];
		$menu_thirdmenu.not($thirdmenu).slideUp(220);
		$menu_subnav_icons.not($icon).text('+');
		$icon.text($icon.text()=='+'?'–':'+');
		$thirdmenu.slideToggle(220);
		return false;
	});

}
















