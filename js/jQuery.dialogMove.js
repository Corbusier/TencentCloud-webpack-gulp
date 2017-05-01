;(function($,window,undefined,document){
    function DialogMove(obj){
        obj = obj || {};
        if(obj.constructor !== Object){
            options = {};
        }
        this.defaults = {
            titleName : "",
            fileTitle : "",
            content: "我是内容",
            okFn : function(){}
        }

        $.extend(this.defaults,obj);
        this.init();
        $.drag({
            targetEle: this.h3,
            moveEle: this.strDiv[0]
        })
    }
    DialogMove.prototype = {
        constructor : DialogMove,
        init(){
            this.strDiv = this.createHTML();
            this.h3 = strDiv[0].querySelector("h3");
            this.mask = this.mask();

            this.position();
            this.closed();
            this.confirm();
            this.cancel();
            this.resize();
            this.center();
        },
        createHTML(){
            var strDiv = $("<div></div>");
            strDiv.attr("id","full-pop");
            var strHTML =  `<h3 class="title clearfix">
                                <span class="titleName">选择储存位置</span>
                                <span class="close">×</span>
                            </h3>
                            <div class="moveFile clearfix">
                                <img src="img/moveFile.png" alt="移动文件" class="moveImg">
                                <span class="fileTitle">${this.defaults.fileTitle}</span>
                                <span class="fileNum"></span>
                            </div>
                            <section class="content">
                                <h3 class="contentTitle">移动到:</h3>
                                <div class="fileTree">
                                    ${this.defaults.content}
                                </div>
                            </section>
                            <div class="btnGroup">
                                <span class="error"></span>
                                <a href="javascript:void(0);" title="" class="confirm">确定</a>
                                <a href="javascript:void(0);" title="" class="cancle">取消</a>
                            </div>`
            strDiv.html(strHTML);
            $("body").append(strDiv);
            window.strDiv = strDiv
            return strDiv;
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
            //此处的this是实例,无法和window下的strDiv对应
            $(_this.strDiv).css({
                left : ( $(window).width() - $(_this.strDiv).outerWidth() )/2 + "px",
                top : ( $(window).height() - $(_this.strDiv).outerHeight() )/2 + "px",
            })
        },
        mask(){
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
        position(){
            $(this.strDiv).css({
                top : ($(window).height() - $(this.strHTML).outerHeight())/2 + "px",
                left : ($(window).width() - $(this.strHTML).outerWidth())/2 + "px"
            })
        },
        confirm(){
            var _this = this;
            $(".btnGroup .confirm").bind("click",function(){
                var bl = _this.defaults.okFn();
                //moveStatus为true则okFn函数返回值为true,此时不能关闭弹窗
                if(!bl){
                    $("#full-pop").remove();
                    $(".mask").remove();
                }
            })
        },
        closed(){
            $("#full-pop .close").bind("click",function(){
                $("#full-pop").remove();
                $(".mask").remove();
            })
        },
        cancel(){
            $(".btnGroup .cancle").bind("click",function(){
                $("#full-pop").remove();
                $(".mask").remove();
            })
        },
        fileShrink(){
            $("#full-pop .ico").bind("click",function(ev){
                $(ev.target).closest(".tree-title").toggleClass("show-list");   
                var $ulList = $(ev.target).closest(".tree-title").next();
                if($(ev.target).closest(".tree-title").hasClass("show-list")){
                    $ulList.css("display","block");
                }else{
                    $ulList.css("display","none");
                } 
            }) 
        }
    }
    $.dialogMove = function(obj){
        new DialogMove(obj);
    }
})(JQuery,window,undefined,document)