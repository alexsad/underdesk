package br.net.underdesk.arquivo.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import br.net.underdesk.arquivo.model.Arquivo;

@Component
public class ArquivoDAO {
	public List<Arquivo> get(){
		return new ArrayList<Arquivo>();
	}
	public List<Arquivo> getByPath(String urlpath){
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+urlpath;
		
		List<Arquivo> lsarquivos = new ArrayList<Arquivo>();
		File file = new File(urlc); 
		File afile[] = file.listFiles(); 
		int j = afile.length; 
		for (int i = 0; i < j; i++) { 
			File arquivo = afile[i]; 
			//System.out.println(arquivo.getName()); 
			String isdir = (arquivo.isDirectory())?"S":"N";
			String caminho = urlpath+arquivo.getName();
			caminho += (isdir.equals("S"))?"/":"";
			Arquivo tmpArq = new Arquivo(i+1,100, arquivo.getName(),isdir,caminho);
			tmpArq.setIcone((isdir.equals("S"))?"folder-close":"file");	
			if(!isdir.equals("S")){
				if(arquivo.getName().indexOf("_uml.json")>-1){
					tmpArq.setIcone("tags");
				}else if(arquivo.getName().lastIndexOf(".zip") == (arquivo.getName().length()-4)){
					tmpArq.setIcone("compressed");
				};			
			}
			lsarquivos.add(tmpArq);
		}		
		return lsarquivos;
	}
}
