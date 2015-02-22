function Tabela(){
	ServicesSingleTone.addService(
			new Service("tipo_template","codigogerador.business.TabelaBLL.getTipoTemplate","idTipoTemplate","dsTipoTemplate",
					[
                    {"idTipoTemplate":"JAVA","dsTipoTemplate":"arquivo java"}
                    ,{"idTipoTemplate":"DAO","dsTipoTemplate":"arquivo DAO"}
                    ,{"idTipoTemplate":"BLL","dsTipoTemplate":"arquivo BLL"}
                    ,{"idTipoTemplate":"JS","dsTipoTemplate":"arquivo java script"}
                    ,{"idTipoTemplate":"SQL","dsTipoTemplate":"arquivo SQL"}
                    ]));
	ServicesSingleTone.addService(
			new Service("tipo_geracao","codigogerador.business.TabelaBLL.getTipoTemplate","idTpGeracao","dsTpGeracao",
					[
                    {"idTpGeracao":"increment","dsTpGeracao":"incrementavel"}
                    ,{"idTpGeracao":"unsigned","dsTpGeracao":"fornecida"}
                    ]));	
	
	this.itidTabela = new InputText("");
	this.itidTabela.setLabel("cod.");
	this.itidTabela.setSize(2);
	this.itidTabela.setEnable(false);
	
	this.itdsTabela = new InputText("");
	this.itdsTabela.setLabel("tabela");
	this.itdsTabela.setSize(4);
	
	this.itdominio = new InputText("");
	this.itdominio.setLabel("dominio");
	this.itdominio.setSize(6);	
	
	this.itPacote = new InputText("");
	this.itPacote.setLabel("pacote");	
	this.itPacote.setSize(12);	

	this.itTipo = new CheckBox("view?", "sim");
	this.itTipo.setLabel("tipo da tabela");	
	this.itTipo.setUnCheckedValue("table");
	this.itTipo.setCheckedValue("view");
	this.itTipo.setSize(6);

	this.itTpGeracao = new DataFind("tipo_geracao");
	this.itTpGeracao.setLabel("tipo de geracao");	
	this.itTpGeracao.setSize(6);
	
	this.itChavePrimaria = new InputText("");
	this.itChavePrimaria.setLabel("chave primaria");	
	this.itChavePrimaria.setSize(12);	
	
	this.itcaminho = new InputText("");
	this.itcaminho.setLabel("caminho");
	this.itcaminho.setSize(12);
	this.itcaminho.setEnable(false);
	
	this.ittipoTemplate = new DataFind("tipo_template");
	this.ittipoTemplate.setLabel("exportar para:");	
	this.ittipoTemplate.setSize(12);
	
	this.itrs = new TextArea("");
	this.itrs.setLabel("resultado:");	
	this.itrs.setSize(12);
	this.itrs.htmlX.find("textarea").css({"backgroundColor":"#272822","color":"#AAA55F","height":"220px"});
	
	this.dtgMain = new DataGrid();
	this.tbMain = new ToolBar({"entity":"codigogerador.business.TabelaBLL","reload":"","grid":"dtgMain","dbmap":[	
	{"field":"itidTabela","column":"idTabela" }, 
	{"field":"itdsTabela","column":"dsTabela" }, 
	{"field":"itdominio","column":"dominio" },
	{"field":"itPacote","column":"pacote" },	 
	{"field":"itTipo","column":"tipo" },	 
	{"field":"itChavePrimaria","column":"chavePrimaria" },	 
	{"field":"itTpGeracao","column":"tpGeracao" },
	{"field":"itcaminho","column":"caminho","fixed":true}	
	]});
	
	this.tbMain.addAssociation({"mod":"TabelaCampo","url":"js/br/net/underdesk/codigogerador/view/TabelaCampo.js","act":"setCampos","puid":"tabela"});
	
	this.btGerarCodigo = new Button("Gerar");
	this.btGerarCodigo.setIcon("check");
	this.btGerarCodigo.htmlX.click(function(){
		tabela.gerarCodigo();
	});
	this.tbMain.addButton(this.btGerarCodigo,false);
	
	this.dtgMain.setColumns([
	             	        {                 
	                            "label" : "cod",
	                      		"column" : "idTabela",
	                      		"width" : 50
	                      	}, {
	                      		"label" : "tabela",
	                      		"column" : "dsTabela",
	                      		"width" : 150
	                      	}
	             	]);
	
	
	FormalWindow.apply(this,["Tabelas","*Geracao de Codigo"]);
	this._revision = "$Revision$";	
	this.htmlX.addClass("Tabela");
	this.htmlX[0]["dta"] = this;
	this.setIcon("indent-left");
	this.setSize(5);
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
	this.append(this.dtgMain);
	this.append(this.itrs);
}

Tabela.prototype = Object.create(FormalWindow.prototype);
Tabela.prototype.constructor = Tabela;

Tabela.prototype.getTabelas=function(urlcaminho){
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
      tabela.dtgMain.setDataProvider(dta.rs);
      tabela.dtgMain.refresh();
      tabela.tbMain.setGridChangeEventOnce();
    }
  });  
};
Tabela.prototype.gerarCodigo=function(){
	  rm.addRequest({
		"p":[tabela.itcaminho.getValue(),tabela.ittipoTemplate.getValue(),tabela.itidTabela.getValue()], 
	    "s":"codigogerador.business.TabelaBLL.gerarCodigo",
	    "onLoad":function(dta){
	    	tabela.itrs.setValue(dta.rs);
	    }
	  });	
};
