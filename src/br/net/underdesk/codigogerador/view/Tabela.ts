import {ModWindow} from "../../../../../lib/container";
import {InputText,Select,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {ITabela} from "./ITabela";
import {TabelaCampo} from "./TabelaCampo";
import {ArquivoView} from "../../arquivo/view/ArquivoView";
import {IArquivo} from "../../arquivo/view/IArquivo";
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
    itSnViewTypeScript:CheckBox;
    itSnItemViewHtml:CheckBox;
    itSnNodeSchemaJs:CheckBox;
    itSnNodeBLLJs:CheckBox;
    itSnGerarApenasSelecionada:CheckBox;
    //itSnNodeRouteJs:CheckBox;
    //itrs:null;
    btGerarCodigo:Button;
    mainList:ListView;
    mainTb:ToolBar;
    _urlPath:string;
    _modTabelaCampo:TabelaCampo;
    _modArquivoView:ArquivoView;
    constructor(p_arquivoview:ArquivoView){
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
        
        
        
        this.itSnGerarApenasSelecionada = new CheckBox("Gerar Apenas da Tabelas Selecionada?", "Sim");
        this.itSnGerarApenasSelecionada.setEnable(true);
        this.itSnGerarApenasSelecionada.setSize(4);
        this.itSnGerarApenasSelecionada.setCheckedValue("S");
        this.itSnGerarApenasSelecionada.setUnCheckedValue("N");       
        this.append(this.itSnGerarApenasSelecionada);
        
        
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
        
        this.itSnViewTypeScript = new CheckBox("Valido?", "Sim");
        this.itSnViewTypeScript.setEnable(true);
        this.itSnViewTypeScript.setSize(7);
        this.itSnViewTypeScript.setLabel("Visual com TypeScript:");
        this.itSnViewTypeScript.setCheckedValue("TYPESCRIPT_VIEW@ts");
        this.itSnViewTypeScript.setUnCheckedValue("");     
        this.append(this.itSnViewTypeScript);
        
        this.itSnItemViewHtml = new CheckBox("Valido?", "Sim");
        this.itSnItemViewHtml.setEnable(true);
        this.itSnItemViewHtml.setSize(5);
        this.itSnItemViewHtml.setLabel("Item View HTML:");
        this.itSnItemViewHtml.setCheckedValue("HTML_ITEMVIEW@html");
        this.itSnItemViewHtml.setUnCheckedValue("");     
        this.append(this.itSnItemViewHtml);
        
        this.itSnNodeSchemaJs = new CheckBox("Valido?", "Sim");
        this.itSnNodeSchemaJs.setEnable(true);
        this.itSnNodeSchemaJs.setSize(6);
        this.itSnNodeSchemaJs.setLabel("Schema NODEJS:");
        this.itSnNodeSchemaJs.setCheckedValue("NODE_SCHEMA@js");
        this.itSnNodeSchemaJs.setUnCheckedValue("");        
        this.append(this.itSnNodeSchemaJs);
        
        this.itSnNodeBLLJs = new CheckBox("Valido?", "Sim");
        this.itSnNodeBLLJs.setEnable(true);
        this.itSnNodeBLLJs.setSize(6);
        this.itSnNodeBLLJs.setLabel("BLL NODEJS:");
        this.itSnNodeBLLJs.setCheckedValue("NODE_BLL@js");
        this.itSnNodeBLLJs.setUnCheckedValue("");       
        this.append(this.itSnNodeBLLJs);
        


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
    
        this._modArquivoView = p_arquivoview;
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
        
        this._modTabelaCampo = new TabelaCampo();
        this.getModView().append(this._modTabelaCampo);  
        
    }
    onChangeItem(p_obj:ITabela):ITabela{        
        //this._modTabelaCampo.getMainList().setDataProvider(p_obj.campo);
        if(p_obj.campo){
            this._modTabelaCampo.getMainList().setDataProvider(p_obj.campo);
            this._modTabelaCampo.itIdTabela.setValue(p_obj.idTabela+"");
        }else{
            this._modTabelaCampo.getMainList().setDataProvider([]);
        };        
        return p_obj;        
    }
    setCaminho(p_caminho:string):void{
        this._urlPath = p_caminho;
    }
    getCaminho():string{
        return this._urlPath;
    }
    getTabelas(p_urlcaminho:string):void{
         //var urlcaminho:string = p_urlcaminho.substring(1,p_urlcaminho.length);
          //itemmenu.setSize(12);
          //tabela.tbMain.setActAttrConfig(["add","del","edit","reload"],"params",[urlcaminho]);  
         RequestManager.addRequest({ 
            "module":this,
            "url":p_urlcaminho,
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
                ,"onLoad":function(dta:string[]){
                    //this.itrs.setValue(dta);
                    this._modArquivoView.addArquivo({
                        tmArquivo:100
                        ,dsArquivo:dta[0]
                        ,snPasta:'S'
                        ,caminho:dta[1]
                        ,icone:'folder-close'
                    });  
                    
                     this._modArquivoView.addArquivo({
                        tmArquivo:100
                        ,dsArquivo:dta[0]+".zip"
                        ,snPasta:'N'
                        ,caminho:dta[1]
                        ,icone:'compressed'
                    });
                    
                    
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
        if(this.itSnViewTypeScript.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnViewTypeScript.getValue();
        };
        if(this.itSnNodeSchemaJs.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnNodeSchemaJs.getValue();
        };
        if(this.itSnNodeBLLJs.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnNodeBLLJs.getValue();
        };
        if(this.itSnItemViewHtml.getValue()!=""){
            var tms:number = selecteds.length;
            selecteds[tms] = this.itSnItemViewHtml.getValue();
        };
        
        //var itensList:ITabela[] = this.getMainList().getDataProvider();
        var itensList:ITabela[] = [];
        if(this.itSnGerarApenasSelecionada.getValue()=="S"){
           itensList[0] = <ITabela>this.mainList.getSelectedItem();
        }else{
           itensList = this.mainList.getDataProvider();
        };
        //itensList[0] = <ITabela>this.mainList.getSelectedItem();        
        var tmLst:number = itensList.length;        
        for(var x:number =0;x<tmLst;x++){
            itensList[x].exportsto = selecteds;
            itensList[x].caminho = this.getCaminho();
        };
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