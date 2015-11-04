requirejs.config({
		baseUrl:'js/lib'
		,urlArgs : "bust="+new Date().getTime()
		,paths:{
			br:'../br'	
			/*
			,util:'../../../../../lib/util'
			,core:'../../../../../lib/core'
			,container:'../../../../../lib/container'
			,controller:'../../../../../lib/controller'
			,net:'../../../../../lib/net'
					
			,'../../../../../lib/util':'util'
			,'../../../../../lib/core':'core'
			,'../../../../../lib/container':'container'
			,'../../../../../lib/controller':'controller'
			,'../../../../../lib/net':'net'
			*/	
				
			
		}
});

//var _app = {"loaded":{}};

$(function(){
	
	requirejs(
		['core','net','container','br/net/underdesk/arquivo/view/ArquivoView']
		,function(_core,_net,_container,_modtmp){
			var tmpLocation = _core.Underas.getLocation();
			//tmpLocation = tmpLocation.replace("8080","8330");
			//tmpLocation = tmpLocation.substring(0,tmpLocation.indexOf("8080"))+"8330/";
			_net.RequestManager.setRootUrl(tmpLocation);
			//console.log(m);
			//var t = new sub.SubB(45);
			//t.doAnyThing("nova instancia!!!!");
			//$("body").append("<div>!teste</div>");
			var teste = new _modtmp.ArquivoView();
			var mdw = new _container.ModView("teste com amd");
			mdw.setIcon("key");
			mdw.show(true);
			mdw.append(teste); 
		}
	);	
	
	/*
	requirejs(
			['br/net/underdesk/arquivo/view/Arquivo']
			,function(_modtmp){
				//console.log(m);
				//var t = new sub.SubB(45);
				//t.doAnyThing("nova instancia!!!!");
				//$("body").append("<div>!teste</div>");
				var teste = new _modtmp.Arquivo();
				
				//var mdw = new _container.ModView("cadastro de teste!!!");
				//mdw.setIcon("key");
				//mdw.show(true);
				//mdw.append(teste); 
				
			}
		);	
	*/
});
