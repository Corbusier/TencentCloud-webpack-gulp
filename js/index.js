(function (){
	//让weiyun-content自适应
	var mainContent = document.getElementsByClassName("weiyun-content")[0];
	var header = document.getElementsByTagName("header")[0];
	
	//当window缩放时,内容区的高度自适应,防止由小变大时,高度不能自适应
	function resize(){
		var clientH = t.view().h;
		mainContent.style.height = clientH - header.offsetHeight + "px";
	}
	resize();
	//防止抖动函数
	function debuncing(fn,delay){
        let timer = null;
        return function(){
            //在匿名函数中this就是window
            let context = this;
            let args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context,args);
            },delay);
        }
    }
    window.debuncing = debuncing;
    t.on(window,"resize",debuncing(resize,500));
	//$(window).bind("scroll",debuncing(foo,2000));
	//---------------------------------渲染各个区域-----------------------------------------
	//准备数据
	var datas = data.files;
	//1. 菜单区域
	var treeMenu = document.getElementsByClassName("tree-menu")[0];
	
	treeMenu.innerHTML = createTreeHtml(datas,-1);
	t.shrink();
	//获取指定id对应的树形菜单的标题
	function getTreeById(id){
		var treeTitle = treeMenu.getElementsByClassName("tree-title");
		for( var i = 0; i < treeTitle.length; i++ ){
			if( treeTitle[i].dataset.id == id ){
				return treeTitle[i];
			}
		}
	}
	//初始状态下给id值为0的标题加上tree-nav,而data-id === id,所以需要获取到行间自定义的属性data-id
	//t.addClass(getTreeById(0),"tree-nav");
	getTreeById(0).classList.add("tree-nav");
	//2. 导航区域
	var pathNav = document.getElementsByClassName("path-nav")[0];
	
	//渲染导航
	pathNav.innerHTML = createNavHtml(datas,0);
	//3. 文件区域
	var fileList = document.getElementsByClassName("file-list")[0];
	
	fileList.innerHTML = createFileHtml(datas,0);
	//重构各区域的公共方法
	function render(fileId){
		//t.removeClass(getTreeById(currentId),"tree-nav");
		getTreeById(currentId).classList.remove("tree-nav");
		//t.addClass(getTreeById(fileId),"tree-nav");
		getTreeById(fileId).classList.add("tree-nav");
		//渲染导航
		pathNav.innerHTML = createNavHtml(datas,fileId);
		//渲染文件区域
		var childs = handle.getChildsById(datas,fileId);
		//文件区没有子文件则显示背景图
		gEmpty.style.display = childs.length?"none":"block";
		fileList.innerHTML = createFileHtml(datas,fileId);
		currentId = fileId;
		//一旦重新渲染,全选肯定是未勾选的
		checkedAll.classList.remove("checked");
	}
	//提醒功能
	var fullTipBox = document.getElementsByClassName("full-tip-box")[0];
	var text = fullTipBox.getElementsByClassName("text")[0];

	function fullTip(className,message){
		//这一步的目的是为了下一次变化时清除之前的class,避免添加多个class,否则提示框的颜色会出错
		fullTipBox.className = "full-tip-box";
		setTimeout(function(){
			fullTipBox.classList.add(className);
			fullTipBox.style.top = 0;
		},0);
		text.innerHTML = message;
		clearTimeout(fullTipBox.timer);
		fullTipBox.timer = setTimeout(function(){
			fullTipBox.style.top = "-32px";
		},2000);
	}
