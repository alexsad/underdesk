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
		
		/*
		this.ittipoTemplate = new js.underas.controller.Select("tipo_template");
		this.ittipoTemplate.setLabel("exportar para:");	
		this.ittipoTemplate.setSize(12);
		this.ittipoTemplate.setValueField("idTipoTemplate");
		this.ittipoTemplate.setLabelField("dsTipoTemplate");
		*/
		
		this.itSnModelJava = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnModelJava.setEnable(true);
		this.itSnModelJava.setSize(4);
		this.itSnModelJava.setLabel("Model java:");
		this.itSnModelJava.setCheckedValue("JAVA@java");
		this.itSnModelJava.setUnCheckedValue("");		
		this.append(this.itSnModelJava);
		
		this.itSnDaoJava = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnDaoJava.setEnable(true);
		this.itSnDaoJava.setSize(4);
		this.itSnDaoJava.setLabel("DAO java:");
		this.itSnDaoJava.setCheckedValue("DAO@java");
		this.itSnDaoJava.setUnCheckedValue("");		
		this.append(this.itSnDaoJava);
		
		this.itSnBLLJava = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnBLLJava.setEnable(true);
		this.itSnBLLJava.setSize(4);
		this.itSnBLLJava.setLabel("BLL java:");
		this.itSnBLLJava.setCheckedValue("BLL@java");
		this.itSnBLLJava.setUnCheckedValue("");		
		this.append(this.itSnBLLJava);
		
		this.itSnJsMoolTools = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnJsMoolTools.setEnable(true);
		this.itSnJsMoolTools.setSize(12);
		this.itSnJsMoolTools.setLabel("Visual javascript com mootools:");
		this.itSnJsMoolTools.setCheckedValue("JSMOOLTOOLS@js");
		this.itSnJsMoolTools.setUnCheckedValue("");		
		this.append(this.itSnJsMoolTools);
		
		this.itSnNodeSchemaJs = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnNodeSchemaJs.setEnable(true);
		this.itSnNodeSchemaJs.setSize(4);
		this.itSnNodeSchemaJs.setLabel("Schema NODEJS:");
		this.itSnNodeSchemaJs.setCheckedValue("NODE_SCHEMA@js");
		this.itSnNodeSchemaJs.setUnCheckedValue("");		
		this.append(this.itSnNodeSchemaJs);
		
		this.itSnNodeBLLJs = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnNodeBLLJs.setEnable(true);
		this.itSnNodeBLLJs.setSize(4);
		this.itSnNodeBLLJs.setLabel("BLL NODEJS:");
		this.itSnNodeBLLJs.setCheckedValue("NODE_BLL@js");
		this.itSnNodeBLLJs.setUnCheckedValue("");		
		this.append(this.itSnNodeBLLJs);
		
		this.itSnNodeRouteJs = new js.underas.controller.CheckBox("Valido?", "Sim");
		this.itSnNodeRouteJs.setEnable(true);
		this.itSnNodeRouteJs.setSize(4);
		this.itSnNodeRouteJs.setLabel("Route NODEJS:");
		this.itSnNodeRouteJs.setCheckedValue("NODE_ROUTES@js");
		this.itSnNodeRouteJs.setUnCheckedValue("");		
		this.append(this.itSnNodeRouteJs);

		/*
		this.itrs = new js.underas.controller.TextArea("");
		this.itrs.setLabel("resultado:");
		this.itrs.setSize(12);
		this.itrs.getEle("textarea").setStyles({"background-color":"#272822","color":"#AAA55F","height":"220px"});
		 */
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
		//this.append(this.ittipoTemplate);
		this.append(this.mainList);	
		this.addAssociation({"mod":"br.net.underdesk.codigogerador.view.TabelaCampo","act":"getCampos","puid":this.getVarModule()});
	}
	,"onStart":function(){
		this.mainTb.activate(true);
		

		
		/*
		this.ittipoTemplate.setDataProvider([
		                                     {"idTipoTemplate":"JAVA@java","dsTipoTemplate":"arquivo java"}
		                                     ,{"idTipoTemplate":"DAO@java","dsTipoTemplate":"arquivo DAO"}
		                                     ,{"idTipoTemplate":"BLL@java","dsTipoTemplate":"arquivo BLL"}
		                                     //,{"idTipoTemplate":"JS@js","dsTipoTemplate":"arquivo java script"}
		                 					 ,{"idTipoTemplate":"JSMOOLTOOLS@js","dsTipoTemplate":"arquivo java script mooltools"}
		                                     //,{"idTipoTemplate":"SQL@sql","dsTipoTemplate":"arquivo SQL"}
		                                     ,{"idTipoTemplate":"NODE_SCHEMA@js","dsTipoTemplate":"arquivo de schema NODE"}
		                 					 ,{"idTipoTemplate":"NODE_BLL@js","dsTipoTemplate":"arquivo de controller NODE"}
		                                     ,{"idTipoTemplate":"NODE_ROUTES@js","dsTipoTemplate":"arquivo de rota NODE"}
		                                     ]);
		*/
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
	,"gerarCodigoSingle":function(){
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
	,"gerarCodigo":function(){
		
		
		var selecteds = [];
		
		if(this.itSnModelJava.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnModelJava.getValue();
		};
		if(this.itSnDaoJava.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnDaoJava.getValue();
		};
		if(this.itSnBLLJava.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnBLLJava.getValue();
		};
		if(this.itSnJsMoolTools.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnJsMoolTools.getValue();
		};
		if(this.itSnNodeSchemaJs.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnNodeSchemaJs.getValue();
		};
		if(this.itSnNodeBLLJs.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnNodeBLLJs.getValue();
		};
		if(this.itSnNodeRouteJs.getValue()!=""){
			var tms = selecteds.length;
			selecteds[tms] = this.itSnNodeRouteJs.getValue();
		};
		
		var itensList = this.getMainList().getDataProvider();
		
		var tmLst = itensList.size();
		
		for(var x =0;x<tmLst;x++){
			itensList.get(x)["exportsto"] = selecteds;
		}
		/*
		var tabSelection = Object.merge({			 	
			"idTabela":tabela.itidTabela.getValue()			     
		    ,"tpTemplate":tabela.ittipoTemplate.getValue()
		    ,"caminho":arquivo.itCaminho.getValue()
		    ,"exportsto":[tabela.ittipoTemplate.getValue()]
			},this.getMainList().getSelectedItem());
		
		var tabSelection2 = Object.merge({			 	
			"idTabela":tabela.itidTabela.getValue()			     
		    ,"tpTemplate":tabela.ittipoTemplate.getValue()
		    ,"caminho":arquivo.itCaminho.getValue()
		    ,"exportsto":[tabela.ittipoTemplate.getValue(),"JSMOOLTOOLS@js","NODE_BLL@js"]
			},this.getMainList().getSelectedItem());
		*/
		js.underas.net.RequestManager.addRequest({	
				"data":itensList.getAll()
				,"puid":this.getVarModule()
				,"method":"post"
				,"url":"ws/codigogerador/tabela/gerarcodigo"
				,"onLoad":function(dta){
						//this.itrs.setValue(dta);
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