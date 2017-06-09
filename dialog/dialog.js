function dialog(obj){
    var defaults = {
        asksure : "我是确认请求",
        title : "我是标题",
        text : "我是文字",
        okFn : function(){
            
        }
    }
    //赋值obj属性,并覆盖同名属性
    for(var attr in obj){
        defaults[attr] = obj[attr];
    }
    new Drag({
        targetEle: this.h3,
        moveEle:diaDiv
    })

    var diaDiv = document.createElement("div");
    diaDiv.id = "full-tip";
    var diaHTML = `<h3 class="title clearfix">
            <span class="titleName">${defaults.title}</span>
            <span class="close">×</span>
        </h3>
        <section class="content clearfix">
            <div class="tips clearfix">
                <div class="asksure">
                    ${defaults.asksure}
                </div>
                <div class="text">
                    ${defaults.text}
                </div>
            </div>
            <div class="btnGroup">
                <span class="error"></span>
                <a href="javascript:void(0);" title="" class="confirm">确定</a>
                <a href="javascript:void(0);" title="" class="cancle">取消</a>
            </div>
        </section>`

    diaDiv.innerHTML = diaHTML;
    this.h3 = diaDiv.querySelector("h3");
    document.body.appendChild(diaDiv);
    diaDiv.style.zIndex = 100;
    //遮罩层
    var mask = document.createElement("div");
    mask.style.cssText = "width:100%;height:100%;background:#000;opacity:.5;position:fixed;left:0;top:0;z-index:99;";
    document.body.appendChild(mask);
    center();
    function center(){
        diaDiv.style.left = (document.documentElement.clientWidth - diaDiv.offsetWidth)/2 + "px";
        diaDiv.style.top = (document.documentElement.clientHeight - diaDiv.offsetHeight)/2 + "px";
    }
    //防止抖动
    t.on(window,"resize",debuncing(center,50));

    var cancel = diaDiv.getElementsByClassName("cancle")[0];
    var confirm = diaDiv.getElementsByClassName("confirm")[0];
    var close = diaDiv.getElementsByClassName("close")[0];
    t.on(close,"click",function(){
        document.body.removeChild(diaDiv);
        document.body.removeChild(mask);
    })
    t.on(confirm,"click",function(){
        var bl = defaults.okFn();
        if(!bl){
            document.body.removeChild(diaDiv);
            document.body.removeChild(mask);
        }
    }),
    t.on(cancel,"click",function(){
        document.body.removeChild(diaDiv);
        document.body.removeChild(mask);
    })
}
