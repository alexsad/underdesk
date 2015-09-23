import {ModWindow} from "../../../../../lib/container";
import {InputText,Select,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {ArrayList} from "../../../../../lib/util";
//import {Tabela} from "../../codigogerador/view/Tabela";
import {IArquivo} from "./IArquivo";
import {SimpleToolBar,RequestManager,IDefaultRequest} from "../../../../../lib/net";

@ItemView({url:"js/br/net/underdesk/codigogerador/view/assets/html/tabela.html",list:"mainList"})
export class Tabela extends ModWindow{   
    itidTabela:InputText;
    itdsTabela:InputText;
    itdominio:InputText;
    itPacote:InputText;
    itTipo:CheckBox;
    itTpGeracao:Select;
    itChavePrimaria:InputText;
    //itrs:null;
    btGerarCodigo:Button;
    mainList:ListView;
    mainTb:SimpleToolBar;
    constructor(){
        super("*Geracao de Codigo","br.net.underdesk.codigogerador.view.Tabela");
        this.setRevision("$Revision$"); 
        this.setSize(5);        
        
        this.mainTb = new ToolBar({"domain":"ws/codigogerador/tabela"});    
        this.append(this.mainTb); 
        
        this.itidTabela = new InputText("");
        this.itidTabela.setLabel("cod.");
        this.itidTabela.setColumn("$idTabela");
        this.itidTabela.setSize(2);
        this.itidTabela.setEnable(false);
        this.append(this.itidTabela);
        
        this.itdsTabela = new InputText("");
        this.itdsTabela.setLabel("tabela");
        this.itdsTabela.setColumn("@dsTabela");
        this.itdsTabela.setSize(4);
        this.append(this.itdsTabela);
        
        this.itdominio = new InputText("");
        this.itdominio.setLabel("dominio");
        this.itdominio.setColumn("@dominio");
        this.itdominio.setSize(6); 
        this.append(this.itdominio); 
        
        this.itPacote = new InputText("");
        this.itPacote.setLabel("pacote");   
        this.itPacote.setColumn("@pacote");
        this.itPacote.setSize(12); 
        this.append(this.itPacote); 

        this.itTipo = new CheckBox("view?", "sim");
        this.itTipo.setLabel("view?");  
        this.itTipo.setColumn("@tipo");
        this.itTipo.setUnCheckedValue("table");
        this.itTipo.setCheckedValue("view");
        this.itTipo.setSize(6);
        this.append(this.itTipo);

        this.itTpGeracao = new Select("tipo_geracao");
        this.itTpGeracao.setLabel("tipo de geracao");   
        this.itTpGeracao.setColumn("@tpGeracao");
        this.itTpGeracao.setSize(6);
        this.itTpGeracao.setValueField("idTpGeracao");
        this.itTpGeracao.setLabelField("dsTpGeracao");
        this.append(this.itTpGeracao);
        
        this.itChavePrimaria = new InputText("");
        this.itChavePrimaria.setLabel("chave primaria");
        this.itChavePrimaria.setColumn("@chavePrimaria");       
        this.itChavePrimaria.setSize(12);   
        this.append(this.itChavePrimaria);
        
        this.itSnModelJava = new CheckBox("Valido?", "Sim");
        this.itSnModelJava.setEnable(true);
        this.itSnModelJava.setSize(4);
        this.itSnModelJava.setLabel("Model java:");
        this.itSnModelJava.setCheckedValue("JAVA@java");
        this.itSnModelJava.setUnCheckedValue("");       
        this.append(this.itSnModelJava);
        
        this.itSnDaoJava = new CheckBox("Valido?", "Sim");
        this.itSnDaoJava.setEnable(true);
        this.itSnDaoJava.setSize(4);
        this.itSnDaoJava.setLabel("DAO java:");
        this.itSnDaoJava.setCheckedValue("DAO@java");
        this.itSnDaoJava.setUnCheckedValue("");     
        this.append(this.itSnDaoJava);
        
        this.itSnBLLJava = new CheckBox("Valido?", "Sim");
        this.itSnBLLJava.setEnable(true);
        this.itSnBLLJava.setSize(4);
        this.itSnBLLJava.setLabel("BLL java:");
        this.itSnBLLJava.setCheckedValue("BLL@java");
        this.itSnBLLJava.setUnCheckedValue("");     
        this.append(this.itSnBLLJava);
        
        this.itSnJsMoolTools = new CheckBox("Valido?", "Sim");
        this.itSnJsMoolTools.setEnable(true);
        this.itSnJsMoolTools.setSize(12);
        this.itSnJsMoolTools.setLabel("Visual javascript com mootools:");
        this.itSnJsMoolTools.setCheckedValue("JSMOOLTOOLS@js");
        this.itSnJsMoolTools.setUnCheckedValue("");     
        this.append(this.itSnJsMoolTools);
        
        this.itSnNodeSchemaJs = new CheckBox("Valido?", "Sim");
        this.itSnNodeSchemaJs.setEnable(true);
        this.itSnNodeSchemaJs.setSize(4);
        this.itSnNodeSchemaJs.setLabel("Schema NODEJS:");
        this.itSnNodeSchemaJs.setCheckedValue("NODE_SCHEMA@js");
        this.itSnNodeSchemaJs.setUnCheckedValue("");        
        this.append(this.itSnNodeSchemaJs);
        
        this.itSnNodeBLLJs = new CheckBox("Valido?", "Sim");
        this.itSnNodeBLLJs.setEnable(true);
        this.itSnNodeBLLJs.setSize(4);
        this.itSnNodeBLLJs.setLabel("BLL NODEJS:");
        this.itSnNodeBLLJs.setCheckedValue("NODE_BLL@js");
        this.itSnNodeBLLJs.setUnCheckedValue("");       
        this.append(this.itSnNodeBLLJs);
        
        this.itSnNodeRouteJs = new CheckBox("Valido?", "Sim");
        this.itSnNodeRouteJs.setEnable(true);
        this.itSnNodeRouteJs.setSize(4);
        this.itSnNodeRouteJs.setLabel("Route NODEJS:");
        this.itSnNodeRouteJs.setCheckedValue("NODE_ROUTES@js");
        this.itSnNodeRouteJs.setUnCheckedValue("");     
        this.append(this.itSnNodeRouteJs);

        /*
        this.itrs = new TextArea("");
        this.itrs.setLabel("resultado:");
        this.itrs.setSize(12);
        this.itrs.getEle("textarea").setStyles({"background-color":"#272822","color":"#AAA55F","height":"220px"});
         */
        this.mainList = new ListView("tabelas");
        this.append(this.mainList); 
        
    
        this.btGerarCodigo = new Button("Gerar");
        this.btGerarCodigo.setIcon("check");
        this.btGerarCodigo.addEvent('click',function(){
            tabela.gerarCodigo();
        });
        this.mainTb.addButton(this.btGerarCodigo,false);
  
        
        this.append(this.itdsTabela);
        this.append(this.itdominio);
        this.append(this.itPacote);
        this.append(this.itChavePrimaria);
        this.append(this.itTipo);   
        this.append(this.itTpGeracao);
        //this.append(this.ittipoTemplate);
        
        //this.addAssociation({"mod":"br.net.underdesk.codigogerador.view.TabelaCampo","act":"getCampos","puid":this.getVarModule()});
    }
    onStart():void{
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
    getTabelas(urlcaminho:string):void{
         urlcaminho = urlcaminho.substring(1,urlcaminho.length);
          //itemmenu.setSize(12);
          //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
         RequestManager.addRequest({ 
            "module":this,
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