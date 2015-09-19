requirejs.config({
		baseUrl:'js/br/net/underdesk/'
		,urlArgs : "bust="+new Date().getTime()
		,paths:{
			br:'../br'
				/*
			,util:'util'
			,core:'core'
			,container:'../../../../../lib/container'
			,controller:'controller'
			,net:'net'
			*/
		}
});

//var _app = {"loaded":{}};

$(function(){
	/*
	requirejs(
		['container','br/net/underdesk/arquivo/view/Arquivo']
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
	*/
	requirejs(
			['arquivo/view/Arquivo']
			,function(_modtmp){
				//console.log(m);
				//var t = new sub.SubB(45);
				//t.doAnyThing("nova instancia!!!!");
				//$("body").append("<div>!teste</div>");
				var teste = new _modtmp.Arquivo();
				/*
				var mdw = new _container.ModView("cadastro de teste!!!");
				mdw.setIcon("key");
				mdw.show(true);
				mdw.append(teste); 
				*/
			}
		);	
});
