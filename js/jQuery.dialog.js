;(function($,document,window,undefined){
	function Dialog(options){
		options = options || {};

		if(options.constructor !== Object){
			options = {};
		}
		//为了能让原型上的函数能使用这个defaults,必须使用this对象
		this.defaults = {
			title:"标题",
			asksure:"一个请求",
			text:"文字",
			left:null,
			top:null
		}
		
		$.extend(this.defaults,options);
		//原型上的函数先执行,再执行拖拽的对象绑定函数
		this.init();
		$.drag({
			targetEle: this.h3,
			moveEle: this.diaDiv[0]
		})
	}
	Dialog.prototype = {
		constructor : Dialog,
		init(){
			//之后定位函数需要用到diaDiv
			this.diaDiv = this.createHTML();
			this.mask = this.createMask();
			this.h3 = this.diaDiv[0].querySelector("h3");

			this.position();
			this.closed();
			this.confirm();
			this.cancel();
			this.resize();
			this.center();
			//this.debuncing();
		},
		resize(){
			var _this = this;
		 	$(window).bind("resize",_this.debuncing(_this.center,500))
		},
		debuncing(fn,delay){
	        var timer = null;
	        return function(){
	            //在匿名函数中this就是window
	            var context = this;
	            var args = arguments;
	            clearTimeout(timer);
	            timer = setTimeout(function(){
	                fn.apply(context,args);
	            },delay);
	        }
	    },
		center(){
			var _this = this;
			//此处的this是实例,无法和window下的diaDiv对应
			$(_this.diaDiv).css({
	        	left : ( $(window).width() - $(_this.diaDiv).outerWidth() )/2 + "px",
	        	top : ( $(window).height() - $(_this.diaDiv).outerHeight() )/2 + "px",
	        })
		},
		createHTML(){
			var diaDiv = $("<div></div>");
			diaDiv.attr("id","full-tip");
			var diaHTML =  `<h3 class="title clearfix">
					            <span class="titleName">${this.defaults.title}</span>
					            <span class="close">×</span>
					        </h3>
					        <section class="content clearfix">
					            <div class="tips clearfix">
					                <div class="asksure">
					                    ${this.defaults.asksure}
					                </div>
					                <div class="text">
					                    ${this.defaults.text}
					                </div>
					            </div>
					            <div class="btnGroup">
					                <span class="error"></span>
					                <a href="javascript:void(0);" title="" class="confirm">确定</a>
					                <a href="javascript:void(0);" title="" class="cancle">取消</a>
					            </div>
					        </section>`;
    		diaDiv.html(diaHTML);
    		$("body").append(diaDiv);
    		diaDiv.css({
    			"z-index" : "100"
    		});
    		//除了暴露diaDiv为全局变量让debuncing中的this与center中的this对应之外还有没有其他的办法?
    		window.diaDiv = diaDiv;
    		return diaDiv;
		},
		createMask(){
			var mask = $("<div></div>");
			mask.addClass("mask");
			mask.css({
				"width":"100%",
				"height":"100%",
				"background":"#000",
				"opacity": ".5",
			  	"position":"fixed",
			  	"left":"0",
			  	"top":"0",
			  	"z-index":"99"
			});
			$("body").append(mask);
			return mask;
		},
		//弹框的定位函数,如果只有其中一个,另一个则居中,都没有传则直接居中
		position(){
			//数值不为null,且不是NaN则返回true
			var isLeft = this.defaults.left !== null && !isNaN(Number(this.defaults.left));
			var isTop = this.defaults.top !== null && !isNaN(Number(this.defaults.top));
			var top = ($(window).height() - $(this.diaDiv).outerHeight())/2;		
			var left = ($(window).width() - $(this.diaDiv).outerWidth())/2;

			if(isLeft && isTop){
				$(this.diaDiv).css({
					top : this.defaults.top + "px",
					left : this.defaults.left + "px"
				})
			}else if( isLeft ){
				$(this.diaDiv).css({
					top : top + "px",
					left : this.defaults.left + "px"
				})
			}else if( isTop ){
				$(this.diaDiv).css({
					top : this.defaults.top + "px",
					left : left + "px"
				})
			}else{
				$(this.diaDiv).css({
					top : top + "px",
					left : left + "px"
				})
			}
		},
		closed(){
			$("#full-tip .close").bind("click",function(){
				$("#full-tip").remove();
				$(".mask").remove();
			})
		},
		confirm(){		
			var _this = this;
			$(".btnGroup .confirm").bind("click",function(){
				//该函数没有返回值,所以在执行完这个删除选中项的函数后
				//如果是undefined则需要移除遮罩和弹框
				var bl = _this.defaults.okFn();
				if(!bl){
					$("#full-tip").remove();
					$(".mask").remove();
				}
			})	
		},
		cancel(){
			$(".btnGroup .cancle").bind("click",function(){
				$("#full-tip").remove();
				$(".mask").remove();
			})
		}
	}
	//返回静态方法
	$.dialog = function (options){
		new Dialog(options);
	}
})(jQuery,document,window,undefined)