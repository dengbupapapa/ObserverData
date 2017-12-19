# observer-data
Observer data、defineProperty

## install
	npm i observer-data --save
## use
	let observerData = new ObserverData();
	
	observerData.data = data;
	observerData.cb = function(newVal, key, oldVal){}
	observerData.run();

## api

1. observerData.opt.exclude  
	* type:array
	* description:排除的属性，默认为空
2. observerData.opt.include  
	* type:array
	* description:包涵的属性，默认所有
3. observerData.run(dep)
	* type:all
	* description:dep=='dep'那么初始化会执行一次cb
4. observerData.cb
	* type:function
	* description:每次数据改变回调
5. $set
	* type:function
	* description:为新数据绑定监听事件
	* example
	:
		
		let data = {a:1}...
	
		data.$set('b',2);//新绑定了一个b属性
	
6. $del
	* type:function
	* description:删除属性清除监听并触发回调
	* example
	:
		
		let data = {a:1,b:2}...
	
		data.$del('b');//解除b属性的绑定并且删除触发回调。
		
### ps:数组经过重写，按原有方法使用也会触发监听。

## Community

[github](https://github.com/dengbupapapa/observer-data) 
[npm](https://www.npmjs.com/package/observer-data) 	
	