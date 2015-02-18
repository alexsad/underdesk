package br.net.underdesk.arquivo.business;
import java.util.List;

import under.wsl.service.Service;
import br.net.underdesk.arquivo.dao.ArquivoDAO;
import br.net.underdesk.arquivo.model.Arquivo;

public class ArquivoBLL {
	ArquivoDAO dao = null;
	public ArquivoBLL(){
		this.dao = new ArquivoDAO();
	}
	@Service(cache=true)
	public List<Arquivo> get(){
		return this.dao.get();
	}
	@Service(cache=false)
	public List<Arquivo> getByPath(String urlpath){
		return this.dao.getByPath(urlpath);
	}
}
