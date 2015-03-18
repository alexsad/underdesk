var TabelaCampo = new Class({
	"Extends":ModWindow
	,"itIdTabelaCampo":null
	,"itCampo":null
	,"itDsCampo":null
	,"itTipo":null
	,"itLimite":null
	,"itSnNull":null
	,"itIdTabela":null
	,"itCaminho":null
	,"initialize":function(){
		this.parents("campos da tabela");
		this.setRevision("$Revision$");
		this.setSize(7);	
		
		this.itIdTabelaCampo = new InputText("");
		this.itIdTabelaCampo.setColumn("idTabelaCampo@itIdTabelaCampo");
		this.itIdTabelaCampo.setLabel("cod.");
		this.itIdTabelaCampo.setSize(2);	
		this.itIdTabelaCampo.setEnable(false);
		
		this.itCampo = new InputText("");
		this.itCampo.setColumn("campo@itCampo");
		this.itCampo.setLabel("campo");	
		this.itCampo.setSize(4);	
		
		this.itDsCampo = new InputText("");
		this.itDsCampo.setColumn("dsCampo@itDsCampo");
		this.itDsCampo.setLabel("descricao do campo");	
		this.itDsCampo.setSize(6);		
		
		this.itTipo = new Select("tipo_campo");
		this.itTipo.setColumn("tipo@itTipo");
		this.itTipo.setLabel("tipo do campo");	
		this.itTipo.setSize(5);	
		this.itTipo.setValueField("idTpCampo");
		this.itTipo.setLabelField("dsTpCampo");
		this.itTipo.setDataProvider([
                    {"idTpCampo":"int","dsTpCampo":"inteiro"}
                    ,{"idTpCampo":"varchar","dsTpCampo":"texto"}
                    ,{"idTpCampo":"date","dsTpCampo":"data"}
                    ,{"idTpCampo":"real","dsTpCampo":"flutuante"}
                    ,{"idTpCampo":"decimal","dsTpCampo":"decimal"}
                    ]);
		
		this.itLimite = new NumericStepper(1);
		this.itLimite.setColumn("limite@itLimite");
		this.itLimite.setLabel("tamanho");	
		this.itLimite.setSize(2);	
		
		this.itSnNull = new CheckBox("campo nulo?", "sim");
		this.itSnNull.setColumn("snNull@itSnNull");
		this.itSnNull.setLabel("campo nulo?");	
		this.itSnNull.setSize(5);	
		this.itSnNull.setUnCheckedValue("N");
		this.itSnNull.setCheckedValue("S");
		
		this.itIdTabela = new InputText("");
		this.itIdTabela.setColumn("idTabela@itIdTabela");
		this.itIdTabela.setLabel("cod. tabela");	
		this.itIdTabela.setSize(2);	
		this.itIdTabela.setEnable(false);
		
		this.itCaminho = new InputText("");
		this.itCaminho.setColumn("caminho@itCaminho");
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
	,"setCampos":function(p_idTabela){
		tabelacampo.itIdTabela.setValue(p_idTabela);
		tabelacampo.itCaminho.setValue(arquivo.itCaminho.getValue());
		tabelacampo.dtgMain.setDataProvider(tabela.mainList.getSelectedItem(true)["campo"]);
		tabelacampo.dtgMain.refresh();
		tabelacampo.tbMain.setGridChangeEventOnce();	   
	}
});









