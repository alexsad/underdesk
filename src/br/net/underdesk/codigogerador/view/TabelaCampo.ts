import {ModWindow} from "../../../../../lib/container";
import {InputText,Select,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {ITabela} from "./ITabela";
import {ToolBar,RequestManager,IDefaultRequest} from "../../../../../lib/net";


@ItemView({url:"js/br/net/underdesk/codigogerador/view/assets/html/tabelacampo.html",list:"mainList"})
export class TabelaCampo extends ModWindow{   
    itIdTabelaCampo:InputText;
    itCampo:InputText;
    itDsCampo:InputText;
    itTipo:Select;
    itLimite:NumericStepper;
    itSnNull:CheckBox
    mainList:ListView;
    mainTb:ToolBar;
    constructor(){
        this.parent("campos da tabela");
        this.setRevision("$Revision$");
        this.setSize(7);
        
        this.mainTb = new ToolBar({"domain":"ws/codigogerador/tabelacampo"});        
        this.append(this.mainTb);
        
        this.itIdTabelaCampo = new InputText("");
        this.itIdTabelaCampo.setColumn("$idTabelaCampo");
        this.itIdTabelaCampo.setLabel("cod.");
        this.itIdTabelaCampo.setSize(2);    
        this.itIdTabelaCampo.setEnable(false);
        this.append(this.itIdTabelaCampo);
        
        this.itCampo = new InputText("");
        this.itCampo.setColumn("@campo");
        this.itCampo.setLabel("campo"); 
        this.itCampo.setSize(4);
        this.append(this.itCampo);    
        
        this.itDsCampo = new InputText("");
        this.itDsCampo.setColumn("@dsCampo");
        this.itDsCampo.setLabel("descricao do campo");  
        this.itDsCampo.setSize(6);
        this.append(this.itDsCampo);      
        
        this.itTipo = new Select("tipo_campo");
        this.itTipo.setColumn("@tipo");
        this.itTipo.setLabel("tipo do campo");  
        this.itTipo.setSize(4); 
        this.itTipo.setValueField("idTpCampo");
        this.itTipo.setLabelField("dsTpCampo");
        this.append(this.itTipo);
        
        this.itLimite = new NumericStepper(1);
        this.itLimite.setColumn("@limite");
        this.itLimite.setLabel("tamanho");
        this.itLimite.setSize(4); 
        this.append(this.itLimite);  
        
        this.itSnNull = new CheckBox("campo nulo?", "sim");
        this.itSnNull.setColumn("@snNull");
        this.itSnNull.setLabel("campo nulo?");  
        this.itSnNull.setSize(4);   
        this.itSnNull.setUnCheckedValue("N");
        this.itSnNull.setCheckedValue("S");
        this.append(this.itSnNull); 
                
        this.mainList = new ListView("campos");
        this.append(this.mainList);       
    }
    onStart():void{
        this.mainTb.activate(true); 
        this.itTipo.setDataProvider([
                                     {"idTpCampo":"int","dsTpCampo":"inteiro"}
                                     ,{"idTpCampo":"varchar","dsTpCampo":"texto"}
                                     ,{"idTpCampo":"date","dsTpCampo":"data"}
                                     ,{"idTpCampo":"real","dsTpCampo":"flutuante"}
                                     ,{"idTpCampo":"decimal","dsTpCampo":"decimal"}
                                     ]);
    
    }
    beforeSave(p_obj){
        p_obj["caminho"] = arquivo.itCaminho.getValue();
        p_obj["idTabela"] = tabela.itidTabela.getValue();
        return p_obj;
    }
    beforeDelete(p_new_obj,p_old_obj){
        p_new_obj["caminho"] = arquivo.itCaminho.getValue();
        p_new_obj["idTabela"] = tabela.itidTabela.getValue();
        return p_new_obj;
    }
    getCampos(p_idTabela:number){
        if(tabela.mainList.getSelectedItem(true)["campo"]){
            tabelacampo.mainList.setDataProvider(tabela.mainList.getSelectedItem(true)["campo"]);                 
        }else{
            tabelacampo.mainList.setDataProvider([]);                 
        } 
    }
    
    beforeSave(p_obj: Object): Object;
    
    beforeInsert(p_req_obj: IDefaultRequest): IDefaultRequest;
    beforeQuery(p_req: IDefaultRequest): IDefaultRequest;
    onChangeItem(p_obj: Object): Object;
    beforeDelete(p_req_delete: IDefaultRequest, p_old_obj: Object): IDefaultRequest;
    beforeUpdate(p_req_new_obj: IDefaultRequest, p_old_obj: Object): IDefaultRequest;
}