//-----------------------------------添加各个区域的交互--------------------------------------
	
	//每个区域的交互事件发生时,重新渲染都是相同的部分,因此可以抽取出来单独作为一个功能实现
	//所用到的原理都是通过点击的事件目标的行间自定义id与树形菜单中的div对应,然后做出add或remove回应
	//然后再使用create重构相应的区域

	//文件区域数据为空的提示
	var gEmpty = document.getElementsByClassName("g-empty")[0]; 
	//1. 树形菜单区域
	var currentId = 0;

	//利用事件委托。给最外层的父级添加点击处理
	t.on(treeMenu,"click",function (ev){
		//先要获取点击的元素对应的id，目的是找到对用的数据
		var target = ev.target;
		//此时的target可能是div及其子元素
		//找到的父级只可能是div .tree-title 
		//此时是直接赋值,将div赋值给target,返回值是true,自然会执行以下的语句
		if( target = t.parent(target,".tree-title") ){
			var fileId = target.dataset.id;	
			render(fileId);
		}
	});
	//2. 导航区域
	t.on(pathNav,"click",function (ev){
		var target = ev.target;
		if( target.nodeName === "A" ){
			var fileId = target.dataset.id;
			render(fileId);
		}
	});

	//3. 文件区域
	//在需要的时候勾选input,不进入下一级
	//其他时候进入下一级
	t.on(fileList,"mouseover",function(ev){
		var target = ev.target;
		//直接将带file-item的div赋值给target,并且将其加上class
		if( target = t.parent(target,".file-item") ){
			//t.addClass(target,"file-checked");
			target.classList.add("file-checked");
		}
	})
	//当移开时,如果lable的checkbox没有checked,那么就直接把div的class移除
	t.on(fileList,"mouseout",function(ev){
		var target = ev.target;
		if( target = t.parent(target,".file-item") ){
			var checkbox = target.getElementsByClassName("checkbox")[0];
			if( !checkbox.classList.contains("checked") ){
				//t.removeClass(target,"file-checked");
				target.classList.remove("file-checked");
			}
		}
	})
	t.on(fileList,"click",function (ev){
		var target = ev.target;		
		//如果target是checkbox,则不进入下一级
		if( t.parent(target,".checkbox") ){
			return;
		}
		if( target = t.parent(target,".file-item") ){
			var fileId = target.dataset.id;
			console.log(getTreeById(fileId));
			render(fileId);
		}
	})		

//---------------------------------checkbox的单选和全选功能--------------------------------------
	var checkedAll = document.getElementsByClassName("checked-all")[0];
	var checkboxs = fileList.getElementsByClassName("checkbox");
	var fileItems = fileList.getElementsByClassName("file-item");
	var checkboxs = fileList.getElementsByClassName("checkbox");

	//单选功能,事件代理的方式添加点击事件
	t.on(fileList,"click",function(ev){
		var target = ev.target;
		if( t.parent(target,".checkbox") ){
			//target赋值
			target = t.parent(target,".checkbox");
			target.classList.toggle("checked");
			//单选功能
			var res = Array.from(checkboxs).every(function(value){
				return value.classList.contains("checked");
			})
			res?checkedAll.classList.add("checked"):checkedAll.classList.remove("checked");
		}
	})
	//全选功能
	//除了能够全选以外,还要
	//1.根据文件下是否有子数据判断是否有该功能
	//2.file-item下的div添加file-checked,否则鼠标移开时,选区的背景色,勾选都将不存在
	t.on(checkedAll,"click",function(ev){
		//判断当前文件下是否有子数据
		var childs = handle.getChildsById(datas,currentId);
		if(!childs) return;
		var res = this.classList.toggle("checked");
		Array.from(checkboxs).forEach(function(value,index){
			if(res){
				value.classList.add("checked");
				fileItems[index].classList.add("file-checked");
			}else{
				value.classList.remove("checked");
				fileItems[index].classList.remove("file-checked");
			}
		})
	})

