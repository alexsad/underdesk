var Arquivo = new Class({
	"Extends":ModWindow
	,"initialize":function(){
		this.parent("*lista de arquivos no servidor");
		this._revision = "$Revision$";
		
		this.itIdArquivo = new InputText("e");
		this.itIdArquivo.setColumn("idArquivo@itIdArquivo");
		this.itIdArquivo.setLabel("cod.");	
		this.itIdArquivo.setSize(2);	
		this.itIdArquivo.setEnable(false);	
		
		this.itDsArquivo = new InputText("");
		this.itDsArquivo.setLabel("descricao");
		this.itDsArquivo.setColumn("dsArquivo@itDsArquivo");	
		this.itDsArquivo.setSize(8);	
		
		this.itTmArquivo = new NumericStepper(0);
		this.itTmArquivo.setColumn("tamanho@itTmArquivo");
		this.itTmArquivo.setLabel("tamanho");	
		this.itTmArquivo.setSize(2);
		this.itTmArquivo.setEnable(false);
		
		this.itSnPasta = new CheckBox("pasta?", "sim");
		this.itSnPasta.setColumn("snPasta@itSnPasta");
		this.itSnPasta.setLabel("pasta?");	
		this.itSnPasta.setUnCheckedValue("N");
		this.itSnPasta.setCheckedValue("S");
		this.itSnPasta.setSize(3);	
		this.itSnPasta.setEnable(false);
		
		this.itCaminho = new InputText("");
		this.itCaminho.setColumn("caminho@itCaminho");
		this.itCaminho.setLabel("caminho");	
		this.itCaminho.setSize(9);
		this.itCaminho.setEnable(false);
		
		this.mainList = new ListView("arquivos");		
		this.setMainList("mainList");
		
		this.tbMain = new ToolBar({"domain":"arquivo.business.ArquivoBLL"});		
		
		this.btExplorar = new Button("Abrir");
		this.btExplorar.setIcon("folder-open");
		
		this.btExplorar.getEle().addEvent('click',function(){
			if(arquivo.itSnPasta.getValue()=="N"){
				_.loadModule({"mod":"Tabela","url":"js/br/net/underdesk/codigogerador/view/Tabela.js","act":"getTabelas","p":[arquivo.itCaminho.getValue()],"icon":"indent-left","title":"*Geracao de Codigo"});
			}else{
				arquivo.getByCaminho(arquivo.itCaminho.getValue());
			}
		});
		
		this.tbMain.addButton(this.btExplorar);
		
		
		
		this.btBaixar = new Button("Baixar");
		this.btBaixar.setIcon("download-alt");
		this.btBaixar.getEle().set("target","_blank");
		this.tbMain.addButton(this.btBaixar);
		
		
		this.itIdArquivo.getInput().addEvent('change',function(){
			var toOpen = "#";
			if(this.value!=""){			
				if(arquivo.itSnPasta.getValue()=="N"){
					toOpen = "/underdesk"+arquivo.itCaminho.getValue();				
				}
			}
			arquivo.btBaixar.getEle().set("href",toOpen);
		});			
		
		this.append(this.tbMain);
		this.append(this.itIdArquivo);
		this.append(this.itDsArquivo);
		this.append(this.itTmArquivo);	
		this.append(this.itSnPasta);
		this.append(this.itCaminho);
		this.append(this.mainList);
		
	}
	,"getByCaminho":function(p_caminho){
		  console.log(p_caminho);
		  rm.addRequest({
			"p":p_caminho,
			"puid":"arquivo",
		    "s":"arquivo.business.ArquivoBLL.getByPath",
		    "onLoad":function(dta){
		    	console.log(dta.rs.length);
		    	arquivo.itCaminho.setValue(dta.rs.length);
		    	arquivo.getMainList().setDataProvider(dta.rs).refreshGridDate();		
		    	arquivo.tbMain.turnOnItemChangeEvent();
		    }
		  });
	}
});
