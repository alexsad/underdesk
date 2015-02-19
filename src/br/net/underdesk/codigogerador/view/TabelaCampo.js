function TabelaCampo() {
	ServicesSingleTone.addService(
			new Service("tipo_campo","codigogerador.business.TabelaCampoBLL.getTipoCampo","idTpCampo","dsTpCampo",
					[
                    {"idTpCampo":"int","dsTpCampo":"inteiro"}
                    ,{"idTpCampo":"varchar","dsTpCampo":"texto"}
                    ,{"idTpCampo":"date","dsTpCampo":"data"}
                    ,{"idTpCampo":"real","dsTpCampo":"flutuante"}
                    ,{"idTpCampo":"decimal","dsTpCampo":"decimal"}
                    ]));
	
	
	this.itIdTabelaCampo = new InputText("");
	this.itIdTabelaCampo.setLabel("cod.");	
	this.itIdTabelaCampo.setSize(2);	
	this.itIdTabelaCampo.setEnable(false);
	

	
	this.itCampo = new InputText("");
	this.itCampo.setLabel("campo");	
	this.itCampo.setSize(4);	
	
	this.itDsCampo = new InputText("");
	this.itDsCampo.setLabel("descricao do campo");	
	this.itDsCampo.setSize(6);
	
	this.itTipo = new DataFind("tipo_campo");
	this.itTipo.setLabel("tipo do campo");	
	this.itTipo.setSize(5);	
	
	this.itLimite = new NumericStepper(1);
	this.itLimite.setLabel("tamanho");	
	this.itLimite.setSize(2);	
	
	this.itSnNull = new CheckBox("campo nulo?", "sim");
	this.itSnNull.setLabel("campo nulo?");	
	this.itSnNull.setSize(5);	
	this.itSnNull.setUnCheckedValue("N");
	this.itSnNull.setCheckedValue("S");
	
	this.itIdTabela = new InputText("");
	this.itIdTabela.setLabel("cod. tabela");	
	this.itIdTabela.setSize(2);	
	this.itIdTabela.setEnable(false);
	
	this.itCaminho = new InputText("");
	this.itCaminho.setLabel("caminho");	
	this.itCaminho.setSize(10);	
	this.itCaminho.setEnable(false);
	
	this.dtgMain = new DataGrid();
	this.tbMain = new ToolBar({"entity":"codigogerador.business.TabelaCampoBLL","grid":"dtgMain","dbmap":[	
		{"field":"itIdTabelaCampo","column":"idTabelaCampo","fixed":false} , 	 
		{"field":"itCampo","column":"campo","fixed":false} , 	 
		{"field":"itTipo","column":"tipo","fixed":false} , 	 
		{"field":"itDsCampo","column":"dsCampo","fixed":false} , 	 
		{"field":"itLimite","column":"limite","fixed":false} , 	 
		{"field":"itSnNull","column":"snNull","fixed":false},
		{"field":"itIdTabela","column":"idTabela","fixed":true},
		{"field":"itCaminho","column":"caminho","fixed":true}
	]});
		
	this.dtgMain.setColumns([	
		{"label":"cod.","column":"idTabelaCampo","width": 60},						
		{"label":"campo","column":"campo","width":120},
		{"label":"tipo","column":"tipo","width": 60}						
	]);
	FormalWindow.apply(this,["campos","campos da tabela"]);	
	this._revision = "$Revision$";
	this.htmlX.addClass("TabelaCampo");
	this.htmlX[0]["dta"] = this;
	this.setSize(7);
	this.append(this.tbMain);
	this.append(this.itIdTabelaCampo);
	this.append(this.itCampo);	
	this.append(this.itDsCampo);
	this.append(this.itTipo);
	this.append(this.itLimite);
	this.append(this.itSnNull);
	this.append(this.itIdTabela);
	this.append(this.itCaminho);	
	this.append(this.dtgMain);
}

TabelaCampo.prototype = Object.create(FormalWindow.prototype);
TabelaCampo.prototype.constructor = TabelaCampo;

TabelaCampo.prototype.setCampos=function(){
	tabelacampo.itIdTabela.setValue(tabela.itidTabela.getValue());
	tabelacampo.itCaminho.setValue(tabela.itcaminho.getValue());
	tabelacampo.dtgMain.setDataProvider(tabela.dtgMain.getSelectedItem(true)["campo"]);
	tabelacampo.dtgMain.refresh();
	tabelacampo.tbMain.setGridChangeEventOnce();	   
};