//--------------------------------------新建文件夹--------------------------------------------
	var create = document.getElementsByClassName("create")[0];
	
	var createOnoff = true;//新建文件夹按钮可点击
	t.on(create,"mouseup",function(){
		var newFile = createNewFile();
		var firstElement = fileList.firstElementChild;
		if(firstElement){
			fileList.insertBefore(newFile,firstElement);
		}else{
			fileList.appendChild(newFile);
		}
		gEmpty.style.display = "none";

		var fileTitle = newFile.getElementsByClassName("file-title")[0];
		var fileEdtor = newFile.getElementsByClassName("file-edtor")[0];
		var edtor = newFile.getElementsByClassName("edtor")[0];
		
		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";
		edtor.focus();
		//新建状态
		create.isCreate = true;
	})
	t.on(document,"keyup",function (ev){
		if( ev.keyCode === 13 ){
			createFile();
		}
	})

	t.on(document,"mousedown",createFile);
	function createFile(){
		if(!create.isCreate)return;

		var firstElement = fileList.firstElementChild;
		var fileTitle = firstElement.getElementsByClassName("file-title")[0];
		var fileEdtor = firstElement.getElementsByClassName("file-edtor")[0];
		var edtor = firstElement.getElementsByClassName("edtor")[0];
		var value = edtor.value.trim();
		
		if(value){
			var isExist = handle.isTitleExist(datas,currentId,value);
			if(isExist){
				fileList.removeChild(firstElement);
				fullTip("warn","命名冲突,请输入其他名称")
			}else{
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				fileTitle.innerHTML = value;
				
				var id = Math.ceil(Math.random()*10000);
				//在数据中添加上新建的数据
				datas.unshift({
					id:id,
					pid:currentId,
					title:value,
					type:"file"
				});
				firstElement.setAttribute("data-id",id);
				treeMenu.innerHTML = createTreeHtml(datas,-1);
				fullTip("ok","新建成功");
				//新建一个就要把所有的checkbox去掉,并且checkAll也去掉
				var selectArr = whoSelect();
				selectArr.forEach(function(value){
					var checkbox = value.getElementsByClassName("checkbox")[0];
					checkbox.classList.remove("checked");
					value.classList.remove("file-checked");
				})
				checkedAll.classList.remove("checked");
				t.shrink();
			}
		}else{
			fileList.removeChild(firstElement);
		}
		create.isCreate = false;
	}

//---------------------------------------删除-----------------------------------------------	
	//通过勾选div的file-checked确定被删除项
	function whoSelect(){
		return Array.from(checkboxs).filter(function(value){
			return value.classList.contains("checked");
		}).map(function(value){
			return t.parent(value,".file-item")
		})
	}
	var deleteBtn = document.getElementsByClassName("delete")[0];
	t.on(deleteBtn,"click",function(ev){
		var selectArr = whoSelect();
		//从删除的备选项中将id属性取出,然后从数据中再删除对应的数据
		if(selectArr.length){
			$.dialog({
				asksure : "确定要删除这张图片吗?",
		        title : "删除文件",
		        text : "已删除的文件可以在回收站找到",
		        okFn : function(){
		        	var idArr = [];
					selectArr.forEach(function(value){
						idArr.push(value.dataset.id);
					})
					//从data中删除所选的数据
					handle.deleteChildsByIdArr(datas,idArr);
					treeMenu.innerHTML = createTreeHtml(datas,-1);
					render(currentId);
					fullTip("ok","删除文件成功");
					t.shrink();
		        }
			})
		}else{
			fullTip("warn","请选择删除文件");
		}
	})

