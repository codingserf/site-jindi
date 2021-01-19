// 日期插件
$(function(){
	$('#member-birthday').Zebra_DatePicker({
		view: 'years',
	    format: 'Y-m-d',
	    show_icon: false,
	    offset: [-10,30]
	});

	initPointsMall();
});
function initPointsMall(){
	$('.btn-pointOrder').on('click',function(e){
		var $this = $(this),
			$ucont2 = $this.parents('.u-cont1').siblings('.u-cont2');

		$this.hide();
		$ucont2.show();
		return false;
	});
	$('.btn-pointConfirm').on('click',function(e){
		var $this = $(this),
			$ucont2 = $this.parents('.u-cont2'),
			$ucont3 = $ucont2.siblings('.u-cont3');

		/* ajax 提交兑换数据*/




		/* /ajax*/
		$ucont2.hide();
		$ucont3.show();
		return false;
	});
	$('.btn-pointCancel').on('click',function(e){
		var $this = $(this),
			$ucont2 = $this.parents('.u-cont2'),
			$btnPointOrder = $ucont2.siblings('.u-cont1').find('.btn-pointOrder'); 

		$ucont2.hide();
		$btnPointOrder.show();
		return false;
	});
}
