import {ModWindow} from "../../../../../lib/container";
import {InputText,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {Tabela} from "../../codigogerador/view/Tabela";
import {IArquivo} from "./IArquivo";
import {SimpleToolBar,RequestManager,IDefaultRequest} from "../../../../../lib/net";

@ItemView({url:"js/br/net/underdesk/arquivo/view/assets/html/arquivo.html",list:"mainList"})
export class Arquivo extends ModWindow{    
    itIdArquivo:InputText;
    itDsArquivo:InputText;
    itTmArquivo:NumericStepper;
    itSnPasta:CheckBox;
    itCaminho:InputText;
    mainList:ListView;
    mainTb:SimpleToolBar;
    btExplorar:Button;
    btBaixar:Button;
    constructor(){
        super("*lista de arquivos no servidor","br.net.underdesk.arquivo.view.Arquivo");
        this.setRevision("$Revision$");   
        this.setSize(4); 
        
        this.mainTb = new SimpleToolBar(); 
        this.append(this.mainTb); 
        
        this.itIdArquivo = new InputText("");
        this.itIdArquivo.setColumn("$idArquivo");
        this.itIdArquivo.setLabel("cod.");  
        this.itIdArquivo.setSize(4);    
        this.itIdArquivo.setEnable(false);
        this.append(this.itIdArquivo);  
        
        this.itDsArquivo = new InputText("");
        this.itDsArquivo.setLabel("descricao");
        this.itDsArquivo.setColumn("@dsArquivo");   
        this.itDsArquivo.setSize(8);
        this.itDsArquivo.setEnable(false); 
        this.append(this.itDsArquivo); 
        
        this.itTmArquivo = new NumericStepper(0);
        this.itTmArquivo.setColumn("@tmArquivo");
        this.itTmArquivo.setLabel("tamanho");   
        this.itTmArquivo.setSize(4);
        this.itTmArquivo.setEnable(false);
        this.append(this.itTmArquivo); 
        
        this.itSnPasta = new CheckBox("pasta?", "sim");
        this.itSnPasta.setColumn("@snPasta");
        this.itSnPasta.setLabel("pasta?");  
        this.itSnPasta.setUnCheckedValue("N");
        this.itSnPasta.setCheckedValue("S");
        this.itSnPasta.setSize(8);  
        this.itSnPasta.setEnable(false);
        this.append(this.itSnPasta);
        
        this.itCaminho = new InputText("/");
        this.itCaminho.setColumn("@caminho");
        this.itCaminho.setLabel("caminho"); 
        this.itCaminho.setSize(12);
        this.itCaminho.setEnable(false);
        this.append(this.itCaminho);  
        
    
        
        this.btExplorar = new Button("Abrir");
        this.btExplorar.setIcon("folder-open");
        
        this.btExplorar.addEvent('click',function(){
            if(this.itSnPasta.getValue()=="N"){
                //js.underas.core.Underas.loadModule({"mod":"br.net.underdesk.codigogerador.view.Tabela","act":"getTabelas","p":[arquivo.itCaminho.getValue()],"icon":"indent-left","title":"*Geracao de Codigo"});
            }else{
                this.getByCaminho(this.itCaminho.getValue());
            }
        }.bind(this));        
        this.mainTb.addButton(this.btExplorar);       
        
        this.btBaixar = new Button("Baixar");
        this.btBaixar.setIcon("download-alt");
        this.btBaixar.getEle().attr("target","_blank");
        this.mainTb.addButton(this.btBaixar);       
        
       
        this.mainList = new ListView("arquivos"); 
        this.append(this.mainList);  
        
    }
    onStart():void{        
        this.getByCaminho("");        
    }
    onChangeItem(p_obj:IArquivo):IArquivo{
        var toOpen:string = "#";       
        if(p_obj.snPasta=="N"){
            toOpen = "/underdesk/"+this.itCaminho.getValue();             
        };
        this.btBaixar.getEle().attr("href",toOpen);
          
        this.itIdArquivo.setValue(p_obj.idArquivo+"");
        this.itDsArquivo.setValue(p_obj.dsArquivo);
        this.itSnPasta.setValue(p_obj.snPasta);
        this.itTmArquivo.setValue(p_obj.tmArquivo+"");
        this.itCaminho.setValue(p_obj.caminho);     
        return p_obj;
    }
    getByCaminho(p_caminho:string):void{        
            this.itCaminho.setValue(p_caminho); 
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