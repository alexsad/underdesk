import {ModWindow} from "../../../../../lib/container";
import {ArrayList} from "../../../../../lib/util";
import {Tabela} from "../../codigogerador/view/Tabela";
export class Arquivo extends ModWindow{
    idArquivo:number;
    tb:Tabela;
    tmpA:ArrayList;
    constructor(p_id:number){
        super("janela teste3","br.net.underdesk.arquivo.view.Arquivo");
        this.idArquivo =   p_id;  
        this.tb = new Tabela();
        this.tmpA = new ArrayList([]);
    }
}