//----------------------------------框选-------------------------------------------
	function getRect(obj){
		return obj.getBoundingClientRect();
	}
	function crash(obj1,obj2){
		var first_Rect = getRect(obj1);
		var second_rect = getRect(obj2);

		var firstLeft = getRect(obj1).left;
		var firstTop = getRect(obj1).top;
		var firstRight = getRect(obj1).right;
		var firstBottom = getRect(obj1).bottom;

		var secondLeft = getRect(obj2).left;
		var secondTop = getRect(obj2).top;
		var secondRight = getRect(obj2).right;
		var secondBottom = getRect(obj2).bottom;
		if(firstLeft > secondRight||firstRight < secondLeft||firstTop > secondBottom||firstBottom < secondTop){
			return false;
		}else{
			return true;
		}
	}
	//框选file-list的内容,将其选中后删除,当里面的checkbox在checked状态时不能再框选
	var div = null,
		fake = null,
		thumbnail = null,
		isHitElement = [];
	t.on(document,"mousedown",function(ev){
		//只能是左键时才可以
		if(ev.which !== 1) return;
		ev.preventDefault();
		if( !t.parent(ev.target,".file-list") ){
			return;
		}
		var isChecked = false;
		//当点击的是file-item区域时,如果有checked出现,将ischecked改为为ture
		//当为true时,不能在该区域内框选
		if(t.parent(ev.target,".file-item")){
			isChecked = !!t.parent(ev.target,".file-item").getElementsByClassName("checked")[0];	
		}
		var disX = ev.clientX;
		var disY = ev.clientY;
		document.onmousemove = function(ev){
			//如果是被选状态,不能再生成选区
			//isChecked为true时,移动选中的文件
			if(isChecked){
				//必须是移动的距离大于5个像素,才可以生成文件数
				if(Math.abs(ev.clientX - disX)<5 || Math.abs(ev.clientY - disY)<5){
					return;
				}
				var selectArr = whoSelect();
				//文件数目的缩略
				if(!thumbnail){
					thumbnail = document.createElement("div");
					thumbnail.className = "numCircle";
					thumbnail.innerHTML = `<div class="numCircle">
										        ${selectArr.length}
										   </div>`;
				    document.body.appendChild(thumbnail);
				    //为了防止在框选文件夹时在同一个文件夹下down-up进入下一级
				    fake = document.createElement("div");
				    fake.style.cssText = `width: 10px;
        								  height: 10px;
        								  background: red;
        								  position: absolute;
        								  left:0;
        								  top:0;
        								  opacity:1;
								  		 `;
			  		document.body.appendChild(fake);
				}
				thumbnail.style.left = ev.clientX + 24 + "px";
				thumbnail.style.top = ev.clientY + 24 + "px";
				fake.style.left = ev.clientX - 5 + "px";
				fake.style.top = ev.clientY - 5 + "px";
			
				for(var i = 0;i<fileItems.length;i++){
					var onOff = false;
					for(var j = 0;j<selectArr.length;j++){
						if(selectArr [j] === fileItems[i]){
							onOff = true;
						}
					}
					if(onOff)continue;
					if( crash(fake,fileItems[i]) ){
						fileItems[i].classList.add("file-checked");
						// isHitElement = fileItems[i];
						// console.log(isHitElement)
						console.log(Array.from(fileItems[i]));
					}else{
						fileItems[i].classList.remove("file-checked");
						isHitElement = null;
					}
				}
				//不写return时,框选之后紧接着移动选好的文件夹会再次框选文件重复动作,
				//为了避免重复画圈再拖动,应该把这一次的动作先终止避免重复
				return;
			};

			if(Math.abs(ev.clientX - disX)>15 || Math.abs(ev.clientY - disY)>15){
				if(!div){
					div = document.createElement("div");
					div.className = "frame";
					document.body.appendChild(div);
				}

				div.style.width = Math.abs(ev.clientX - disX) + "px";
				div.style.height = Math.abs(ev.clientY - disY) + "px";
				var left = Math.min(ev.clientX,disX);
				var top = Math.min(ev.clientY,disY);
				left = left<345?345:left;
				top = top<143?143:top;
				div.style.left = left + "px";
				div.style.top = top + "px";
				//检测碰撞
				for(var i = 0;i<fileItems.length;i++){
					if(crash(div,fileItems[i])){
						fileItems[i].classList.add("file-checked");
						checkboxs[i].classList.add("checked");
					}else{
						fileItems[i].classList.remove("file-checked");
						checkboxs[i].classList.remove("checked");
					}
				}
				//判断全选
				var selectArr = whoSelect();
				if(selectArr.length == fileItems.length){
					checkedAll.classList.add("checked");
				}else{
					checkedAll.classList.remove("checked");
				}
			}
		}
		//console.log(isHitElement);
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			if( div ){
				document.body.removeChild(div);
				//把div变量设置为null,再次点击还要继续生成div
				div = null;
			}
			if( thumbnail ){
				document.body.removeChild(fake);
				document.body.removeChild(thumbnail);

				fake = null;
				thumbnail = null;
			}
			//console.log(isHitElement);
			//是否存在目标目录
			// if(isHitElement){
			// 	//判断移动的项是否在目标目录的子数据下存在
			// 	var onOff = true;
			// 	var selectArr = whoSelect();
			// 	var selectIdArr = selectArr.map(function(value){
			// 		return value.dataset.id;
			// 	})
			// 	var fileId = isHitElement.dataset.id;
			// 	for(var i = 0;i<selectIdArr.length;i++){
			// 		var self = handle.getSelfById(data,selectIdArr[i]);
			// 		var isExist = handle.isTitleExist(datas,fileId,self.title);
			// 		if(!isExist){
			// 			self.pid = fileId;
			// 			fileList.removeChild(selectArr[i]);
			// 		}else{
			// 			onOff = true;
			// 		}
			// 	}
			// 	if(onOff){
			// 		fullTip("warn","文件因重名移动失败");
			// 	}
			// 	treeMenu.innerHTML = createTreeHtml(datas,-1);
			// 	isHitElement = null;
			// }
		}
	})

