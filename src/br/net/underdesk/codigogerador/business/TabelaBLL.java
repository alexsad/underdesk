package br.net.underdesk.codigogerador.business;

import under.wsl.service.Service;
import br.net.underdesk.codigogerador.dao.TabelaDAO;
import br.net.underdesk.codigogerador.model.Tabela;

public class TabelaBLL {
	private TabelaDAO dao = null;
	public TabelaBLL(){
		this.dao = new TabelaDAO();
	}
	@Service()
	public String gerarCodigo(String urlc,String tipoTemplate,int idTabela){
		return this.dao.gerarCodigo(urlc,tipoTemplate,idTabela);
	}	
    @Service()
    public Tabela getByIdTabela(String urlc,int idTabela){
        return this.dao.getByIdTabela(urlc,idTabela);
    }    
    @Service(remove={"TabelaBLL.get"})   
    public int insert(Tabela t){    
        if(this.dao.insert(t)){            
            return t.getIdTabela();
        }
        return 0;
    }
    @Service(remove={"TabelaBLL.get"})
    public boolean update(Tabela t){
        return this.dao.update(t);
    }
    @Service(remove={"TabelaBLL.get"})
    public boolean delete(Tabela t){
         return this.dao.delete(t);
    } 
}
