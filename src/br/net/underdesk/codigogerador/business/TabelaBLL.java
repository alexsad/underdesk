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
		//System.out.println(rs);
		return rs;
	}	
    @RequestMapping(value="/gerarcodigo",method=RequestMethod.POST)
	public String[] gerarCodigo(@RequestBody List<Tabela> lsttab){    	
    	String path = TabelaBLL.class.getResource("").getPath();        
        // System.out.println(path.substring(0,path.indexOf("underdesk/WEB-INF/")));    	
		int tmT = lsttab.size();
		//String dirBase = path.substring(0,path.indexOf("underdesk/WEB-INF/")); 
		String dirTmp = "";	
		String nameOfDir = "";
		if(tmT>0){
			nameOfDir = "uml_tmp_"+lsttab.get(0).getPacote().replaceAll("\\.", "_");
			dirTmp = "underdesk/"+lsttab.get(0).getCaminho();
			dirTmp = dirTmp.substring(0,dirTmp.lastIndexOf("/"))+"/"+nameOfDir;
			
			
			String dirBase = path.substring(0,path.indexOf("underdesk/WEB-INF/"))+dirTmp;
			
			dirBase = "C:\\temp\\gen\\underdesk";
			
			//System.out.println(dirBase);
			
			//String dirBase = "/mnt/arquivos/tmp/gen";		
			//String dirBase = "C:/temp/gen"; 
			
			CompactadorBLL.criaDiretorio(dirBase);	
			/*
			CompactadorBLL.criaDiretorio(dirBase+"/model");
			CompactadorBLL.criaDiretorio(dirBase+"/view");
			CompactadorBLL.criaDiretorio(dirBase+"/dao");
			CompactadorBLL.criaDiretorio(dirBase+"/view/assets");
			CompactadorBLL.criaDiretorio(dirBase+"/view/assets/html");
			CompactadorBLL.criaDiretorio(dirBase+"/controller");
			*/
			
			int tmtoexport = lsttab.get(0).getExportsto().length;				
			for(int y=0;y<tmtoexport;y++){	
				String tmpExport = lsttab.get(0).getExportsto()[y];
				//String tmpPath = dirBase+"/"+this.dao.getTipo(tmpExport);
								
				//CompactadorBLL.criaDiretorio(tmpPath);				
				for(int x =0 ;x < tmT;x++){	
					if(lsttab.get(x).getAllCampos().size()>0){
						String tmpPath = dirBase;
						String tmpNameFile = lsttab.get(x).getNome();						
						tmpPath=tmpPath+"/"+tmpNameFile.toLowerCase();	
						CompactadorBLL.criaDiretorio(tmpPath);
						CompactadorBLL.criaDiretorio(tmpPath+"/view");						
						lsttab.get(x).setTpTemplate(this.dao.getTipo(tmpExport));												
						if(tmpExport.equals(TabelaDAO.TP_JAVA)||tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_NODE_SCHEMA)||tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_NODE_INTERFACE)){
							if(tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_NODE_INTERFACE)){
								tmpNameFile = "I"+tmpNameFile;
							}else if(tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_NODE_SCHEMA)){
								tmpNameFile = tmpNameFile.toLowerCase();
							};	
							CompactadorBLL.criaDiretorio(tmpPath+"/model");
							CompactadorBLL.criaArquivo(tmpPath+"/model/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
						}else if(tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_VIEW)){
							CompactadorBLL.criaArquivo(tmpPath+"/view/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
						}else if(tmpExport.equals(TabelaDAO.TP_HTML_ITEMVIEW)){
							tmpNameFile = tmpNameFile.toLowerCase();							
							CompactadorBLL.criaDiretorio(tmpPath+"/view/assets");
							CompactadorBLL.criaDiretorio(tmpPath+"/view/assets/html");							
							CompactadorBLL.criaArquivo(tmpPath+"/view/assets/html/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
						}else if(tmpExport.equals(TabelaDAO.TP_TYPESCRIPT_BLL)||tmpExport.equals(TabelaDAO.TP_BLL)){
							CompactadorBLL.criaDiretorio(tmpPath+"/controller");							
							CompactadorBLL.criaArquivo(tmpPath+"/controller/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));							
						}else if(tmpExport.equals(TabelaDAO.TP_DAO)){
							CompactadorBLL.criaDiretorio(tmpPath+"/dao");
							CompactadorBLL.criaArquivo(tmpPath+"/dao/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
						}else{
							CompactadorBLL.criaDiretorio(tmpPath+"/others");							
							CompactadorBLL.criaArquivo(tmpPath+"/others/"+tmpNameFile+"."+this.dao.getExtencao(tmpExport), this.dao.gerarCodigo(lsttab.get(x),tmpExport));
						};			
					};
				};
				//System.out.println(tmpPath+".zip");
				//CompactadorBLL.compactarPasta(tmpPath+".zip",tmpPath);
			};	
			//System.out.println(dirBase+nameOfDir+".zip");
			//CompactadorBLL.compactarPasta(dirBase+".zip",dirBase);
			
		};		
		//return "";
		//System.out.println(stbS);	
		String[] rs = {nameOfDir,dirTmp};
		return rs;
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
