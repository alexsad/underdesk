package br.net.underdesk.codigogerador.dao;
import br.net.underdesk.codigogerador.business.TabelaBLL;
import br.net.underdesk.codigogerador.model.Tabela;
import br.net.underdesk.codigogerador.model.TabelaCampo;
import br.net.underdesk.util.ConexaoDB;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
* @author alexandre.araujo
*/
public class TabelaCampoDAO{
	
	
	
	private String[][] ordemP = {{"idTabelaCampo", "asc"}};
	public List<TabelaCampo> get() {
		return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,null,ordemP);
	}
	
	public List<TabelaCampo> getByDsTabela(String dsTabela){		
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("dsTabela", dsTabela);
		return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
	}
	
	
	/*
    public List<TabelaCampo> get() {
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,null,ordemP);
    }
	public List<TabelaCampo> getByIdTabelaCampo(int idTabelaCampo){
        return (List<TabelaCampo>) ConexaoDB.getById(TabelaCampo.class,idTabelaCampo);
    }


    public List<TabelaCampo> getByCampo(String campo){		
		Map<String,Object> params = new HashMap<String, Object>();
     	params.put("campo", campo);
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
    }
	

    public List<TabelaCampo> getByTipo(String tipo){		
		Map<String,Object> params = new HashMap<String, Object>();
     	params.put("tipo", tipo);
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
    }
	

    public List<TabelaCampo> getByDsCampo(String dsCampo){		
		Map<String,Object> params = new HashMap<String, Object>();
     	params.put("dsCampo", dsCampo);
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
    }
	

    public List<TabelaCampo> getByLimite(int limite){		
		Map<String,Object> params = new HashMap<String, Object>();
     	params.put("limite", limite);
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
    }
	

    public List<TabelaCampo> getBySnNull(String snNull){		
		Map<String,Object> params = new HashMap<String, Object>();
     	params.put("snNull", snNull);
    	return (List<TabelaCampo>) ConexaoDB.get(TabelaCampo.class,true,1,100,params,ordemP);
    }
	*/

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