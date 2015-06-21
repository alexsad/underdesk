package br.net.underdesk.codigogerador.business;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.net.underdesk.codigogerador.model.TabelaCampo;
import br.net.underdesk.codigogerador.dao.TabelaCampoDAO;

/**
 * @author alexandre.araujo
 */

@RestController
@RequestMapping(value="/codigogerador/tabelacampo")
public class TabelaCampoBLL{
	@Autowired
    private TabelaCampoDAO dao;
	
	@RequestMapping(method=RequestMethod.GET)
    public List<TabelaCampo> get(){
        return this.dao.get();
    }
	@RequestMapping(value="/getbydstabela/{dsTabela}",method=RequestMethod.GET)
    public List<TabelaCampo> getByDsTabela(@PathVariable("dsTabela") String dsTabela) {
        return this.dao.getByDsTabela(dsTabela);
    }
	@RequestMapping(method=RequestMethod.POST)  
    public int insert(@RequestBody TabelaCampo tc){    
        if(this.dao.insert(tc)){            
            return tc.getIdTabelaCampo();
        }
        return 0;
    }
    @RequestMapping(method=RequestMethod.PUT)
    public boolean update(@RequestBody TabelaCampo tc){
        return this.dao.update(tc);
    }
    @RequestMapping(method=RequestMethod.DELETE)
    public boolean delete(@RequestBody TabelaCampo tc){
         return this.dao.delete(tc);
    }  
}