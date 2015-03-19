var TabelaCampoRender = new Class({
					"Extends":Component
					,"initialize":function(p_obj){						
						var htmlTmp = '<h4>'+p_obj.campo+'</h4>';								
						htmlTmp += '<p class="list-group-item-text">'+p_obj.dsCampo+"</p>";
						htmlTmp += '<p class="list-group-item-text">tipo:'+p_obj.tipo+"</p>";
						htmlTmp += '<p class="list-group-item-text">tamanho:'+p_obj.limite+"</p>";
						htmlTmp += '<p class="list-group-item-text">nulo:'+p_obj.snNull+"</p>";
						this.parent('div',htmlTmp);
						this.getEle().addClass("col-xs-6 col-sm-4 col-md-4");
					}
				});

var TabelaCampo = new Class({
	"Extends":ModWindow
	,"itIdTabelaCampo":null
	,"itCampo":null
	,"itDsCampo":null
	,"itTipo":null
	,"itLimite":null
	,"itSnNull":null
	,"initialize":function(){
		this.parent("campos da tabela");
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
		this.itTipo.setSize(4);	
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
		this.itLimite.setSize(3);	
		
		this.itSnNull = new CheckBox("campo nulo?", "sim");
		this.itSnNull.setColumn("snNull@itSnNull");
		this.itSnNull.setLabel("campo nulo?");	
		this.itSnNull.setSize(5);	
		this.itSnNull.setUnCheckedValue("N");
		this.itSnNull.setCheckedValue("S");
				
		this.mainList = new ListView("campos");
		this.mainList.setItemRender("TabelaCampoRender");
		this.setMainList("mainList");		
		this.mainTb = new ToolBar({"domain":"codigogerador.business.TabelaCampoBLL"});
		
		this.append(this.mainTb);
		this.append(this.itIdTabelaCampo);
		this.append(this.itCampo);	
		this.append(this.itDsCampo);
		this.append(this.itTipo);
		this.append(this.itLimite);
		this.append(this.itSnNull);			
		this.append(this.mainList);
	}
	,"beforeSave":function(p_obj){
		p_obj["caminho"] = arquivo.itCaminho.getValue();
		p_obj["idTabela"] = tabela.itidTabela.getValue();
		return p_obj;
	}
	,"beforeDelete":function(p_new_obj,p_old_obj){
		p_new_obj["caminho"] = arquivo.itCaminho.getValue();
		p_new_obj["idTabela"] = tabela.itidTabela.getValue();
		return p_new_obj;
	}
	,"getCampos":function(p_idTabela){
		tabelacampo.mainList.setDataProvider(tabela.mainList.getSelectedItem(true)["campo"]);
		tabelacampo.mainList.refresh();
		tabelacampo.mainTb.turnOnItemChangeEvent();	   
	}
});









