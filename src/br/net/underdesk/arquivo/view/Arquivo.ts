import {ModWindow} from "../../../../../lib/container";
import {Tabela} from "../../codigogerador/view/Tabela";
export class Arquivo extends ModWindow{
    idArquivo:number;
    tb:Tabela;
    constructor(p_id:number){
        super("janela teste","br.net.underdesk.arquivo.view.Arquivo");
        this.idArquivo =   p_id;  
        this.tb = new Tabela();
    }
}