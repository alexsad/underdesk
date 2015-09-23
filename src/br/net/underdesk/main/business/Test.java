package br.net.underdesk.main.business;

import br.net.underdesk.codigogerador.business.CompactadorBLL;

public class Test {

	public static void main(String[] args) {
		try {
			String dirBase = "/mnt/arquivos/tmp/gen/";
			//CompactadorBLL.compactarParaZip("C:\\temp\\zipado.zip", "C:\\temp\\resol.pdf");
			CompactadorBLL.compactarPasta(dirBase+"zipadopasta.zip",dirBase);
			
			//CompactadorBLL.criaDiretorio(dirBase+"tozip");
			//CompactadorBLL.criaArquivo(dirBase+"tozip/teste.txt","vamo ver se sim funciona?");
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
