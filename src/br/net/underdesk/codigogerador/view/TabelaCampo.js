var TabelaCampo = new Class({
	"Extends":ModWindow
	,"initialize":function(){
		this.parents("campos da tabela");
		this._revision = "$Revision$";
		this.setSize(7);		
		
		
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
		
		
		
		
		this.itTipo = new Select("tipo_campo");
		this.itTipo.setLabel("tipo do campo");	
		this.itTipo.setSize(5);	
		this.itTipo.setValueField("idTpCampo");
		this.itTipo.setLabelField("dsTpCampo");
		
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
		
		
		this.mainList = new ListView("campos");
		this.setMainList("mainList");		
		this.tbMain = new ToolBar({"domain":"codigogerador.business.TabelaCampoBLL"});
		
		this.append(this.tbMain);
		this.append(this.itIdTabelaCampo);
		this.append(this.itCampo);	
		this.append(this.itDsCampo);
		this.append(this.itTipo);
		this.append(this.itLimite);
		this.append(this.itSnNull);
		this.append(this.itIdTabela);
		this.append(this.itCaminho);	
		this.append(this.mainList);
	}
});





{
	ServicesSingleTone.addService(
			new Service("tipo_campo","codigogerador.business.TabelaCampoBLL.getTipoCampo","idTpCampo","dsTpCampo",
					[
                    {"idTpCampo":"int","dsTpCampo":"inteiro"}
                    ,{"idTpCampo":"varchar","dsTpCampo":"texto"}
                    ,{"idTpCampo":"date","dsTpCampo":"data"}
                    ,{"idTpCampo":"real","dsTpCampo":"flutuante"}
                    ,{"idTpCampo":"decimal","dsTpCampo":"decimal"}
                    ]));
	
	
	
	

		

	

}



TabelaCampo.prototype.setCampos=function(p_idTabela){
	tabelacampo.itIdTabela.setValue(p_idTabela);
	tabelacampo.itCaminho.setValue(tabela.itcaminho.getValue());
	tabelacampo.dtgMain.setDataProvider(tabela.dtgMain.getSelectedItem(true)["campo"]);
	tabelacampo.dtgMain.refresh();
	tabelacampo.tbMain.setGridChangeEventOnce();	   
};
