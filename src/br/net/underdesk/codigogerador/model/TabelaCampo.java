package br.net.underdesk.codigogerador.model;

public class TabelaCampo {
	int idTabela;
	String caminho;
	int idTabelaCampo;
	String campo;
	String tipo;
	String dsCampo;
	int limite;
	String snNull = "N";

	public TabelaCampo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TabelaCampo(int idTabelaCampo, String campo, String tipo, String dsCampo,
			int limite, String snPrimaryKey, String generationType,
			String snNull) {
		super();
		this.idTabelaCampo = idTabelaCampo;
		this.campo = campo;
		this.tipo = tipo;
		this.dsCampo = dsCampo;
		this.limite = limite;
		this.snNull = snNull;
	}

	public boolean isFk() {
		return !this.getFkService().equals("");
	}

	public String getFkService() {
		String colunaT = this.campo.toLowerCase();
		if (colunaT.indexOf("_fk") > 0) {
			return colunaT.substring(colunaT.indexOf("_") + 1,
					colunaT.indexOf("_fk"));
		}
		return "";
	}

	public String getFkServiceConstrutor() {
		String nomeT = this.capitalize(this.getFkService().toLowerCase());
		int posi = nomeT.indexOf("_");
		while (posi > -1) {
			String l = nomeT.charAt(posi + 1) + "";
			nomeT = nomeT.replaceFirst("_" + l, l.toUpperCase());
			posi = nomeT.indexOf("_");
		}
		return nomeT;
	}



	public String getSnNull() {
		return snNull;
	}

	public void setSnNull(String snNull) {
		this.snNull = snNull;
	}

	public String getColuna() {
		String colunaT = this.campo.toLowerCase();
		int posi = colunaT.indexOf("_");
		while (posi > -1) {
			String l = colunaT.charAt(posi + 1) + "";

			colunaT = colunaT.replaceFirst("_" + l, l.toUpperCase());
			posi = colunaT.indexOf("_");
		}
		return colunaT;
	}

	public String getColunaLogical() {
		return this.campo;
	}

	public String getColunaCapitalize() {
		return this.capitalize(this.getColuna());
	}

	public void setColuna(String coluna) {
		this.campo = coluna;
	}

	public String getTipo() {
		String tipoS = "String";
		if (this.tipo.toUpperCase().contains("INT")) {
			tipoS = "int";
		} else if (this.tipo.toUpperCase().contains("DATE")) {
			tipoS = "Date";
		} else if (this.tipo.toUpperCase().contains("DECIMAL")) {
			tipoS = "BigDecimal";
		} else if (this.tipo.toUpperCase().contains("FLOAT")) {
			tipoS = "float";
		}
		return tipoS;
	}
	public String getSQLTipo() {
		return this.tipo.toUpperCase();
	}	
	public String getTipoImport() {
		String tipoS = "String";
		if (this.getTipo().equals("int")) {
			tipoS = "int";
		} else if (this.getTipo().equals("Date")) {
			tipoS = "java.util.Date";
		} else if (this.getTipo().equals("BigDecimal")) {
			tipoS = "java.math.BigDecimal";
		} else if (this.getTipo().equals("float")) {
			tipoS = "float";
		}
		return tipoS;
	}
	public String getTipoSimple() {
		String tipoS = this.getTipo();
		if (this.getTipo().equals("BigDecimal")) {
			tipoS = "big_decimal";
		}
		return tipoS.toLowerCase();
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	private String capitalize(String line) {
		return Character.toUpperCase(line.charAt(0)) + line.substring(1);
	}
	public int getIdTabelaCampo() {
		return idTabelaCampo;
	}
	public void setIdTabelaCampo(int idTabelaCampo) {
		this.idTabelaCampo = idTabelaCampo;
	}
	public String getCampo() {
		return campo;
	}
	public void setCampo(String campo) {
		this.campo = campo;
	}
	public String getDsCampo() {
		return dsCampo;
	}
	public void setDsCampo(String dsCampo) {
		this.dsCampo = dsCampo;
	}
	public int getLimite() {
		return limite;
	}
	public void setLimite(int limite) {
		this.limite = limite;
	}
	public int getIdTabela() {
		return idTabela;
	}
	public void setIdTabela(int idTabela) {
		this.idTabela = idTabela;
	}
	public String getCaminho() {
		return caminho;
	}
	public void setCaminho(String caminho) {
		this.caminho = caminho;
	}	
}
