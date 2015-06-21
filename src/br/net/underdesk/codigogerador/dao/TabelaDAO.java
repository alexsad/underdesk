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
import org.springframework.stereotype.Repository;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import br.net.underdesk.codigogerador.model.Tabela;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class TabelaDAO {
	
	@PersistenceContext()
	private EntityManager manager;
	
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

	public List<Tabela> get() {
		return manager.createQuery("From Tabela t order by t.idTabela asc", Tabela.class).getResultList();
	}

	public List<Tabela> getByDsTabela(String dsTabela){		
		return manager.createQuery("From Tabela t where t.dsTabela = :dsTabela order by t.idTabela asc", Tabela.class)
		.setParameter("dsTabela", dsTabela)
		.getResultList();		
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
		List<Tabela> lst = null;
		urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+urlc;
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			Type listType = new TypeToken<ArrayList<Tabela>>(){
            }.getType();
			lst = gson.fromJson(br,listType); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return null;
		}	
		return lst.get(idTabela-1);
    }
	
    public boolean insert(Tabela t){
    	List<Tabela> lst = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			Type listType = new TypeToken<ArrayList<Tabela>>(){
            }.getType();
			lst = gson.fromJson(br,listType); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return false;
		}		
		int tmmax = lst.size();		
		t.setIdTabela(tmmax+1);
		t.setCaminho("");
		lst.add(t);
		
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(lst);
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
    	List<Tabela> lst = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			Type listType = new TypeToken<ArrayList<Tabela>>(){
            }.getType();
			lst = gson.fromJson(br,listType);  
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
		lst.set(t.getIdTabela()-1, t);
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(lst);
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
    	List<Tabela> lst = null;
		String urlc = this.getClass().getResource("/").getFile().replace("WEB-INF/classes/","")+t.getCaminho();
		if(gson == null){
			gson = new Gson(); 
		}
		try{
			BufferedReader br = new BufferedReader(new FileReader(urlc));  
			Type listType = new TypeToken<ArrayList<Tabela>>(){
            }.getType();
			lst = gson.fromJson(br,listType); 
			br.close();
		}catch(Exception e){
			System.out.println("erro: "+e.getMessage().toUpperCase());
		 	return false;
		}
		List<Tabela> tlst = lst;
		tlst.remove(t.getIdTabela()-1);	
		int tmmax = tlst.size();	
		for(int x=0;x<tmmax;x++){
			tlst.get(x).setIdTabela(x+1);
		}		
		BufferedWriter br = null;  
        try {        	
    		String ret = gson.toJson(tlst);
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
