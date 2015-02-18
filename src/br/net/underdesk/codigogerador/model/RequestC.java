package br.net.underdesk.codigogerador.model;

import java.util.ArrayList;


public class RequestC {
	int idRequest;	
	int t;
	int tk;
	String format;
	String callback;
	ArrayList<String> erro = new ArrayList<String>();
	String s;
	boolean cache;
	String tipo;
	ArrayList<Tabela> rs = new ArrayList<Tabela>();
	public RequestC() {
		super();
	}
	public ArrayList<Tabela> getRs() {
		return rs;
	}
	public void setRs(ArrayList<Tabela> rs) {
		this.rs = rs;
	}
	public int getIdRequest() {
		return idRequest;
	}
	public void setIdRequest(int idRequest) {
		this.idRequest = idRequest;
	}
	
}
