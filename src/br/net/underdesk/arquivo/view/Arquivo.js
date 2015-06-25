var ArquivoRender = new Class({
					"Extends":js.underas.controller.ListViewItemRender
					,"initialize":function(p_obj){
						var iconC = "folder-close";
						if(p_obj.snPasta=="N"){
							iconC = "file";
						}						
						var htmlTmp = '<h4><span class="glyphicon glyphicon-'+iconC+'"></span>&nbsp;'+p_obj.dsArquivo+'</h4>';								
						//htmlTmp += '<p class="list-group-item-text">'+p_obj.caminho+"</p>";
						this.parent('div',htmlTmp);
						this.getEle().addClass("col-xs-12 col-sm-4 col-md-3");
					}
				});	

var Arquivo = new Class({
	"Extends":js.underas.container.ModWindow
	,"initialize":function(){
		this.parent("*lista de arquivos no servidor");
		this.setRevision("$Revision$");
		
		this.itIdArquivo = new js.underas.controller.InputText("");
		this.itIdArquivo.setColumn("$idArquivo");
		this.itIdArquivo.setLabel("cod.");	
		this.itIdArquivo.setSize(2);	
		this.itIdArquivo.setEnable(false);	
		
		this.itDsArquivo = new js.underas.controller.InputText("");
		this.itDsArquivo.setLabel("descricao");
		this.itDsArquivo.setColumn("@dsArquivo");	
		this.itDsArquivo.setSize(8);
		this.itDsArquivo.setEnable(false);	
		
		this.itTmArquivo = new js.underas.controller.NumericStepper(0);
		this.itTmArquivo.setColumn("@tmArquivo");
		this.itTmArquivo.setLabel("tamanho");	
		this.itTmArquivo.setSize(2);
		this.itTmArquivo.setEnable(false);
		
		this.itSnPasta = new js.underas.controller.CheckBox("pasta?", "sim");
		this.itSnPasta.setColumn("@snPasta");
		this.itSnPasta.setLabel("pasta?");	
		this.itSnPasta.setUnCheckedValue("N");
		this.itSnPasta.setCheckedValue("S");
		this.itSnPasta.setSize(3);	
		this.itSnPasta.setEnable(false);
		
		this.itCaminho = new js.underas.controller.InputText("/");
		this.itCaminho.setColumn("@caminho");
		this.itCaminho.setLabel("caminho");	
		this.itCaminho.setSize(9);
		this.itCaminho.setEnable(false);
		
		this.mainList = new js.underas.controller.ListView("arquivos");		
		this.setMainList("mainList");
		this.mainList.setItemRender("ArquivoRender");
		
		this.mainTb = new js.underas.net.ToolBar({"domain":"ws/arquivo/arquivo"});		
		
		this.btExplorar = new js.underas.controller.Button("Abrir");
		this.btExplorar.setIcon("folder-open");
		
		this.btExplorar.addEvent('click',function(){
			if(arquivo.itSnPasta.getValue()=="N"){
				js.underas.core.Underas.loadModule({"mod":"br.net.underdesk.codigogerador.view.Tabela","act":"getTabelas","p":[arquivo.itCaminho.getValue()],"icon":"indent-left","title":"*Geracao de Codigo"});
			}else{
				arquivo.getByCaminho(arquivo.itCaminho.getValue());
			}
		});
		
		this.mainTb.addButton(this.btExplorar);
		
		
		
		this.btBaixar = new js.underas.controller.Button("Baixar");
		this.btBaixar.setIcon("download-alt");
		this.btBaixar.getEle().set("target","_blank");
		this.mainTb.addButton(this.btBaixar);		
		
		this.append(this.mainTb);
		this.append(this.itIdArquivo);
		this.append(this.itDsArquivo);
		this.append(this.itTmArquivo);	
		this.append(this.itSnPasta);
		this.append(this.itCaminho);
		this.append(this.mainList);
		
	}
	,"onStart":function(){
		this.mainTb.activate(true);
	}
	,"onChangeItem":function(p_obj){
		var toOpen = "#";		
		if(p_obj.snPasta=="N"){
			toOpen = "/underdesk"+arquivo.itCaminho.getValue();				
		}
		this.btBaixar.getEle().set("href",toOpen);
		return p_obj;
	}
	,"getByCaminho":function(p_caminho){		
			this.itCaminho.setValue(p_caminho);	
			js.underas.net.RequestManager.addRequest({
				"urlpath":p_caminho,
				"puid":this.getVarModule(),
				"url":"ws/arquivo/arquivo/getbypath",
				"onLoad":function(dta){
				    	this.getMainList().setDataProvider(dta);
				    }.bind(this)
			  });
	}
	,"beforeQuery":function(p_req_obj){
		p_req_obj["p"]=this.itCaminho.getValue();
		p_req_obj["s"]="arquivo.business.ArquivoBLL.getByPath";
		return p_req_obj;
	}
});
