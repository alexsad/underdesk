var TabelaRender = new Class({
					"Extends":Component
					,"initialize":function(p_obj){						
						var htmlTmp = '<h4>'+p_obj.dsTabela+'</h4>';								
						htmlTmp += '<p class="list-group-item-text">'+p_obj.dominio+"</p>";
						this.parent('div',htmlTmp);
						this.getEle().addClass("col-xs-6 col-sm-4 col-md-4");
					}
				});	

var Tabela = new Class({
	"Extends":ModWindow
	,"itidTabela":null
	,"itdsTabela":null
	,"itdominio":null
	,"itPacote":null
	,"itTipo":null
	,"itTpGeracao":null
	,"itChavePrimaria":null
	,"ittipoTemplate":null
	,"itrs":null
	,"btGerarCodigo":null
	,"initialize":function(){
		this.parent("*Geracao de Codigo");
		this.setRevision("$Revision$");	
		this.setSize(5);		
		
		this.itidTabela = new InputText("");
		this.itidTabela.setLabel("cod.");
		this.itidTabela.setColumn("idTabela@itidTabela");
		this.itidTabela.setSize(2);
		this.itidTabela.setEnable(false);
		
		this.itdsTabela = new InputText("");
		this.itdsTabela.setLabel("tabela");
		this.itdsTabela.setColumn("dsTabela@itdsTabela");
		this.itdsTabela.setSize(4);
		
		this.itdominio = new InputText("");
		this.itdominio.setLabel("dominio");
		this.itdominio.setColumn("dominio@itdominio");
		this.itdominio.setSize(6);	
		
		this.itPacote = new InputText("");
		this.itPacote.setLabel("pacote");	
		this.itPacote.setColumn("pacote@itPacote");
		this.itPacote.setSize(12);	

		this.itTipo = new CheckBox("view?", "sim");
		this.itTipo.setLabel("view?");	
		this.itTipo.setColumn("tipo@itTipo");
		this.itTipo.setUnCheckedValue("table");
		this.itTipo.setCheckedValue("view");
		this.itTipo.setSize(6);

		this.itTpGeracao = new Select("tipo_geracao");
		this.itTpGeracao.setLabel("tipo de geracao");	
		this.itTpGeracao.setColumn("tpGeracao@itTpGeracao");
		this.itTpGeracao.setSize(6);
		this.itTpGeracao.setValueField("idTpGeracao");
		this.itTpGeracao.setLabelField("dsTpGeracao");
		this.itTpGeracao.setDataProvider([
                    {"idTpGeracao":"increment","dsTpGeracao":"incrementavel"}
                    ,{"idTpGeracao":"unsigned","dsTpGeracao":"fornecida"}
                    ]);
		
		this.itChavePrimaria = new InputText("");
		this.itChavePrimaria.setLabel("chave primaria");
		this.itChavePrimaria.setColumn("chavePrimaria@itChavePrimaria");		
		this.itChavePrimaria.setSize(12);	
		
		this.ittipoTemplate = new Select("tipo_template");
		this.ittipoTemplate.setLabel("exportar para:");	
		this.ittipoTemplate.setSize(12);
		this.ittipoTemplate.setValueField("idTipoTemplate");
		this.ittipoTemplate.setLabelField("dsTipoTemplate");
		this.ittipoTemplate.setDataProvider([
                    {"idTipoTemplate":"JAVA","dsTipoTemplate":"arquivo java"}
                    ,{"idTipoTemplate":"DAO","dsTipoTemplate":"arquivo DAO"}
                    ,{"idTipoTemplate":"BLL","dsTipoTemplate":"arquivo BLL"}
                    ,{"idTipoTemplate":"JS","dsTipoTemplate":"arquivo java script"}
					,{"idTipoTemplate":"JSMOOLTOOLS","dsTipoTemplate":"arquivo java script mooltools"}
                    ,{"idTipoTemplate":"SQL","dsTipoTemplate":"arquivo SQL"}
                    ]);
		
		this.itrs = new TextArea("");
		this.itrs.setLabel("resultado:");
		this.itrs.setSize(12);
		this.itrs.getEle("textarea").setStyles({"background-color":"#272822","color":"#AAA55F","height":"220px"});

		this.mainList = new ListView("tabelas");
		this.mainList.setItemRender("TabelaRender");
		this.setMainList("mainList");

		this.mainTb = new ToolBar({"domain":"codigogerador.business.TabelaBLL"});
	
	
		this.btGerarCodigo = new Button("Gerar");
		this.btGerarCodigo.setIcon("check");
		this.btGerarCodigo.getEle().addEvent('click',function(){
			tabela.gerarCodigo();
		});
		this.mainTb.addButton(this.btGerarCodigo,false);

		this.append(this.mainTb);	
		this.append(this.itidTabela);
		this.append(this.itdsTabela);
		this.append(this.itdominio);
		this.append(this.itPacote);
		this.append(this.itChavePrimaria);
		this.append(this.itTipo);	
		this.append(this.itTpGeracao);
		this.append(this.ittipoTemplate);
		this.append(this.mainList);
		this.append(this.itrs);		
		this.addAssociation({"mod":"TabelaCampo","url":"js/br/net/underdesk/codigogerador/view/TabelaCampo.js","act":"getCampos","puid":this.getVarModule()});
	}
	,"getTabelas":function(urlcaminho){
		 urlcaminho = urlcaminho.substring(1,urlcaminho.length);
		  //itemmenu.setSize(12);
		  //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
		  rm.addRequest({
			"idRequest":"123456",  
			"t":"10",  
			"puid":this.getVarModule(),
			"s":"codigogerador.business.TabelaBLL.get",
			"url":urlcaminho,
			"onLoad":function(dta){
			  tabela.mainList.setDataProvider(dta.rs).refresh();
			  tabela.mainTb.turnOnItemChangeEvent();
			}
		  });  
	}
	,"gerarCodigo":function(){
		rm.addRequest({							
			 	"idTabela":tabela.itidTabela.getValue()			     
			    ,"tpTemplate":tabela.ittipoTemplate.getValue()
			    ,"caminho":arquivo.itCaminho.getValue()
			    //,"caminho":"/assets/uml/ata3_uml.json"
				,"puid":this.getVarModule()
				,"s":"codigogerador.business.TabelaBLL.gerarCodigo"
				,"onLoad":function(dta){
						tabela.itrs.setValue(dta.rs);
				}
		});	
	}
	,"beforeSave":function(p_obj){
		p_obj["caminho"] = arquivo.itCaminho.getValue();
		return p_obj;
	}
	,"beforeDelete":function(p_new_obj,p_old_obj){
		p_new_obj["caminho"] = arquivo.itCaminho.getValue();
		return p_new_obj;
	}
});