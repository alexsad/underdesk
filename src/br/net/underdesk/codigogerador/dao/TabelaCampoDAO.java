package br.net.underdesk.codigogerador.dao;
import br.net.underdesk.codigogerador.business.TabelaBLL;
import br.net.underdesk.codigogerador.model.Tabela;
import br.net.underdesk.codigogerador.model.TabelaCampo;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
/**
* @author alexandre.araujo
*/
@Repository
public class TabelaCampoDAO{	
	
	@PersistenceContext()
	private EntityManager manager;
	
	public List<TabelaCampo> get() {
		return manager.createQuery("From TabelaCampo tc order by tc.idTabelaCampo asc", TabelaCampo.class).getResultList();
	}
	public List<TabelaCampo> getByDsTabela(String dsTabela){
		return manager.createQuery("From TabelaCampo tc where tc.dsTabela = :dsTabela order by tc.idTabelaCampo asc", TabelaCampo.class)
				.setParameter("dsTabela", dsTabela)
				.getResultList();	
	}
	
    public boolean insert(TabelaCampo tc){
    	TabelaBLL tbll = new TabelaBLL();
    	Tabela t = tbll.getByIdTabela(tc.getCaminho(),tc.getIdTabela());
    	t.setCaminho(tc.getCaminho());
    	tc.setIdTabelaCampo(t.getCampo().size()+1);
    	tc.setCaminho("");
    	List<TabelaCampo> campos = t.getCampo();
    	campos.add(tc);
    	t.setCampo(campos);
        return tbll.update(t); 
    }
    public boolean update(TabelaCampo tc){
    	TabelaBLL tbll = new TabelaBLL();
    	Tabela t = tbll.getByIdTabela(tc.getCaminho(),tc.getIdTabela());
    	t.setCaminho(tc.getCaminho());    	
    	tc.setCaminho("");
    	List<TabelaCampo> campos = t.getCampo();
    	campos.set(tc.getIdTabelaCampo()-1, tc);
    	t.setCampo(campos);
        return tbll.update(t); 
    }
    public boolean delete(TabelaCampo tc){
    	TabelaBLL tbll = new TabelaBLL();
    	Tabela t = tbll.getByIdTabela(tc.getCaminho(),tc.getIdTabela());
    	t.setCaminho(tc.getCaminho());    	
    	List<TabelaCampo> campos = t.getCampo();
    	campos.remove(tc.getIdTabelaCampo()-1);
    	int tmtc = campos.size();
    	for(int i=0;i<tmtc;i++){
    		campos.get(i).setIdTabelaCampo(i+1);
    	}
    	t.setCampo(campos);
        return tbll.update(t); 
    }
}