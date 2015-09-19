requirejs.config({
		baseUrl:'js/lib'
		,urlArgs : "bust="+new Date().getTime()
		,paths:{
			br:'../br'
			/*,util:'underas/util'
			,core:'underas/core'
			,container:'underas/container'
			,controller:'underas/controller'
			,net:'underas/net'*/
		}
});

//var _app = {"loaded":{}};

$(function(){
	requirejs(
		['container','br/underas/view/Arquivo']
		,function(_container,_modtmp){
			//console.log(m);
			//var t = new sub.SubB(45);
			//t.doAnyThing("nova instancia!!!!");
			//$("body").append("<div>!teste</div>");
			var teste = new _modtmp.Arquivo();
			var mdw = new _container.ModView("cadastro de teste!!!");
			mdw.setIcon("key");
			mdw.show(true);
			mdw.append(teste); 
		}
	);	
});
