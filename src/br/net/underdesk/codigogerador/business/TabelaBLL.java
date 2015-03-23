package br.net.underdesk.codigogerador.business;

import java.util.List;

import under.wsl.service.Service;
import br.net.underdesk.codigogerador.dao.TabelaDAO;
import br.net.underdesk.codigogerador.model.Tabela;

public class TabelaBLL {
	private TabelaDAO dao = null;
	public TabelaBLL(){
		this.dao = new TabelaDAO();
	}
    @Service(cache=false)
    public List<Tabela> get(){
        return this.dao.get();
    }
    @Service()
    public List<Tabela> getByDsTabela(String dsTabela) {
        return this.dao.getByDsTabela(dsTabela);
    }
	@Service()
	public String gerarCodigo(Tabela t){
		return this.dao.gerarCodigo(t.getCaminho(),t.getTpTemplate(),t.getIdTabela());
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
