package br.net.underdesk.arquivo.model;

public class Arquivo {
	private int idArquivo;
	private int tmArquivo;
	private String dsArquivo;
	private String snPasta;
	private String caminho;
	
	public Arquivo(int idArquivo, int tmArquivo, String dsArquivo, String snPasta,String caminho) {
		super();
		this.idArquivo = idArquivo;
		this.tmArquivo = tmArquivo;
		this.dsArquivo = dsArquivo;
		this.snPasta = snPasta;
		this.caminho = caminho;
	}
	public Arquivo() {
		super();
	}
	public int getIdArquivo() {
		return idArquivo;
	}
	public void setIdArquivo(int idArquivo) {
		this.idArquivo = idArquivo;
	}
	public int getTmArquivo() {
		return tmArquivo;
	}
	public void setTmArquivo(int tmArquivo) {
		this.tmArquivo = tmArquivo;
	}
	public String getDsArquivo() {
		return dsArquivo;
	}
	public void setDsArquivo(String dsArquivo) {
		this.dsArquivo = dsArquivo;
	}
	public String getSnPasta() {
		return snPasta;
	}
	public void setSnPasta(String snPasta) {
		this.snPasta = snPasta;
	}
	public String getCaminho(){
		return this.caminho;
	}
	public void setCaminho(String caminho){
		this.caminho = caminho;
	}
}
