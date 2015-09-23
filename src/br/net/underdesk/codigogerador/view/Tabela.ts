import {ModWindow} from "../../../../../lib/container";
import {InputText,Select,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {ITabela} from "./ITabela";
import {ToolBar,RequestManager,IDefaultRequest} from "../../../../../lib/net";

@ItemView({url:"js/br/net/underdesk/codigogerador/view/assets/html/tabela.html",list:"mainList"})
export class Tabela extends ModWindow{   
    itidTabela:InputText;
    itdsTabela:InputText;
    itdominio:InputText;
    itPacote:InputText;
    itTipo:CheckBox;
    itTpGeracao:Select;
    itChavePrimaria:InputText;
    itSnModelJava:CheckBox;       
    itSnDaoJava:CheckBox;
    itSnBLLJava:CheckBox;
    itSnJsMoolTools:CheckBox;
    itSnNodeSchemaJs:CheckBox;
    itSnNodeBLLJs:CheckBox;
    itSnNodeRouteJs:CheckBox;
    //itrs:null;
    btGerarCodigo:Button;
    mainList:ListView;
    mainTb:ToolBar;
    _urlPath:string;
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
            this.gerarCodigo();
        }.bind(this));
        this.mainTb.addButton(this.btGerarCodigo);
          
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
    setCaminho(p_caminho:string):void{
        this._urlPath = p_caminho;
    }
    getCaminho():string{
        return this._urlPath;
    }
    getTabelas(urlcaminho:string):void{
         urlcaminho = urlcaminho.substring(1,urlcaminho.length);
          //itemmenu.setSize(12);
          //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
         RequestManager.addRequest({ 
            "module":this,
            "url":urlcaminho,
            "onLoad":function(dta:ITabela[]){
              this.getMainList().setDataProvider(dta);
            }.bind(this)
          });  
    }
    beforeQuery(p_obj_req:IDefaultRequest):IDefaultRequest{
         var urlcaminho:string = this.getCaminho().substring(1,this.getCaminho().length);
         p_obj_req.url = urlcaminho; 
         return p_obj_req;
    }
    gerarCodigoSingle():void{
        RequestManager.addRequest({
                "module":this
                ,"method":"post"
                ,"url":"ws/codigogerador/tabela/gerarcodigo"
                ,"data":{
                    "idTabela":this.itidTabela.getValue()              
                    //,"tpTemplate":this.ittipoTemplate.getValue()
                    ,"caminho":this.getCaminho()
                }
                //,"caminho":"/assets/uml/ata3_uml.json"
                ,"onLoad":function(dta:ITabela[]){
                        this.itrs.setValue(dta);
                }.bind(this)
        }); 
    }
    gerarCodigo():void{        
        var selecteds:string[] = [];
        
        if(this.itSnModelJava.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnModelJava.getValue();
        };
        if(this.itSnDaoJava.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnDaoJava.getValue();
        };
        if(this.itSnBLLJava.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnBLLJava.getValue();
        };
        if(this.itSnJsMoolTools.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnJsMoolTools.getValue();
        };
        if(this.itSnNodeSchemaJs.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnNodeSchemaJs.getValue();
        };
        if(this.itSnNodeBLLJs.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnNodeBLLJs.getValue();
        };
        if(this.itSnNodeRouteJs.getValue()!=""){
            var tms = selecteds.length;
            selecteds[tms] = this.itSnNodeRouteJs.getValue();
        };
        
        var itensList:ITabela[] = this.getMainList().getDataProvider();
        
        var tmLst = itensList.length;
        
        for(var x =0;x<tmLst;x++){
            itensList[x].exportsto = selecteds;
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
        RequestManager.addRequest({  
                "data":itensList
                ,"module":this
                ,"method":"post"
                ,"url":"ws/codigogerador/tabela/gerarcodigo"
                ,"onLoad":function(dta:ITabela[]){
                        //this.itrs.setValue(dta);
                }.bind(this)
        }); 
        
    }
    beforeInsert(p_req_obj: IDefaultRequest): IDefaultRequest{
        p_req_obj.data["caminho"] = this.getCaminho();
        return p_req_obj;    
    }   
    beforeUpdate(p_req_new_obj: IDefaultRequest, p_old_obj: Object): IDefaultRequest{
        p_req_new_obj.data["caminho"] = this.getCaminho();
        return p_req_new_obj;
    }    
    beforeSave(p_obj:ITabela):ITabela{
        //p_obj.data["caminho"] = this._urlPath;
        return p_obj;
    }
    beforeDelete(p_new_obj:IDefaultRequest,p_old_obj:ITabela):IDefaultRequest{
        p_new_obj.data["caminho"] = this.getCaminho();
        return p_new_obj;
    }
}