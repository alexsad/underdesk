package br.net.underdesk.codigogerador.business;

import java.util.ArrayList;
import java.util.List;

import under.wsl.service.Service;
import br.net.underdesk.codigogerador.dao.TabelaDAO;
import br.net.underdesk.codigogerador.model.Tabela;
import br.net.underdesk.codigogerador.model.TabelaCampo;

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
	public String gerarSTB(){
		List<Tabela> tbs = this.dao.get();
		int tmT = tbs.size();
		TabelaCampoBLL tcb = new TabelaCampoBLL();
		String stbS = "";
		for(int x =0 ;x<tmT;x++){
			//tbs.get(x).setIdTabela(x+1);
			List<TabelaCampo> tbcs = tcb.getByDsTabela(tbs.get(x).getDsTabela());  
			tbs.get(x).setCampo(tbcs);
			stbS += this.dao.gerarCodigo(tbs.get(x),TabelaDAO.TP_STB);
		}
		//return "";
		System.out.println(stbS);
		return stbS;
	}
	@Service()
	public String gerarCodigo(Tabela t){
		Tabela tabelaC = this.getByIdTabela(t.getCaminho(),t.getIdTabela());
		String rs = this.dao.gerarCodigo(tabelaC,t.getTpTemplate());
		System.out.println(rs);
		return rs;
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
