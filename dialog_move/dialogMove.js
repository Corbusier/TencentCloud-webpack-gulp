function dialogMove(obj){
    var defaults = {
        titleName : "",
        fileTitle : "",
        content: "我是内容",
        okFn : function(){}
    }
    for(var attr in obj){
        defaults[attr] = obj[attr];
    }
    
    // new Drag({
    //     targetEle: this.h3,
    //     moveEle:diaDiv
    // }) 
    var diaDiv = document.createElement("div");
    diaDiv.id = "full-pop";
    var diaHTML =  `<h3 class="title clearfix">
                        <span class="titleName">选择储存位置</span>
                        <span class="close">×</span>
                    </h3>
                    <div class="moveFile clearfix">
                        <img src="img/moveFile.png" alt="移动文件" class="moveImg">
                        <span class="fileTitle">${defaults.fileTitle}</span>
                        <span class="fileNum"></span>
                    </div>
                    <section class="content">
                        <h3 class="contentTitle">移动到:</h3>
                        <div class="fileTree">
                            ${defaults.content}
                        </div>
                    </section>
                    <div class="btnGroup">
                        <span class="error"></span>
                        <a href="javascript:void(0);" title="" class="confirm">确定</a>
                        <a href="javascript:void(0);" title="" class="cancle">取消</a>
                    </div>`
    diaDiv.innerHTML = diaHTML;
    this.h3 = diaDiv.querySelector("h3");
    document.body.appendChild(diaDiv);

    var mask = document.createElement("div");
    mask.style.cssText = "width:100%;height:100%;background:#000;opacity:.5;position:fixed;left:0;top:0;z-index:99;";
    document.body.appendChild(mask);

    diaDiv.style.left = (document.documentElement.clientWidth - diaDiv.offsetWidth)/2 + "px";
    diaDiv.style.top = (document.documentElement.clientHeight - diaDiv.offsetHeight)/2 + "px";
    center();
    function center(){
        diaDiv.style.left = (document.documentElement.clientWidth - diaDiv.offsetWidth)/2 + "px";
        diaDiv.style.top = (document.documentElement.clientHeight - diaDiv.offsetHeight)/2 + "px";
    }
    // t.on(window,"resize",function(){
    //     diaDiv.style.left = (document.documentElement.clientWidth - diaDiv.offsetWidth)/2 + "px";
    //     diaDiv.style.top = (document.documentElement.clientHeight - diaDiv.offsetHeight)/2 + "px";      
    // })
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
        //在okFn中返回false或undefined时,关闭弹窗
        //返回true时,moveStatus也为true,此时不能关闭弹窗
        if(!bl){
            document.body.removeChild(diaDiv);
            document.body.removeChild(mask);
        }
    }),
    t.on(cancel,"click",function(){
        document.body.removeChild(diaDiv);
        document.body.removeChild(mask);
    })  
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