(function($,window,document,undefined){
	function Drag(options) {
		//必填并且必须是一个对象
		if(typeof options === "undefined" || options.constructor !== Object) {
			//抛出错误
			throw new Error("传入的参数错误，必须是对象");
			return;
		}
		this.defaults = {
			targetEle: null,
			moveEle: null
		}
		//复制对象
		$.extend(this.defaults,options);
		if(this.defaults.moveEle) {
			this.element = this.defaults.moveEle;
		} else {
			this.element = this.defaults.targetEle;
		}
		this.init();
	};
	Drag.prototype = {
		constructor: Drag,
		init() {
			//要把一个函数的this改变为指定的值，并且不调用函数
			this.defaults.targetEle.onmousedown = this.downFn.bind(this);
		},
		downFn(ev) {
			this.disX = ev.clientX - this.element.offsetLeft;
			this.disY = ev.clientY - this.element.offsetTop;
			document.onmousemove = this.moveFn.bind(this);
			document.onmouseup = this.upFn;
			ev.preventDefault();
		},
		moveFn(ev) {
			this.element.style.left = ev.clientX - this.disX + "px";
			this.element.style.top = ev.clientY - this.disY + "px";
		},
		upFn() {
			document.onmousemove = null;
			document.onmouseup = null;
		}
	};
	$.drag = function(options){
		new Drag(options);
	}
})(jQuery,window,document,undefined);