package br.net.underdesk.codigogerador.business;
import java.util.List;

import br.net.underdesk.codigogerador.model.TabelaCampo;
import br.net.underdesk.codigogerador.dao.TabelaCampoDAO;
import under.wsl.service.Service;
/**
 * @author alexandre.araujo
 */
public class TabelaCampoBLL{
    private TabelaCampoDAO dao = null;
    public TabelaCampoBLL() {
        this.dao = new TabelaCampoDAO();
    }
    @Service(cache=false)
    public List<TabelaCampo> get(){
        return this.dao.get();
    }
    @Service()
    public List<TabelaCampo> getByDsTabela(String dsTabela) {
        return this.dao.getByDsTabela(dsTabela);
    }
    /*
    @Service(cache=true)
    public List<TabelaCampo> get(){
        return this.dao.get();
    }
    @Service()
    public List<TabelaCampo> getByIdTabelaCampo(int idTabelaCampo) {
        return this.dao.getByIdTabelaCampo(idTabelaCampo);
    }
    @Service()
    public List<TabelaCampo> getByCampo(String campo) {
        return this.dao.getByCampo(campo);
    }
    @Service()
    public List<TabelaCampo> getByTipo(String tipo) {
        return this.dao.getByTipo(tipo);
    }
    @Service()
    public List<TabelaCampo> getByDsCampo(String dsCampo) {
        return this.dao.getByDsCampo(dsCampo);
    }
    @Service()
    public List<TabelaCampo> getByLimite(int limite) {
        return this.dao.getByLimite(limite);
    }
    @Service()
    public List<TabelaCampo> getBySnNull(String snNull) {
        return this.dao.getBySnNull(snNull);
    }
    */
    @Service(remove={"TabelaCampoBLL.get"})   
    public int insert(TabelaCampo tc){    
        if(this.dao.insert(tc)){            
            return tc.getIdTabelaCampo();
        }
        return 0;
    }
    @Service(remove={"TabelaCampoBLL.get"})
    public boolean update(TabelaCampo tc){
        return this.dao.update(tc);
    }
    @Service(remove={"TabelaCampoBLL.get"})
    public boolean delete(TabelaCampo tc){
         return this.dao.delete(tc);
    }  
}