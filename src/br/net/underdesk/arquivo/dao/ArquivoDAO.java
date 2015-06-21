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
			
			lsarquivos.add(new Arquivo(i+1,100, arquivo.getName(),isdir,caminho));
		}
		if(urlpath.lastIndexOf("/") > 1){
			lsarquivos.add(new Arquivo(j+2,0,"/","S","/"));
			lsarquivos.add(new Arquivo(j+1,0,"...","S",urlpath.substring(0,urlpath.length()-2).replaceAll("\\/\\w*$","")+"/"));
		}
		
		return lsarquivos;
	}
}
