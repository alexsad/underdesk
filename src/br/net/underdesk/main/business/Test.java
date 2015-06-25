package br.net.underdesk.main.business;

import br.net.underdesk.codigogerador.business.CompactadorBLL;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			//CompactadorBLL.compactarParaZip("C:\\temp\\zipado.zip", "C:\\temp\\resol.pdf");
			CompactadorBLL.compactarPasta("C:\\temp\\zipadopasta.zip","C:\\temp\\zipado");
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
