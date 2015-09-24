import {ModWindow} from "../../../../../lib/container";
import {ListView,ItemView,Button} from "../../../../../lib/controller";
import {Tabela} from "../../codigogerador/view/Tabela";
import {IArquivo} from "./IArquivo";
import {RequestManager,IDefaultRequest} from "../../../../../lib/net";

@ItemView({url:"js/br/net/underdesk/arquivo/view/assets/html/arquivo.html",list:"mainList"})
export class ArquivoView extends ModWindow{    
    mainList:ListView;
    btExplorar:Button;
    btBaixar:Button;    
    _modTabela:Tabela;
    constructor(){
        super("*lista de arquivos no servidor","br.net.underdesk.arquivo.view.Arquivo");
        this.setRevision("$Revision$");   
        this.setSize(4);     
        
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
        
        this.btBaixar = new Button("Baixar");
        this.btBaixar.setIcon("download-alt");
        this.btBaixar.getEle().attr("target","_blank");
        this.append(this.btBaixar);       
        
       
        this.mainList = new ListView("arquivos"); 
        this.append(this.mainList);  
        
    }
    onStart():void{        
        this._modTabela = new Tabela();
        this.getModView().append(this._modTabela);        
        this.getByCaminho("");        
    }
    onChangeItem(p_obj:IArquivo):IArquivo{
        var toOpen:string = "#";       
        if(p_obj.snPasta=="N"){
            toOpen = "/underdesk/"+p_obj.caminho;             
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
    getByCaminho(p_caminho:string):void{
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