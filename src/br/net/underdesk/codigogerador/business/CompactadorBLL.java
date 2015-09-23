package br.net.underdesk.codigogerador.business;

import java.io.BufferedInputStream; import java.io.BufferedOutputStream; import java.io.File; import java.io.FileInputStream; import java.io.FileOutputStream; import java.io.FileWriter;
import java.io.IOException; import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.zip.ZipEntry; import java.util.zip.ZipOutputStream;

public class CompactadorBLL {
	
	static final int TAMANHO_BUFFER = 4096; // 4kb     
	private static PrintWriter gravarArq;

	// método para compactar arquivo
	public static void compactarParaZip(String arqSaida, String arqEntrada)
			throws IOException {
		int cont;
		byte[] dados = new byte[TAMANHO_BUFFER];
		BufferedInputStream origem = null;
		FileInputStream streamDeEntrada = null;
		FileOutputStream destino = null;
		ZipOutputStream saida = null;
		ZipEntry entry = null;
		try {
			destino = new FileOutputStream(new File(arqSaida));
			saida = new ZipOutputStream(new BufferedOutputStream(destino));
			File file = new File(arqEntrada);
			streamDeEntrada = new FileInputStream(file);
			origem = new BufferedInputStream(streamDeEntrada, TAMANHO_BUFFER);
			entry = new ZipEntry(file.getName());
			saida.putNextEntry(entry);
			while ((cont = origem.read(dados, 0, TAMANHO_BUFFER)) != -1) {
				saida.write(dados, 0, cont);
			}
			origem.close();
			saida.close();
		} catch (IOException e) {
			throw new IOException(e.getMessage());
		}
	}
    public static void criaDiretorio(String novoDiretorio){         
        try { 
             if (!Paths.get(novoDiretorio).toFile().exists()) { // Verifica se o diretório existe.   
                 (new File(novoDiretorio)).mkdir();   // Cria o diretório   
             }   
        } catch (Exception ex) {   
            System.out.println("Erro ao criar o diretório" + ex.toString());   
        }  
    }  
    public static void criaArquivo(String nmArquivo,String conteudo){         
    	FileWriter arq;
		try {
			arq = new FileWriter(nmArquivo);
			gravarArq = new PrintWriter(arq);
		    gravarArq.printf(conteudo);
		    arq.close();
		} catch (IOException e){			
			e.printStackTrace();
		}       
      }  
	 public static void compactarPasta (String arqSaida ,String pathEntrada) {   
	        int i, cont;   
	        byte[] dados = new byte[TAMANHO_BUFFER];   
	        String arquivos[];   
	        File f = null;   
	        BufferedInputStream origem = null;   
	        FileInputStream streamDeEntrada = null;   
	        FileOutputStream destino = null;   
	        ZipOutputStream saida = null;   
	        ZipEntry entry = null;  
	          
	        try {   
	            destino = new FileOutputStream(arqSaida);   
	            saida = new ZipOutputStream(new BufferedOutputStream(destino));  
	            f = new File(pathEntrada); // Todos os arquivos da pasta onde a classe está   
	            arquivos = f.list();  
	              
	            for (i = 0; i < arquivos.length; i++) {   
	                File arquivo = new File(pathEntrada+"\\"+arquivos[i]);   
	               // arquivos[i].isFile();
	                if (arquivo.isFile() && !(arquivo.getName()).equals(arqSaida)) {   
	                    System.out.println("Compactando: " + arquivos[i]);   
	   
	                    streamDeEntrada = new FileInputStream(arquivo);   
	                    origem = new BufferedInputStream(streamDeEntrada, TAMANHO_BUFFER);   
	                    entry = new ZipEntry(arquivos[i]);   
	                    saida.putNextEntry(entry);  
	                      
	                    while((cont = origem.read(dados, 0, TAMANHO_BUFFER)) != -1) {   
	                        saida.write(dados, 0, cont);   
	                    }   
	   
	                    origem.close();   
	                }   
	            }   
	   
	            saida.close();  
	               
	        } catch(Exception e) {   
	            e.printStackTrace();   
	        }   
	    }//fim compactar()   

}
