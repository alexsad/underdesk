package br.net.underdesk.codigogerador.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.net.underdesk.codigogerador.dao.TabelaDAO;
import br.net.underdesk.codigogerador.model.Tabela;
import br.net.underdesk.codigogerador.model.TabelaCampo;

@RestController
@RequestMapping(value="/codigogerador/tabela")
public class TabelaBLL {
	
	@Autowired
	private TabelaDAO dao;
	@Autowired
	private TabelaCampoBLL tcb;

    @RequestMapping(method=RequestMethod.GET)
    public List<Tabela> get(){
        return this.dao.get();
    }
    @RequestMapping(value="/getbydstabela/{dsTabela}",method=RequestMethod.GET)
    public List<Tabela> getByDsTabela(@PathVariable("dsTabela") String dsTabela) {
        return this.dao.getByDsTabela(dsTabela);
    }
    @RequestMapping(value="/gerarstb",method=RequestMethod.GET)
	public String gerarSTB(){
		List<Tabela> tbs = this.dao.get();
		int tmT = tbs.size();
		String stbS = "";
		for(int x =0 ;x < tmT;x++){
			//System.out.println("ds:"+tbs.get(x).getDsTabela()+" xs:"+x);
			List<TabelaCampo> tbcs = tcb.getByDsTabela(tbs.get(x).getDsTabela());  
			//System.out.println("tm:"+tbcs.size()+" xs:"+x);
			if(tbcs.size()>0){
				tbs.get(x).setCampo(tbcs);
				stbS += this.dao.gerarCodigo(tbs.get(x),TabelaDAO.TP_STB);
			};
		};
		//return "";
		System.out.println(stbS);
		return stbS;
	}
    @RequestMapping(value="/gerarcodigobytabela",method=RequestMethod.POST)
	public String gerarCodigoByTabela(@RequestBody Tabela t){
		Tabela tabelaC = this.getByIdTabela(t.getCaminho(),t.getIdTabela());
		String rs = this.dao.gerarCodigo(tabelaC,t.getTpTemplate());
		System.out.println(rs);
		return rs;
	}	
    @RequestMapping(value="/gerarcodigo",method=RequestMethod.POST)
	public String gerarCodigo(@RequestBody List<Tabela> lsttab){    	
		int tmT = lsttab.size();
		String dirBase = "/mnt/arquivos/tmp/gen"; 
		for(int x =0 ;x < tmT;x++){			
			if(lsttab.get(x).getAllCampos().size()>0){				
				int tmtoexport = lsttab.get(x).getExportsto().length;				
				for(int y=0;y<tmtoexport;y++){	
					String tmpExport = lsttab.get(x).getExportsto()[y];
					String tmpPath = dirBase+"/"+this.dao.getTipo(tmpExport);
					CompactadorBLL.criaDiretorio(tmpPath);
					CompactadorBLL.criaArquivo(tmpPath+"/"+lsttab.get(x).getNome()+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
				}				
				//CompactadorBLL.criaDiretorio(lsttab.get(x).getExportsto()[1]);				
			};
		};
		//return "";
		//System.out.println(stbS);		
		return "url";
	}
    @RequestMapping(value="/getbyidtabela/{idTabela}",method=RequestMethod.GET)
    public Tabela getByIdTabela(@RequestParam(value = "urlc") String urlc,@PathVariable("idTabela") int idTabela){
        return this.dao.getByIdTabela(urlc,idTabela);
    }    
    @RequestMapping(method=RequestMethod.POST)
    public int insert(@RequestBody Tabela t){    
        if(this.dao.insert(t)){            
            return t.getIdTabela();
        }
        return 0;
    }
    @RequestMapping(method=RequestMethod.PUT)
    public boolean update(@RequestBody Tabela t){
        return this.dao.update(t);
    }
    @RequestMapping(method=RequestMethod.DELETE)
    public boolean delete(@RequestBody Tabela t){
         return this.dao.delete(t);
    } 
}
