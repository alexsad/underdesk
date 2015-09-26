import {ModWindow} from "../../../../../lib/container";
import {ListView,ItemView,Button} from "../../../../../lib/controller";
import {Tabela} from "../../codigogerador/view/Tabela";
import {IArquivo} from "./IArquivo";
import {RequestManager,IDefaultRequest} from "../../../../../lib/net";

@ItemView({url:"js/br/net/underdesk/arquivo/view/assets/html/arquivo.html",list:"mainList"})
export class ArquivoView extends ModWindow{    
    mainList:ListView;
    //btExplorar:Button;
    btBaixar:Button;   
    btSubir:Button; 
    _modTabela:Tabela;
    _caminho:string;
    constructor(){
        super("*lista de arquivos no servidor","br.net.underdesk.arquivo.view.Arquivo");
        this.setRevision("$Revision$");   
        this.setSize(4);     
        /*
        this.btExplorar = new Button("Abrir");
        this.btExplorar.setIcon("folder-open");
        
        this.btExplorar.addEvent('click',function(){
            if(this.itSnPasta.getValue()=="N"){
                //js.underas.core.Underas.loadModule({"mod":"br.net.underdesk.codigogerador.view.Tabela","act":"getTabelas","p":[arquivo.itCaminho.getValue()],"icon":"indent-left","title":"*Geracao de Codigo"});
            }else{
                this.getByCaminho(this.itCaminho.getValue());
            }
        }.bind(this));        
        this.append(this.btExplorar);       
        */
        
        this.mainList = new ListView("arquivos"); 
        this.append(this.mainList);  
        
        this.btBaixar = new Button("Baixar");
        this.btBaixar.setIcon("download-alt");
        this.btBaixar.getEle().attr("target","_blank").removeClass("btn-default").addClass("btn-info");
        this.btBaixar.setEnable(false);
        this.append(this.btBaixar);
        
        this.btSubir = new Button("Voltar");
        this.btSubir.setIcon("arrow-left");
        this.btSubir.addEvent('click',this.voltar.bind(this));
        this.btSubir.setEnable(false);
        this.append(this.btSubir);
               
    }
    onStart():void{        
        this._modTabela = new Tabela(this);
        this.getModView().append(this._modTabela);        
        this.getByCaminho("");     
    
        this.mainList.getEle(".tilecellgrid").on("dblclick", ".tilecell", function (){
            var selecteDArquivo:IArquivo = <IArquivo>this.getMainList().getSelectedItem();
            if(selecteDArquivo.snPasta=="S"){
                this.getByCaminho(selecteDArquivo.caminho);
            }
        }.bind(this));        
    }
    voltar(evt:Event):void{
        //evt.defaultPrevented();
        if(this._caminho==""||this._caminho=="/"){
            this._caminho="";
            this.btSubir.setEnable(false);
        }else{
            var tmpPath:string = this._caminho.substring(0,this._caminho.length-1);
            //console.log(tmpPath.substring(0,tmpPath.lastIndexOf("/"))+"/");
            this.getByCaminho(tmpPath.substring(0,tmpPath.lastIndexOf("/"))+"/"); 
        };        
    }
    onChangeItem(p_obj:IArquivo):IArquivo{
        var toOpen:string = "#";       
        if(p_obj.snPasta=="N"){
            toOpen = "/underdesk/"+p_obj.caminho;
            this.btBaixar.setEnable(true);             
        }else{
            this.btBaixar.setEnable(false); 
        };
        if(p_obj.snPasta=="N" && p_obj.caminho.indexOf("_uml.json") > 0){
            this._modTabela.setCaminho(p_obj.caminho);
             //this._modTabela.getMainList().setDataProvider();
            this._modTabela.getTabelas(p_obj.caminho);
        };
        this.btBaixar.getEle().attr("href",toOpen);            
        this._modTabela.setCaminho(p_obj.caminho);        
        return p_obj;
    }
    addArquivo(p_arq:IArquivo):void{        
        if(!p_arq.idArquivo){
            p_arq.idArquivo =  this.mainList.getDataProvider().length+1;
        };        
        this.mainList.insertItem(p_arq, 'bottom'); 
    }
    getByCaminho(p_caminho:string):void{
            this._caminho = p_caminho;
            if(this._caminho==""||this._caminho=="/"){
                this.btSubir.setEnable(false);
            }else{
                this.btSubir.setEnable(true);
            };
            //console.log(this._caminho);
            RequestManager.addRequest({
                "data":{"urlpath":p_caminho}
                ,"module":this
                ,"url":"ws/arquivo/arquivo/getbypath"
                ,"onLoad":function(dta:IArquivo[]){
                   this.getMainList().setDataProvider(dta);
                 }.bind(this)
              });
    }
}