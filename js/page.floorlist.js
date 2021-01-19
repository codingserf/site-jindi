$(function(){
	var $fw_btns = $('.fw-btn'),
		$floor_num = $('.floor-tips-num ul'),
		fw_btn_curclass = 'fw-btn_current';


	var $type_btns = $('.floorlist-type-list li'),
		$type_btn_all = $('.btn-floorlist-type_all'),
		$list_items = $('.w-floorlist-list li'),
		cur_type_cls = 'z-on',
		$char_btns = $('.w-floor-initial li'),
		$char_btn_all = $('.btn-initial_all');

	var current = {
		type: null,
		floor: null
	}

	initTips();

	initFloorListType();
	initFloorListName();

	setFloor(g_initData.floor);
	setType(g_initData.type);

	//处理楼层导航和提示
	function initTips(){
		$fw_btns.each(function(i,e){
			var $e = $(e);

			$e.on('click',function(e){
				var $this = $(this),
					floor = $this.attr('id').replace('fw-btn_',''),
					index = $fw_btns.index($this);
				if($this.hasClass(fw_btn_curclass)) return;
				//切换当前btn和tip
				$fw_btns.removeClass(fw_btn_curclass);
				$this.addClass(fw_btn_curclass);
				//switchFloorTips(index);

				resetFloorListType();
				$list_items.hide().filter('.floor-'+floor).show();

				current.floor = floor;

				return false;
			});
		});
		

		/*function switchFloorTips(index){
			TweenLite.to($floor_num, 0.3, {bottom: -index+'00%',immediateRender:true});
		}*/
	}
	function setFloor(floor){
		$('#fw-btn_'+floor).trigger('click');
	}

	function setType(type){
		console.log(type,$type_btns.filter('[data-type*="'+type+'"]'));
		$type_btns.filter('[data-type*="'+type+'"]').trigger('click');
	}
	function initFloorListType(){
		$type_btns.on('click',function(e){
			var $this = $(this),
				show_cls = $this.attr('data-type');

			if($this.hasClass(cur_type_cls)){
				return;
			}

			//$type_btns.removeClass(cur_type_cls);
			resetFloorListType();
			$this.addClass(cur_type_cls);
			$list_items.hide().filter('.'+show_cls).show();
		});

		$type_btn_all.on('click',function(e){
			resetFloorListType();
		});
	}

	function resetFloorListType(){
		$type_btns.removeClass(cur_type_cls);
		$fw_btns.removeClass(fw_btn_curclass);
		$list_items.show();
	}

	function initFloorListName(){
		$list_items.each(function(i,o){
			var $this = $(o),
				initial = ConvertPinyin($this.find('.fl-name span').text()).charAt(0).toUpperCase();
			$this.addClass('initial-'+initial);
		});

		$char_btns.on('click',function(e){
			var $this = $(this),
				initial = $this.text();
			resetFloorListType();
			$list_items.hide().filter('.initial-'+initial).show();
		});

		$char_btn_all.on('click',function(e){
			resetFloorListType();
		});
	}

});


