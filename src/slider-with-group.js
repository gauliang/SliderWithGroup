// CMUI_FOCUS_V2 by leonkao@163.com
$.fn.sliderWithGroup = function () {

	var $focusDom = this;

	var Core = function () {
		var _this_ = this;

		this.focus_group_nav = $focusDom.find('ul.focus_group_nav li a');
		this.focus_group = $focusDom.find('ul.focus_group');
		this.focus_nav = $focusDom.find('ul.focus_nav');
		this.focus_inner = $focusDom.find('div.focus_inner');
		this.text = this.focus_inner.find('span');

		this.focusWidth = $focusDom.width();
		this.slide_sum = this.focus_inner.find('li').length;
		this.groupIndex = 0;
		this.focusIndex = 0;
		this.btn_array = null;
		this.focus_group_list = null;

		this.focus_inner.css({ width: this.slide_sum * this.focusWidth });
		this.createNav();

		// Bind
		this.btn_array.bind("mouseover", function (event) {

			if (typeof (_this_.sliderRun) != 'undefined') {
				clearInterval(_this_.sliderRun);
			}

			if ($(this).hasClass('selected')) {
				return;
			}

			var start = _this_.focus_group_list[_this_.groupIndex].start;
			var index = _this_.focusIndex = _this_.btn_array.index($(this))+start;

			_this_.slideMoveTo(index);
		});

		this.btn_array.bind("mouseleave", function (event) {
			_this_.scrollAuto();
		});

		this.focus_group_nav.bind('mouseover', function () {

			if ($(this).hasClass('on')) {
				return;
			}

			if (typeof (_this_.sliderRun) != 'undefined') {
				clearInterval(_this_.sliderRun);
			}

			var index = _this_.focus_group_nav.index($(this));
			_this_.focusIndex = _this_.focus_group_list[index].start;
			_this_.slideMoveTo(_this_.focusIndex);
			_this_.scrollAuto();
		});
	}

	Core.prototype.createNav = function (groupIndex) {

		var list = [];
		var length = 0;
		var maxLength = 0;
		var computed = 0;

		$.each(this.focus_group, function (index, item) {
			length = $(item).find('li').length;
			computed = index > 0 ? list[index - 1].groupLength + computed : computed;
			maxLength = length > maxLength ? length : maxLength
			list.push({ groupId: index, groupLength: length, start: computed });
		});

		for (var index = 0; index < maxLength; index++) {
			this.focus_nav.append('<li></li>');
		}

		this.btn_array = this.focus_nav.find('li');
		this.focus_group_list = list;
		this.hiddenInvalidNavs(0);
	}

	// Start
	Core.prototype.start = function () {

		this.focus_group_nav.first().addClass('on');
		this.btn_array.first().addClass('selected');
		this.focusIndex = 1;
		this.scrollAuto();

	}

	Core.prototype.groupView = function (focusIndex) {

		var list = this.focus_group_list;
		var groupIndex = 0;
		var compare = 0;
		var tabs = this.focus_group_nav;

		for (var index = 0; index < list.length; index++) {
			compare += list[index].groupLength;
			this.groupIndex = groupIndex = focusIndex + 1 > compare ? (groupIndex + 1) : groupIndex
		}

		if (!tabs.eq(groupIndex).hasClass('on')) {
			tabs.removeClass('on');
			tabs.eq(groupIndex).addClass('on');

			// 隐藏无效导航点
			this.hiddenInvalidNavs(groupIndex);
		}

		this.navView(groupIndex, focusIndex);
	}

	Core.prototype.hiddenInvalidNavs = function (groupIndex) {
		this.focus_nav.css({ width: this.focus_group_list[groupIndex].groupLength * 20 })
	}

	Core.prototype.navView = function (groupIndex, focusIndex) {
		var navs = this.btn_array;
		var group = this.focus_group_list;
		var navIndex = focusIndex - group[groupIndex].start;

		navs.removeClass('selected');
		navs.eq(navIndex).addClass('selected');
	}

	// Focus Reset
	Core.prototype.reset = function () {
		this.focus_inner.css({ 'margin-left': 0 });
		this.text.css({ 'bottom': 0 });
	}

	// Fernal
	Core.prototype.slideMoveTo = function (num) {

		var slide_sum = this.slide_sum;
		
		if (num >= slide_sum) {
			this.isEnd = true;
			num = this.focusIndex = 0;
		}
		if (num < 0) { num = slide_sum - 1; }
		
		this.moveToWithAnimate(num)

		this.groupView(this.focusIndex);
		this.focusIndex++;
	}

	Core.prototype.moveToWithAnimate = function(num){
		var focusWidth = this.focusWidth;
		var span = this.text;
		var left = this.focus_inner.css('margin-left').replace('px','');

		if(Math.abs(left - -focusWidth * num)> focusWidth){
            if(num == 0 ){
                this.focus_inner.css({'margin-left': -focusWidth});
            }else{
                this.focus_inner.css({'margin-left': -focusWidth * num+focusWidth});
            }
			
		}
		
		span.css({ 'bottom': -70 });
		this.focus_inner.stop(true, false).animate({ 'margin-left': -(focusWidth * num) }, 300, function () { span.stop(true, false).animate({ 'bottom': 0 }, 50) });
	}

	// Auto
	Core.prototype.scrollAuto = function () {
		var btns = this.btn_array;
		var _this = this;
		this.sliderRun = setInterval(function () {
			_this.slideMoveTo(_this.focusIndex);
		}, 2000);
	}

	return (new Core()).start();
}