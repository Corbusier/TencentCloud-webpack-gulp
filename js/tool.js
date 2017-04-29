(function (){
	//单例模式
	var methods = {
		//添加事件
		on:function(element,evName,evFn){
			//element.addEventListener(evName,evFn,false);
			if(element.addEventListener){
				element.addEventListener(evName,evFn,false);
			}else if(element.attachEvent){
				element.attachEvent("on" + evName,evFn);
			}else{
				element["on" + type] = evFn;
			}
		},
		//移除事件
		off:function(element,evName,evFn){
			//element.removeEventListener(evName,evFn,false);
			if(element.removeEventListener){
				element.removeEventListener(evName,evFn,false)
			}else if(element.detachEvent){
				element.detachEvent("on" + evName,evFn);
			}else{
				element["on" + type] = null;
			}
		},
		//可视区域的宽高
		view(){
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		},
		//用途：在需要给target直接赋值时
		parent(element,attr){
			//先找到attr的第一个字符
			var firstChar = attr.charAt(0);
			if( firstChar === "." ){
				while( element.nodeType !== 9 && !element.classList.contains(attr.slice(1)) ){
					//element没有指定的class,那么element就为父级,继续向上找
					element = element.parentNode;
				}
			}else if(firstChar === "#"){
				while(element.nodeType !== 9 && element.id !== attr.slice(1)){
					//element没有指定的class,那么element就为父级,继续向上找
					element = element.parentNode;
				}
			}else{
				//节点类型不为文档类型并且元素的节点名不是标签名
				while(element.nodeType !== 9 && element.nodeName !== attr.toUpperCase()){
					//element没有指定的class,那么element就为父级,继续向上找
					element = element.parentNode;
				}
			}
			return element.nodeType === 9 ? null : element;
		},
		//树形菜单的收缩
		shrink(){
			$(".tree-menu .ico").bind("click",function(ev){
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
	window.t = methods;
})();