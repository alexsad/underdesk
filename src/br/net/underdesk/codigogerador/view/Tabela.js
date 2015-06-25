var TabelaRender = new Class({
					"Extends":js.underas.controller.ListViewItemRender
					,"initialize":function(p_obj){						
						var htmlTmp = '<h4>'+p_obj.dsTabela+'</h4>';								
						htmlTmp += '<p class="list-group-item-text">'+p_obj.dominio+"</p>";
						this.parent('div',htmlTmp);
						this.getEle().addClass("col-xs-12 col-sm-12 col-md-12");
					}
				});	

var Tabela = new Class({
	"Extends":js.underas.container.ModWindow
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
		
		this.itidTabela = new js.underas.controller.InputText("");
		this.itidTabela.setLabel("cod.");
		this.itidTabela.setColumn("$idTabela");
		this.itidTabela.setSize(2);
		this.itidTabela.setEnable(false);
		
		this.itdsTabela = new js.underas.controller.InputText("");
		this.itdsTabela.setLabel("tabela");
		this.itdsTabela.setColumn("@dsTabela");
		this.itdsTabela.setSize(4);
		
		this.itdominio = new js.underas.controller.InputText("");
		this.itdominio.setLabel("dominio");
		this.itdominio.setColumn("@dominio");
		this.itdominio.setSize(6);	
		
		this.itPacote = new js.underas.controller.InputText("");
		this.itPacote.setLabel("pacote");	
		this.itPacote.setColumn("@pacote");
		this.itPacote.setSize(12);	

		this.itTipo = new js.underas.controller.CheckBox("view?", "sim");
		this.itTipo.setLabel("view?");	
		this.itTipo.setColumn("@tipo");
		this.itTipo.setUnCheckedValue("table");
		this.itTipo.setCheckedValue("view");
		this.itTipo.setSize(6);

		this.itTpGeracao = new js.underas.controller.Select("tipo_geracao");
		this.itTpGeracao.setLabel("tipo de geracao");	
		this.itTpGeracao.setColumn("@tpGeracao");
		this.itTpGeracao.setSize(6);
		this.itTpGeracao.setValueField("idTpGeracao");
		this.itTpGeracao.setLabelField("dsTpGeracao");
		
		this.itChavePrimaria = new js.underas.controller.InputText("");
		this.itChavePrimaria.setLabel("chave primaria");
		this.itChavePrimaria.setColumn("@chavePrimaria");		
		this.itChavePrimaria.setSize(12);	
		
		this.ittipoTemplate = new js.underas.controller.Select("tipo_template");
		this.ittipoTemplate.setLabel("exportar para:");	
		this.ittipoTemplate.setSize(12);
		this.ittipoTemplate.setValueField("idTipoTemplate");
		this.ittipoTemplate.setLabelField("dsTipoTemplate");

		
		this.itrs = new js.underas.controller.TextArea("");
		this.itrs.setLabel("resultado:");
		this.itrs.setSize(12);
		this.itrs.getEle("textarea").setStyles({"background-color":"#272822","color":"#AAA55F","height":"220px"});

		this.mainList = new js.underas.controller.ListView("tabelas");
		this.mainList.setItemRender("TabelaRender");
		this.setMainList("mainList");

		this.mainTb = new js.underas.net.ToolBar({"domain":"ws/codigogerador/tabela"});
	
	
		this.btGerarCodigo = new js.underas.controller.Button("Gerar");
		this.btGerarCodigo.setIcon("check");
		this.btGerarCodigo.addEvent('click',function(){
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
		this.addAssociation({"mod":"br.net.underdesk.codigogerador.view.TabelaCampo","act":"getCampos","puid":this.getVarModule()});
	}
	,"onStart":function(){
		this.mainTb.activate(true);
		
		this.ittipoTemplate.setDataProvider([
		                                     {"idTipoTemplate":"JAVA","dsTipoTemplate":"arquivo java"}
		                                     ,{"idTipoTemplate":"DAO","dsTipoTemplate":"arquivo DAO"}
		                                     ,{"idTipoTemplate":"BLL","dsTipoTemplate":"arquivo BLL"}
		                                     ,{"idTipoTemplate":"JS","dsTipoTemplate":"arquivo java script"}
		                 					 ,{"idTipoTemplate":"JSMOOLTOOLS","dsTipoTemplate":"arquivo java script mooltools"}
		                                     ,{"idTipoTemplate":"SQL","dsTipoTemplate":"arquivo SQL"}
		                                     ,{"idTipoTemplate":"NODE_SCHEMA","dsTipoTemplate":"arquivo de schema NODE"}
		                 					 ,{"idTipoTemplate":"NODE_BLL","dsTipoTemplate":"arquivo de controller NODE"}
		                                     ,{"idTipoTemplate":"NODE_ROUTES","dsTipoTemplate":"arquivo de rota NODE"}
		                                     ]);
		
		this.itTpGeracao.setDataProvider([
		                                  {"idTpGeracao":"increment","dsTpGeracao":"incrementavel"}
		                                  ,{"idTpGeracao":"unsigned","dsTpGeracao":"fornecida"}
		                                  ]);
		
	}
	,"getTabelas":function(urlcaminho){
		 urlcaminho = urlcaminho.substring(1,urlcaminho.length);
		  //itemmenu.setSize(12);
		  //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
		 js.underas.net.RequestManager.addRequest({ 
			"puid":this.getVarModule(),
			"url":urlcaminho,
			"onLoad":function(dta){
			  this.getMainList().setDataProvider(dta);
			}.bind(this)
		  });  
	}
	,"beforeQuery":function(p_obj_req){
		 var urlcaminho = arquivo.itCaminho.getValue().substring(1,arquivo.itCaminho.getValue().length);
		 p_obj_req["url"]=urlcaminho; 
		 return p_obj_req;
	}
	,"gerarCodigo":function(){
		js.underas.net.RequestManager.addRequest({							
			 	"idTabela":tabela.itidTabela.getValue()			     
			    ,"tpTemplate":tabela.ittipoTemplate.getValue()
			    ,"caminho":arquivo.itCaminho.getValue()
			    //,"caminho":"/assets/uml/ata3_uml.json"
				,"puid":this.getVarModule()
				,"method":"post"
				,"url":"ws/codigogerador/tabela/gerarcodigo"
				,"onLoad":function(dta){
						this.itrs.setValue(dta);
				}.bind(this)
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