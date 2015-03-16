var Tabela = new Class({
	"Extends":ModWindow
	,"itidTabela":null
	,"itdsTabela":null
	,"itdominio":null
	,"itPacote":null
	,"itTipo":null
	,"itTpGeracao":null
	,"itChavePrimaria":null
	,"itcaminho":null
	,"ittipoTemplate":null
	,"itrs":null
	,"btGerarCodigo":null
	,"initialize":function(){
		this.parent("*Geracao de Codigo");
		this._revision = "$Revision$";	
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
		this.itTipo.setLabel("tipo da tabela");	
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
		
		this.itcaminho = new InputText("");
		this.itcaminho.setLabel("caminho");
		this.itcaminho.setColumn("caminho@itcaminho");
		this.itcaminho.setSize(12);
		this.itcaminho.setEnable(false);
		
		this.ittipoTemplate = new Select("tipo_template");
		this.ittipoTemplate.setLabel("exportar para:");	
		this.ittipoTemplate.setSize(12);
		this.ittipoTemplate.setValueField("idTpGeracao");
		this.ittipoTemplate.setLabelField("dsTpGeracao");
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
		this.setMainList("mainList");

		this.tbMain = new ToolBar({"domain":"codigogerador.business.TabelaBLL"});
	
	
		this.btGerarCodigo = new Button("Gerar");
		this.btGerarCodigo.setIcon("check");
		this.btGerarCodigo.getEle().addEvent('click',function(){
			tabela.gerarCodigo();
		});
		this.tbMain.addButton(this.btGerarCodigo,false);

		this.append(this.tbMain);	
		this.append(this.itidTabela);
		this.append(this.itdsTabela);
		this.append(this.itdominio);
		this.append(this.itPacote);
		this.append(this.itChavePrimaria);
		this.append(this.itTipo);	
		this.append(this.itTpGeracao);
		this.append(this.itcaminho);
		this.append(this.ittipoTemplate);
		this.append(this.mainList);
		this.append(this.itrs);		
		//this.tbMain.addAssociation({"mod":"TabelaCampo","url":"js/br/net/underdesk/codigogerador/view/TabelaCampo.js","act":"setCampos","puid":"tabela"});
	}
	,"getTabelas":function(urlcaminho){
		 urlcaminho = urlcaminho.substring(1,urlcaminho.length);
		  //itemmenu.setSize(12);
		  tabela.itcaminho.setValue(urlcaminho);
		  //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
		  rm.addRequest({
			"idRequest":"123456",  
			"t":"10",  
			"s":"codigogerador.business.TabelaBLL.get",
			"url":urlcaminho,
			"onLoad":function(dta){
			  tabela.lisMain.setDataProvider(dta.rs).refreshItens();
			  tabela.tbMain.turnOnItemChangeEvent();
			}
		  });  
	}
	,"gerarCodigo":function(){
		rm.addRequest({
				"p":[tabela.itcaminho.getValue(),tabela.ittipoTemplate.getValue(),tabela.itidTabela.getValue()], 
				"s":"codigogerador.business.TabelaBLL.gerarCodigo",
				"onLoad":function(dta){
						tabela.itrs.setValue(dta.rs);
				}
		});	
	}
});