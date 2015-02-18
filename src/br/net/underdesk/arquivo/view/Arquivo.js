function Arquivo() {

	this.itIdArquivo = new InputText("");
	this.itIdArquivo.setLabel("cod.");	
	this.itIdArquivo.setSize(2);	
	this.itIdArquivo.setEnable(false);	
	
	this.itDsArquivo = new InputText("");
	this.itDsArquivo.setLabel("descricao");	
	this.itDsArquivo.setSize(8);	
	
	this.itTmArquivo = new NumericStepper(0);
	this.itTmArquivo.setLabel("tamanho");	
	this.itTmArquivo.setSize(2);
	this.itTmArquivo.setEnable(false);
	
	this.itSnPasta = new CheckBox("pasta?", "sim");
	this.itSnPasta.setLabel("pasta?");	
	this.itSnPasta.setUnCheckedValue("S");
	this.itSnPasta.setCheckedValue("N");
	this.itSnPasta.setSize(3);	
	this.itSnPasta.setEnable(false);
	
	this.itCaminho = new InputText("");
	this.itCaminho.setLabel("caminho");	
	this.itCaminho.setSize(9);
	this.itCaminho.setEnable(false);
	
	this.dtgMain = new DataGrid();
	
	this.tbMain = new ToolBar({"entity":"arquivo.business.ArquivoBLL","grid":"dtgMain","dbmap":[	
		{"field":"itIdArquivo","column":"idArquivo","fixed":false} , 	 
		{"field":"itTmArquivo","column":"tmArquivo","fixed":false} , 	 
		{"field":"itDsArquivo","column":"dsArquivo","fixed":false} , 	 
		{"field":"itSnPasta","column":"snPasta","fixed":false} , 	 
		{"field":"itCaminho","column":"caminho","fixed":false}	 
	]});
	
	
	this.btExplorar = new Button("Abrir");
	this.btExplorar.setIcon("folder-open");
	this.btExplorar.htmlX.click(function(){
		if(arquivo.itSnPasta.getValue()=="N"){
			_.loadOnceOnly("tabela","Tabela","js/br/net/underdesk/codigogerador/view/Tabela.js","getTabelas",[arquivo.itCaminho.getValue()]);
		}else{
			arquivo.getByCaminho(arquivo.itCaminho.getValue());
		}
	});
	this.tbMain.addButton(this.btExplorar,false);
	
	
	
	this.btBaixar = new Button("Baixar");
	this.btBaixar.setIcon("download-alt");
	this.btBaixar.htmlX.attr("target","_blank");
	this.tbMain.addButton(this.btBaixar,false);
	
	
	this.idArquivo.htmlX.find("input").change(function(){
		var toOpen = "#";
		if(this.value!=""){			
			if(arquivo.itSnPasta.getValue()=="N"){
				toOpen = arquivo.itCaminho.getValue();				
			}
		}
		this.btBaixar.htmlX.attr("href",toOpen);
	});
	
	
	this.dtgMain.setColumns([	
		{"label":"cod.","column":"idArquivo","width": 60      },						
		/*{"label":"tamanho","column":"tmArquivo","width": 60      },	*/					
		{"label":"descricao","column":"dsArquivo","width":220    },						
		{"label":"pasta","column":"snPasta","width": 60      },						
		{"label":"caminho","column":"caminho","width":220    } 						
	]);
	FormalWindow.apply(this,["Arquivo"]);	
	this._revision = "$Revision$";
	this.htmlX.addClass("Arquivo");
	this.htmlX[0]["dta"] = this;
	this.append(this.tbMain);
	this.append(this.itIdArquivo);
	this.append(this.itDsArquivo);
	this.append(this.itTmArquivo);	
	this.append(this.itSnPasta);
	this.append(this.itCaminho);
	this.append(this.dtgMain);
}

Arquivo.prototype = Object.create(FormalWindow.prototype);
Arquivo.prototype.constructor = Arquivo;

Arquivo.prototype.getByCaminho = function(p_caminho){
  rm.addRequest({
	"p":p_caminho, 
    "s":"arquivo.business.ArquivoBLL.getByPath",
    "onLoad":function(dta){
    	arquivo.dtgMain.setDataProvider(dta.rs);
    	arquivo.dtgMain.refresh();
    	arquivo.tbMain.setGridChangeEventOnce();
    }
  });
};



