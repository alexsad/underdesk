package br.net.underdesk.codigogerador.model;

import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@Entity(name="Tabela")
@Immutable
@Subselect(" SELECT  UNIX_TIMESTAMP(update_time) as  id_tabela "
		+ ",table_name as ds_tabela "
		+ ",'table' as tipo"
		+ " ,concat('id_',table_name) as chave_primaria "
		+ ",REPLACE(table_name,'_','') as dominio "
		+ ",'increment' as tp_geracao  "
		+ ",'STBJSON' as tp_template "
		+ ",'' as caminho ,concat('br.net.',DATABASE()) as pacote "
		+ "FROM information_schema.TABLES"
		+ " WHERE"
		+ " TABLE_SCHEMA=DATABASE()")
public class Tabela {
	@Id
	@Column(name="id_tabela")
	private int idTabela;
	@Column(name="tp_template")
	private String tpTemplate;
	@Column(name="caminho")
	private String caminho;
	@Column(name="ds_tabela")
	private String dsTabela;
	@Column(name="dominio")
	private String dominio;
	@Column(name="pacote")
	private String pacote;
	@Column(name="tipo")
	private String tipo;
	@Column(name="chave_primaria")
	private String chavePrimaria;
	@Column(name="tp_geracao")
	private String tpGeracao;
	
	@Transient
	private ArrayList<String> imports = new ArrayList<String>();
	@Transient
	private ArrayList<TabelaCampo> campo = new ArrayList<TabelaCampo>();
	
	public Tabela() {
		super();
	}	

	public int getIdTabela() {
		return idTabela;
	}
	public void setIdTabela(int idTabela) {
		this.idTabela = idTabela;
	}
	public String getDsTabela() {
		return dsTabela;
	}
	public void setDsTabela(String dsTabela) {
		this.dsTabela = dsTabela;
	}
	public String getDominio() {
		return dominio;
	}
	public void setDominio(String dominio) {
		this.dominio = dominio;
	}
	
	public String getPacote() {
		return this.pacote;
	}
	
	public void setPacote(String pacote) {
		this.pacote=pacote;
	}
	
	
	public void setCampo(ArrayList<TabelaCampo> campo) {
		this.campo = campo;
	}
	public TabelaCampo getPrimaryKey() {    	
        return this.campo.get(0);
    }
    public void setPrimaryKey(TabelaCampo primaryKey) {
    	
    }        
    public String getNomeAlias() {
        String nomeT = this.dsTabela.toLowerCase();
        int posi = nomeT.indexOf("_");
        String inicias = nomeT.charAt(0)+"";
        while(posi>-1){
            String l = nomeT.charAt(posi+1)+"";
            nomeT = nomeT.replaceFirst("_"+l,l.toUpperCase());
            posi = nomeT.indexOf("_");
            inicias+=l;
        }
        return inicias;            
	}
        
	public String getNome() {
            String nomeT = this.capitalize(this.dsTabela.toLowerCase());
            int posi = nomeT.indexOf("_");
            while(posi>-1){
                String l = nomeT.charAt(posi+1)+"";
                nomeT = nomeT.replaceFirst("_"+l,l.toUpperCase());
                posi = nomeT.indexOf("_");
            }
            return nomeT;            
	}
    public String getNomeLogical() {
            return this.dsTabela;
	}
	public ArrayList<TabelaCampo> getCampo() {
		return campo;
	}
    public ArrayList<TabelaCampo> getAllCampos() {
        ArrayList<TabelaCampo> campotmp = null;
        try{
        	campotmp = (ArrayList<TabelaCampo>) this.getCampo().clone();
        }catch(Exception e){
        	System.out.println(e.getMessage().toString());
        }
        /*
        if(!this.getTipo().equals("view")){
            campotmp.add(0,this.getPrimaryKey());
        }
        */
        return campotmp;
	}
	public void addCampo(TabelaCampo campo) {
		if(campo.getTipo().equals("BigDecimal")){
			this.addImport("java.math.BigDecimal");
		}else if(campo.getTipo().equals("Date")){
			this.addImport("java.util.Date");
		} 
		this.campo.add(campo);
	}
	private void addImport(String importep){
		boolean achou = false;
		int tmi = this.imports.size();
		for(int x=0;x<tmi;x++){
			if(this.imports.get(x).equals(importep)){
				achou=true;
				break;
			}
		}
		if(!achou){
			this.imports.add(importep);
		}
	}
	
    public ArrayList<String> getImports() {
		return imports;
	}
	private String capitalize(String line){
	  return Character.toUpperCase(line.charAt(0)) + line.substring(1);
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public String getChavePrimaria() {
		return chavePrimaria;
	}
	public void setChavePrimaria(String chavePrimaria) {
		this.chavePrimaria = chavePrimaria;
	}
	public String getTpGeracao() {
		return tpGeracao;
	}
	public void setTpGeracao(String tpGeracao) {
		this.tpGeracao = tpGeracao;
	}
	public String getCaminho() {
		return caminho;
	}
	public void setCaminho(String caminho) {
		this.caminho = caminho;
	}

	public String getTpTemplate() {
		return tpTemplate;
	}

	public void setTpTemplate(String tpTemplate) {
		this.tpTemplate = tpTemplate;
	}

	public void setImports(ArrayList<String> imports) {
		this.imports = imports;
	}	
	
}