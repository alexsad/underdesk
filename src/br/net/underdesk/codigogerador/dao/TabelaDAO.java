package br.net.underdesk.codigogerador.dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.StringWriter;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import com.google.gson.Gson;

import br.net.underdesk.codigogerador.model.Tabela;
import br.net.underdesk.codigogerador.model.RequestC;
import br.net.underdesk.util.ConexaoDB;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TabelaDAO {
	public final static String TP_HBM = "HBM";
	public final static String TP_JAVA = "JAVA";
	public final static String TP_DAO = "DAO";
	public final static String TP_BLL = "BLL";
	public final static String TP_JS = "JS";
	public final static String TP_JSMOOLTOOLS = "JSMOOLTOOLS";
	public final static String TP_INDEX = "HTML";
	public final static String TP_HBC = "HBC";
	public final static String TP_UML = "UML";
	public final static String TP_STB = "STBJSON";
	
	Gson gson = null;	
	private String urlTemplates =  "br/net/underdesk/codigogerador/view/templates/";
	
	
	
	private String[][] ordemP = {{"idTabela", "asc"}};
	public List<Tabela> get() {
		return (List<Tabela>) ConexaoDB.get(Tabela.class,true,1,100,null,ordemP);
	}
	
	public List<Tabela> getByDsTabela(String dsTabela){		
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("dsTabela", dsTabela);
		return (List<Tabela>) ConexaoDB.get(Tabela.class,true,1,100,params,ordemP);
	}
	
	
	
	
	private String getPackageUrl(Tabela cls){    	
	    return cls.getDominio().replaceAll("[.]","/");   	
	}
	public String gerarCodigo(Tabela tabelaC,String tipoTemplate){	
		VelocityContext context = new VelocityContext();
		String local = this.urlTemplates+tipoTemplate;
		VelocityEngine ve = new VelocityEngine();
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		StringWriter writer = new StringWriter();
		try {
			ve.init();
			Template t = ve.getTemplate(local+".vm"); 	
			context.put("project_name","underdesk");
			context.put("project_desc","underdesk");			
			context.put("pacote",this.getPackageUrl(tabelaC));	
			context.put("pacote_url",tabelaC.getPacote().replaceAll("[.]","/"));
			context.put("tab", "\t");
			context.put("classe",tabelaC);
			t.merge(context, writer);		
			//System.out.println("ex:\n"+writer.toString());
		} catch (Exception e) {
			return "erro: "+e.getMessage().toUpperCase();
		}
		return writer.toString();
	}
	
	
	public Tabela getByIdTabela(String urlc,int idTabela){
		RequestC requestCTMP = null;
		urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+urlc;
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			requestCTMP = gson.fromJson(br, RequestC.class); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return null;
		}	
		return requestCTMP.getRs().get(idTabela-1);
    }
	
    public boolean insert(Tabela t){
		RequestC requestCTMP = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			requestCTMP = gson.fromJson(br, RequestC.class); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return false;
		}		
		int tmmax = requestCTMP.getRs().size();		
		t.setIdTabela(tmmax+1);
		t.setCaminho("");
		requestCTMP.getRs().add(t);
		
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(requestCTMP);
    		br = new BufferedWriter(new FileWriter(new File(urlc)));
    		br.write(ret); 
    		br.close();        	
        } catch (Exception ex) {
            System.out.println("erro ao criar o arquivo:"+ex.getMessage().toString());
            return false;
        }    	
    	return true;
       
    }
    public boolean update(Tabela t){
		RequestC requestCTMP = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			requestCTMP = gson.fromJson(br, RequestC.class); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return false;
		}		
			
		if(t.getCampo().size()==0){
			Tabela t1 = this.getByIdTabela(t.getCaminho(),t.getIdTabela());
			t.setCampo(t1.getCampo());
		}
		t.setCaminho("");
		//requestCTMP.getRs().remove(t.getIdTabela()-1);
		requestCTMP.getRs().set(t.getIdTabela()-1, t);
		//requestCTMP.getRs().get(t.getIdTabela()-1) = t;
		
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(requestCTMP);
    		br = new BufferedWriter(new FileWriter(new File(urlc)));
    		br.write(ret); 
    		br.close();        	
        } catch (Exception ex) {
            System.out.println("erro ao criar o arquivo:"+ex.getMessage().toString());
            return false;
        }    	
    	return true;
    }
    public boolean delete(Tabela t){
		RequestC requestCTMP = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			requestCTMP = gson.fromJson(br, RequestC.class); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return false;
		}		
			
		/*
		Tabela t1 = this.getByIdTabela(t.getCaminho(),t.getIdTabela());
		t.setCampo(t1.getCampo());
		*/
		ArrayList<Tabela> tlst = requestCTMP.getRs();
		tlst.remove(t.getIdTabela()-1);
		//requestCTMP.getRs().set(t.getIdTabela()-1, t);
		//requestCTMP.getRs().get(t.getIdTabela()-1) = t;
		
		int tmmax = tlst.size();	
		for(int x=0;x<tmmax;x++){
			tlst.get(x).setIdTabela(x+1);
		}
		
		requestCTMP.setRs(tlst);
		
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(requestCTMP);
    		br = new BufferedWriter(new FileWriter(new File(urlc)));
    		br.write(ret); 
    		br.close();        	
        } catch (Exception ex) {
            System.out.println("erro ao criar o arquivo:"+ex.getMessage().toString());
            return false;
        }    	
    	return true;
    }
}
