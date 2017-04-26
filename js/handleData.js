var handle = {
	//通过id找到对应的数据
	getSelfById(data,id){
		return data.find(function (value){
			return value.id == id;
		})
	},
	//通过指定id找到子数据
	getChildsById (data,id){
		return data.filter(function (value){
			return value.pid == id;
		})	
	},
	//找到指定id所有的父数据，包含自己
	getParentsAllById (data,id){
		var arr = [];
		var self = 	handle.getSelfById(data,id);
		if( self ){
			arr.push(self);
			arr = arr.concat(handle.getParentsAllById(data,self.pid));
		}
		return arr;
	},
	//判断在子数据中存在某个标题
	//等于-1则不存在反之则存在
	isTitleExist(data,id,value){
		var childs = handle.getChildsById(data,id);
		return childs.findIndex(function(item){
			return item.title === value;
		}) !== -1;
	},
	//getParentsAllById的镜像版,找到数据本身,然后再找到它的全部子级
	getChildsAll(data,id){
		var arr = [];
		var self = handle.getSelfById(data,id);
		arr.push(self);
		//在子数据
		var childs = handle.getChildsById(data,self.id);
		childs.forEach(function (value){
			arr = arr.concat(handle.getChildsAll(data,value.id));
		})
		return arr;
	},
	//通过div的行间自定义属性,也就是id,找到所有的子级数据,之后再删除
	getChildsByIdArr(data,idArr){
		var arr = [];
		idArr.forEach(function(value){
			arr = arr.concat(handle.getChildsAll(data,value));
		})
		return arr;
	},
	deleteChildsByIdArr(data,idArr){
		var childs = handle.getChildsByIdArr(data,idArr);
		for(var i = 0;i<data.length;i++){
			for(var j = 0;j<childs.length;j++){
				if(data[i] === childs[j]){
					data.splice(i,1);
					i--;
					break;
				}
			}
		}
	}
}



