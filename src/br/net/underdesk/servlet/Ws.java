/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package br.net.underdesk.servlet;

//import br.net.underdesk.util.ConexaoDB;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import under.wsl.controle.Controlador;

/**
 *
 * @author alex
 */
public class Ws extends HttpServlet {

private static final long serialVersionUID = 1L;
    protected void processRequest(HttpServletRequest request, HttpServletResponse response){
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = null;         
        int idRequest = Integer.parseInt(request.getParameter("idRequest"));
        try {
         out = response.getWriter();        
         //ConexaoDB.iniciarSessao();        
         
         
         
         Controlador.getInstancia().deployWS(request.getParameterMap(),"br.net.underdesk");
         
			
         
         //ConexaoDB.fecharSesssao();
         }catch(Exception ex){
             Controlador.getInstancia().addErro(ex.getMessage().toString());
             System.out.println("erro:"+ex.getMessage().toString());
         }finally {
             out.print(Controlador.getInstancia().getResult(idRequest));
             out.close();
         }
     }
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
