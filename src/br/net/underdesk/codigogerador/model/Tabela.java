package br.net.underdesk.codigogerador.model;

import java.util.ArrayList;
public class Tabela {
	int idTabela;
	String dsTabela;
    String dominio;
    String pacote;
    String tipo;
    String chavePrimaria;
    String tpGeracao;
    String caminho;
    ArrayList<String> imports = new ArrayList<String>();
	ArrayList<TabelaCampo> campo = new ArrayList<TabelaCampo>();
	public Tabela() {
		super();
	}	
    
    public Tabela(int idTabela, String dsTabela, String dominio, String pacote,
			String tipo, String chavePrimaria, String tpGeracao) {
		super();
		this.idTabela = idTabela;
		this.dsTabela = dsTabela;
		this.dominio = dominio;
		this.pacote = pacote;
		this.tipo = tipo;
		this.chavePrimaria = chavePrimaria;
		this.tpGeracao = tpGeracao;
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
        campotmp = (ArrayList<TabelaCampo>) this.getCampo().clone();
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
}