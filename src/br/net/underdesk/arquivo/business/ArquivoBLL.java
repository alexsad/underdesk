package br.net.underdesk.arquivo.business;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import br.net.underdesk.arquivo.dao.ArquivoDAO;
import br.net.underdesk.arquivo.model.Arquivo;

@RestController
@RequestMapping(value="/arquivo/arquivo")
public class ArquivoBLL {
	@Autowired
	private ArquivoDAO dao;

	@RequestMapping(method=RequestMethod.GET)
	public List<Arquivo> get(){
		return this.dao.get();
	}
	
	@RequestMapping(value="/getByPath",method=RequestMethod.GET)
	public List<Arquivo> getByPath(@RequestParam(value = "urlpath") String urlpath){
		return this.dao.getByPath(urlpath);
	}
}