//--------------------------------------重命名-------------------------------------------------- 	
	
	var rename = document.getElementsByClassName("rename")[0];
	//保留重命名的元素
	var re_obj = {};
	t.on(rename,"click",function(ev){
		var selectArr = whoSelect();
		if(selectArr.length == 1){
			re_obj.element = selectArr[0];
			re_obj.fileTitle = re_obj.element.querySelector(".file-title");
			re_obj.fileEdtor = re_obj.element.querySelector(".file-edtor");
			re_obj.edtor = re_obj.element.querySelector(".edtor");

			re_obj.fileTitle.style.display = "none";
			re_obj.fileEdtor.style.display = "block";

			re_obj.edtor.value = re_obj.fileTitle.innerHTML.trim();
			re_obj.edtor.select();
			//正在重命名
			rename.isRename = true;
		}else if(selectArr.length>1){
			fullTip("warn","只能对单个文件重命名");
		}else{
			fullTip("warn","请选择文件");
		}
	})
	t.on(document,"mousedown",function(){
		if(!rename.isRename) return;
		//判断input的值是否为空
		//1.不为空
			//是否冲突
				//1).冲突
					//提醒命名不成功,还原
				//2).不冲突
					//提醒命名成功
		//2.空
			//还原之前的名字
		var value = re_obj.edtor.value.trim();
		//根据currentId判断当前的title是否在datas中存在
		if(value){
			var isExist = handle.isTitleExist(datas,currentId,value);
			//如果有内容,并且内容与input内的相同,再次点击document时,不会发生任何反应,
			//此时保持原状,也不需要提醒
			if(value === re_obj.fileTitle.innerHTML.trim()){
				
			}else if(isExist){
				fullTip("warn","命名冲突，请重新命名");
			}else{
				fullTip("ok","命名成功");
				re_obj.fileTitle.innerHTML = value;
				var self = handle.getSelfById(datas,re_obj.element.dataset.id);
				self.title = value;
				treeMenu.innerHTML = createTreeHtml(datas,-1);
				t.shrink();
			}
		}
		re_obj.fileTitle.style.display = "block";
		re_obj.fileEdtor.style.display = "none";

		re_obj.element.classList.remove("file-checked");
		re_obj.element.querySelector(".checkbox").classList.remove("checked");
		//修改重命名状态,否则再继续重命名时会一直显示命名冲突
		rename.isRename = false;
	})
