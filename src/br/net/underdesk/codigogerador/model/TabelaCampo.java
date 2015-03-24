package br.net.underdesk.codigogerador.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@Entity(name="TabelaCampo")
@Immutable
@Subselect("select "
		+ "column_name as id_row "
		+ ",@rownum2:=@rownum2+1 as id_tabela_campo "
		+ ",table_name as ds_tabela "
		+ ",column_name as campo "
		+ ",column_name as ds_campo "
		+ ",if(is_nullable='YES','S','N') as sn_null "
		+ ",data_type as tipo "
		+ ",ifnull(character_maximum_length,10) as limite "
		+ ",column_key "
		+ ",'' as caminho "
		+ "from " 
		+" (SELECT @rownum2:=0) x"
		+" ,information_schema.columns " 
		+" where" 
		+" table_schema=database()")
public class TabelaCampo {
	@Id
	@Column(name="id_row")
	private String idRow;
	@Column(name="id_tabela_campo")
	private int idTabelaCampo;
	@Column(name="ds_tabela")
	private String dsTabela;
	@Transient
	private int idTabela;
	@Column(name="caminho")
	private String caminho;
	@Column(name="campo")
	private String campo;
	@Column(name="tipo")
	private String tipo;
	@Column(name="ds_campo")
	private String dsCampo;
	@Column(name="limite")
	private int limite;
	@Column(name="sn_null")
	private String snNull = "N";

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
		if (colunaT.indexOf("id") == 0) {
			return colunaT;
		}
		return "";
	}

	public String getFkServiceConstrutor() {
		String nomeT = this.capitalize(this.getFkService().toLowerCase().replace("id_",""));
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

	public String getDsTabela() {
		return dsTabela;
	}

	public void setDsTabela(String dsTabela) {
		this.dsTabela = dsTabela;
	}
}
