import {ModWindow} from "../../../../../lib/container";
import {InputText,Select,CheckBox,NumericStepper,ListView,ItemView,Button} from "../../../../../lib/controller";
import {ITabelaCampo} from "./ITabelaCampo";
import {ITabela} from "./ITabela";
import {Tabela} from "./Tabela";
import {ToolBar,RequestManager,IDefaultRequest} from "../../../../../lib/net";


@ItemView("assets/html/tabelacampo.html")
export class TabelaCampo extends ModWindow{   
    itIdTabelaCampo:InputText;
    itIdTabela:InputText;
    itCampo:InputText;
    itDsCampo:InputText;
    itTipo:Select;
    itLimite:NumericStepper;
    itSnNull:CheckBox;
    mainList:ListView;
    mainTb:ToolBar;
    _urlPath:string;
    _modTabela:Tabela;
    constructor(p_modTabela:Tabela){
        super("campos da tabela");
        this.setRevision("$Revision$");
        this.setSize(3);
        
        this.mainTb = new ToolBar({"domain":"ws/codigogerador/tabelacampo"});        
        this.append(this.mainTb);
        
        this.itIdTabelaCampo = new InputText("");
        this.itIdTabelaCampo.setColumn("$idTabelaCampo");
        this.itIdTabelaCampo.setLabel("cod.");
        this.itIdTabelaCampo.setSize(6);    
        this.itIdTabelaCampo.setEnable(false);
        this.append(this.itIdTabelaCampo);
        
        this.itIdTabela = new InputText("");
        this.itIdTabela.setColumn("!idTabela");
        this.itIdTabela.setLabel("cod tab.");
        this.itIdTabela.setSize(6);    
        this.itIdTabela.setEnable(false);
        this.append(this.itIdTabela);
        
        this.itCampo = new InputText("");
        this.itCampo.setColumn("@campo");
        this.itCampo.setLabel("campo"); 
        this.itCampo.setSize(12);
        this.append(this.itCampo);    
        
        this.itDsCampo = new InputText("");
        this.itDsCampo.setColumn("@dsCampo");
        this.itDsCampo.setLabel("descricao do campo");  
        this.itDsCampo.setSize(12);
        this.append(this.itDsCampo);      
        
        this.itTipo = new Select("tipo_campo");
        this.itTipo.setColumn("@tipo");
        this.itTipo.setLabel("tipo do campo");  
        this.itTipo.setSize(12); 
        this.itTipo.setValueField("idTpCampo");
        this.itTipo.setLabelField("dsTpCampo");
        this.append(this.itTipo);
        
        this.itLimite = new NumericStepper(1);
        this.itLimite.setColumn("@limite");
        this.itLimite.setLabel("tamanho");
        this.itLimite.setSize(6); 
        this.append(this.itLimite);  
        
        this.itSnNull = new CheckBox("campo nulo?", "sim");
        this.itSnNull.setColumn("@snNull");
        this.itSnNull.setLabel("campo nulo?");  
        this.itSnNull.setSize(6);   
        this.itSnNull.setUnCheckedValue("N");
        this.itSnNull.setCheckedValue("S");
        this.append(this.itSnNull); 
                
        this.mainList = new ListView("campos");
        this.append(this.mainList);    
        
        this._modTabela = p_modTabela;
    }
    onStart():void{ 
        this.itTipo.setDataProvider([
                                     {"idTpCampo":"int","dsTpCampo":"inteiro"}
                                     ,{"idTpCampo":"varchar","dsTpCampo":"texto"}
                                     ,{"idTpCampo":"date","dsTpCampo":"data"}
                                     ,{"idTpCampo":"real","dsTpCampo":"flutuante"}
                                     ,{"idTpCampo":"decimal","dsTpCampo":"decimal"}
                                     ]);
    
    }
    setCaminho(p_caminho:string):void{
        this._urlPath = p_caminho;
    }
    getCaminho():string{
        return this._urlPath;
    }

    beforeInsert(p_req_obj: IDefaultRequest): IDefaultRequest{
        var tmpTabela:ITabela = <ITabela>this._modTabela.mainList.getSelectedItem();
        var tmpCampo:ITabelaCampo = <ITabelaCampo>this.getFormItem();        
        //tmpCampo.
        if(!tmpTabela.campo){
            tmpTabela.campo = [];
        };
        tmpCampo.idTabelaCampo = tmpTabela.campo.length;
        /*
        if(tmpCampo.idTabela > 1){
            tmpTabela.campo.push(tmpCampo);  
        };
        */
        //tmpTabela.campo.push(tmpCampo);        
        
        this.mainList.insertItem(tmpCampo);
        //p_req_obj.data["caminho"] = this.getCaminho();
        this._modTabela.mainTb.btSave.getEle().click();
        return null;    
    }
    beforeUpdate(p_req_new_obj: IDefaultRequest, p_old_obj: ITabelaCampo): IDefaultRequest{
        
       var tmpTabela:ITabela = <ITabela>this._modTabela.mainList.getSelectedItem();
       var tmpCampo:ITabelaCampo = <ITabelaCampo>p_req_new_obj.data;        
       tmpTabela.campo[tmpCampo.idTabelaCampo-1] = tmpCampo;       
       this.mainList.updateItem(tmpCampo);
       this._modTabela.mainTb.btSave.getEle().click();
       return null;
    }
    beforeDelete(p_req_delete: IDefaultRequest, p_old_obj: ITabelaCampo):IDefaultRequest{
        /*
        p_old_obj.caminho = this.getCaminho();
        p_old_obj.idTabela = parseInt(this.itIdTabela.getValue());
        return p_req_delete;
        */        
        return null;
    }
}