//----------------------------------------移动到--------------------------------------------
	
	var move = document.getElementsByClassName("move")[0];
	t.on(move,"click",function(){
		// var fullTip = document.getElementById("#full-tip");
		// var fileNum = fullTip.getElementsByClassName("fileNum");
		// console.log(fileNum)
		//目标目录的id
		var fileId = null;
		//默认状态下没有选择任何目标目录,此时为true,表示不可关闭弹窗
		var moveStatus = true;
		//保留的是带file-item的div
		var selectArr = whoSelect();
		//用于存储移动项的id值
		var selectIdArr = [];	
		//console.log(datas.selectIdArr.title);
		for(var i = 0;i<selectArr.length;i++){
			selectIdArr.push(selectArr[i].dataset.id);
		}
		if(selectArr.length){
			$.dialogMove({
				titleName : "选择储存位置",
	        	fileTitle : handle.getSelfById(datas,selectIdArr[0]).title,
	    	    content : "<div class='tree-menu-comm tree-move'>"+createTreeHtml(datas,-1)+"</div>",
				okFn(){
					//如果没有选择任何的目标目录,则返回true,此时不能关闭弹窗
					if(moveStatus){
						return true;
					}else{
						//判断是否有重名,如果重名则为true
						//仅仅只是判断在目标目录下的子级,也就是移动后的同级间是否有重名的判断
						var onOff = false;
						for( var i = 0;i<selectIdArr.length;i++){
							var self = handle.getSelfById(datas,selectIdArr[i]);
							var isExist = handle.isTitleExist(datas,fileId,self.title);
							if(!isExist){
								self.pid = fileId;
								fileList.removeChild(selectArr[i]);
							}else{
								onOff = true;
							}	
						}
						if(onOff){
							fullTip("warn","文件因重名移动失败");
						}
						//树形菜单的内容改变,需要重新渲染
						treeMenu.innerHTML = createTreeHtml(datas,-1);
						t.shrink();
					}
				}
			})
			if(selectArr.length > 1){
				var fileNum = document.getElementsByClassName("fileNum")[0];
				fileNum.innerHTML = "等" +selectIdArr.length+ "个文件";
			}
			var treeMove = document.getElementsByClassName("tree-move")[0];
			//保存被选项在datas中的所有数据及子孙数据
			var selectData = handle.getChildsByIdArr(datas,selectIdArr);
			var error = document.getElementsByClassName("error")[0];

			//将第一个目录加上背景色
			var Cloud = treeMove.getElementsByClassName("tree-title")[0];
			Cloud.classList.add("tree-nav");
			var currentElement = Cloud;//记录添加背景色的初始元素
			t.on(treeMove,"click",function(ev){
				var target = ev.target;
				//将tree-title的div直接赋值给target
				if(target = t.parent(target,".tree-title")){
					//清除上一个,添加到当前目标
					currentElement.classList.remove("tree-nav");
					target.classList.add("tree-nav");
					currentElement = target;
					fileId = target.dataset.id;
					//目标目录在datas中的数据
					var oneData = handle.getSelfById(datas,fileId);
					//移动被选项[0]在datas中的数据
					var selfData = handle.getSelfById(datas,selectIdArr[0]);
					//console.log(fileId == selfData.pid)
					//如果父级(目标目录).id == 子级(被选项).pid则说明他本身已经存在在该目录的子级
					if(fileId == selfData.pid){
						error.innerHTML = "该文件下已经存在";
						moveStatus = true;
						return;
					}
					var onOff = false;
					//判断被选项中任何一个是否与目标目录有从属或者相同的关系
					for(var i = 0;i<selectData.length;i++){
						if(oneData.id == selectData[i].id){
							onOff = true;
							break;
						}
					}
					if(onOff){
						error.innerHTML = "不能将文件移动到自身或其子文件夹下";
						moveStatus = true;
					}else{
						error.innerHTML = "";
						moveStatus = false;
					}
				}
			})
		}else{
			fullTip("warn","请选择要移动的文件");
		}
	})
	
})();