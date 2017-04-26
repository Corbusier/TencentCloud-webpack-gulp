//树形菜单
function createTreeHtml(datas,id){
	//先找指定id的子数据
	var childs = handle.getChildsById(datas,id);
	var html = "<ul>";
	if(!childs.length) return "";
	childs.forEach(function (value){
		//找到当前数据层级
		var level = handle.getParentsAllById(datas,value.id).length;
		//获取这条数据的子数据，目的是用来判断是否要添加带图标的class,如果没有子数据,则不添加图标
		var childs2 = handle.getChildsById(datas,value.id);
		var className = childs2.length ? "tree-contro" : "tree-contro-none";
		html += '<li>'+
                '<div style="padding-left:'+level*14+'px;" class="tree-title show-list '+className+'" data-id="'+value.id+'">'+
                    '<span>'+
                        '<strong class="ellipsis">'+value.title+'</strong>'+
                        '<i class="ico"></i>'+
                    '</span>'+
                '</div>';
        html += createTreeHtml(datas,value.id);	
        html += '</li>';	
	})
	html += "</ul>";
	return html;
}
//导航区域
//找到指定id的所有的父级
function createNavHtml(datas,id){
	var parents = handle.getParentsAllById(datas,id).reverse();	
	var len = parents.length;
	//渲染下标从0到length-1
	var navHtml = '';
	for( var i = 0; i < len-1; i++ ){
								//此处如果没有层级改变,除了最后一个之外的a标签都不会有箭头
		navHtml += '<a href="javascript:;" data-id="'+parents[i].id+'" style="z-index:'+(len-i)+';">'+parents[i].title+'</a>';
	}

	navHtml += '<span class="current-path" style="z-index:0;">'+parents[len-1].title+'</span>';

	return navHtml;
}
//渲染文件区域的函数
function createFileHtml(datas,id){
	var fileChilds = handle.getChildsById(datas,id);
	var fileHtml = '';
	fileChilds.forEach(function (value){
		//超级字符串
		fileHtml += `<div class="file-item" data-id="${value.id}">
                         <div class="item">
                             <lable class="checkbox"></lable>
                                 <div class="file-img">
                                 <i></i>
                                 </div>
                             <p class="file-title-box">
                                 <span class="file-title">${value.title}</span>
                                 <span class="file-edtor">
                                     <input class="edtor" type="text">
                                 </span>
                             </p>
                         </div> 
                     </div>`;
	});
	return fileHtml;
}
//新建文件夹时
function createNewFile(){
	var div = document.createElement("div");
	div.className = "file-item";
	//先传一个空对象,占据一个位置
	div.innerHTML = fileInner({});
	return div;
}
function fileInner(value){
	var str = `<div class="item">
                 <lable class="checkbox"></lable>
                     <div class="file-img">
                     <i></i>
                     </div>
                 <p class="file-title-box">
                     <span class="file-title">${value.title}</span>
                     <span class="file-edtor">
                         <input class="edtor" type="text">
                     </span>
                 </p>
             </div>`;
    return str;
}