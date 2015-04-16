package br.net.underdesk.util;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
//import org.hibernate.FlushMode;
import org.hibernate.SessionFactory;
//import org.hibernate.StatelessSession;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import under.wsl.controle.Controlador;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 * Hibernate Utility class with a convenient method to get Session Factory object.
 * @author alexandre.araujo
 */
public class ConexaoDB{
	private static SessionFactory sf;
	private static ThreadLocal<Session> threadSession = new ThreadLocal<Session>();
	public static void inicializa() {
        try {
        	 sf = new Configuration()       
             .configure("/hibernate.cfg.xml")
             .buildSessionFactory();
        } catch (Throwable ex) {
        	onError("erro no init:"+ex.getMessage().toString(),false);
        	throw new ExceptionInInitializerError(ex);
        }
    }	
	public static SessionFactory getSessionFactory(){
		return sf;
	}
    public static void fechaSessao() {
        try {
            Session s = (Session) threadSession.get();
            threadSession.set(null);
            if (s != null && s.isOpen()) {
                s.close();
            }
        } catch (Exception e) {
        	onError("Falha ao fechar a sessao: " + e.toString());
        }
    }
	public static Session getSession(){
		 Session s = null;
	        try {
	            if (sf == null) {
	                inicializa();
	                fechaSessao();
	            }
	 
	            s = (Session) threadSession.get();
	 
	            if (s == null) {
	                s = sf.openSession();
	                threadSession.set(s);
	            }
	        } catch (Exception e) {
	            onError("Falha ao recuperar a sessao: " + e.toString(),false);
	        }
	        return s;		
		//return getSessionFactory().getCurrentSession();
	}	
	
	public static void limpaSessao() {
        try {
            Session s = getSession();
            s.clear();
        } catch (Exception e) {
        	onError("Falha ao limpar a sessao: " + e,false);
        }
    }
	
	private static void openFactory(boolean commit){
		/*
		s = sf.openStatelessSession();
		if (commit){
			t = s.beginTransaction();
		}
		*/		
		/*
		if(getSession() == null || !getSession().isOpen()){
			//if(ConexaoDB.getSessionFactory().isClosed()||ConexaoDB.getSessionFactory()==null){
				//ConexaoDB.getSessionFactory().openSession();
			//}else{
				ConexaoDB.getSessionFactory().openSession();
			//}			
			//ConexaoDB.getSessionFactory().getCurrentSession().beginTransaction();
		}
		*/
		/*if(commit){
			if(getSession().getTransaction()==null||!getSession().getTransaction().isActive()){
				getSession().beginTransaction();
			}
		}*/	
		/*
		if(t==null||!t.isActive()){
			Transaction t = getSession().beginTransaction();
		}
		*/
	}
	private static void openFactory(){
		openFactory(false);
	}
	public static void close(){
		/*
		if (getSession() != null && getSession().isOpen()) {
			getSession().close();
			//getSessionFactory().getCurrentSession().clear();
		}
		*/
	}
	private static void closeFactory(boolean commit){
		//usado para metodos com commit
		/*
		if (commit){
			//t.commit();
			//getSession().getTransaction().commit();
			//getSessionFactory().getCurrentSession().clear();			
			if(t!=null && t.isActive()){
				t.commit();
			}
		}
		close();
		*/
		//s.close();
		/*
		if(t!=null && t.isActive()){
			t.commit();
		}
		*/
	}
	public static void removeFromSession(Object o){
		getSession().evict(o);	
	}
	private static void onError(String e, boolean rollback){
		Controlador.getInstancia().addErro(e);
		if (rollback){
			getSession().getTransaction().rollback();
		}
	}
	private static void onError(String e){
		onError(e, true);
	}
	
	public static List<?> getById(Class<?> c, Integer id){		
		try {
			openFactory();
			getSession().beginTransaction();
			return getSession().createCriteria(c).add(Restrictions.idEq(id)).list();
		} catch (Exception e) {
			onError("erro ao listar no db: "+e.getMessage().toString(), false);
			return new ArrayList<>();
		} finally {
			close();
		}
	}
	private static List<?> getByOrder(Class<?> c,Order order){
		
		try {
			openFactory();
			getSession().beginTransaction();
			return getSession().createCriteria(c).addOrder(order).setMaxResults(1).list();
		} catch (Exception e) {
			onError("erro ao listar no db: "+e.getMessage().toString(), false);
			return new ArrayList<>();
		} finally {
			close();
		}
	}
	public static List<?> getLast(Class<?> c,String field){
		return getByOrder(c,Order.desc(field));		
	}
	
	public static List<?> getFirst(Class<?> c,String field){
		return getByOrder(c,Order.asc(field));
	}
	
	
	public static boolean add(Object o){
		Transaction t = null;
		try {
			openFactory(true);
			t = getSession().beginTransaction();
			getSession().save(o);
			t.commit();
			//s.insert(o);
			
			return true;
		} catch (Exception e) {
			onError( "erro ao salvar no db: "+e.getMessage().toString());
			return false;
		} finally {
			closeFactory(true);
		}
	}    
	public static boolean editar(Object o){
		Transaction t = null;
		try { 
			openFactory(true);
			t = getSession().beginTransaction();
			getSession().saveOrUpdate(o);
			t.commit();
			//s.update(o); 
			return true;
		} catch (Exception e) {
			onError("erro ao salvar no db: "+e.getMessage().toString());
			return false;
		} finally {
			closeFactory(true);
		}
	}
  
	public static boolean deletar(Object object){
		Transaction t = null;
		try {
			openFactory(true);
			t = getSession().beginTransaction();
			getSession().delete(object);
			t.commit();
			//s.delete(object);
			return true;
		} catch (Exception e) {
			onError("erro ao deletar no db: "+e.getMessage().toString());
			return false;
		} finally {
			closeFactory(true);
		}
	}
	

    public static List<?> listar(String sql){
    	
        List<?> listP = new ArrayList<>();
        try {
        	openFactory();
        	getSession().beginTransaction();
            listP = getSession().createQuery(sql).list();            
        } catch (Exception e) {
            Controlador.getInstancia().addErro("erro ao listar no db: "+e.getMessage().toString());
        }finally {
        	close();
		}        
        return listP;
    } 

    public static List<?> get(Class<?> c, boolean returnAll, int start, int qty, Map<String, Object> params, String[][] order){
    	
    	try {
      		openFactory();
      		getSession().beginTransaction();
			Criteria cr = getSession().createCriteria(c);
			if (!returnAll){
				cr.setFirstResult(start).setMaxResults(qty);
			}
			if (params != null) {
				cr.add(Restrictions.allEq(params));				
			}
			if (order != null) {
				for (int i = 0; i < order.length; i++) {
					if (order[i][1].equalsIgnoreCase("desc")){
						cr.addOrder(Order.desc(order[i][0]));
					}else{
						cr.addOrder(Order.asc(order[i][0]));
					}
				}
			}
			return cr.list();
		} catch (Exception e) {
			onError("erro ao listar no db: "+e.getMessage().toString(), false);
			return new ArrayList<>();
		} finally {
			close();
		}
	}
    public static List<?> getBetween(Class<?> c, boolean returnAll, int start, int qty, String field, Date dtaI,Date dtaF, String[][] order){
    	
    	try {
			openFactory();
			getSession().beginTransaction();
			Criteria cr = getSession().createCriteria(c);
			if (!returnAll){
				cr.setFirstResult(start).setMaxResults(qty);
			}
			cr.add(Restrictions.between(field,dtaI,dtaF));
			if (order != null) {
				for (int i = 0; i < order.length; i++) {
					if (order[i][1].equalsIgnoreCase("desc")){
						cr.addOrder(Order.desc(order[i][0]));
					}else{
						cr.addOrder(Order.asc(order[i][0]));
					}
				}
			}
			return cr.list();
		} catch (Exception e) {
			onError("erro ao listar no db: "+e.getMessage().toString(), false);
			return new ArrayList<>();
		} finally {
			close();
		}
	}

    public static void fecharSesssao(){	
    	/*
    	try {
    		if(t!=null && t.isActive()){
    			t.commit();
    		}
    		t=null;
		} catch (Exception e) {
			onError("erro ao listar no db: "+e.getMessage().toString(), false);
		}
    	*/
    	//getSession().close();    
    	fechaSessao();
    }
    public static void iniciarSessao(){
    	//ConexaoDB.openFactory();
    	
        //ConexaoDB.getSessionFactory().getCurrentSession().clear();
        //ConexaoDB.getSessionFactory().getCurrentSession().setFlushMode(FlushMode.MANUAL);
        //ConexaoDB.getSessionFactory().getCurrentSession().setFlushMode(FlushMode.COMMIT);
        //ConexaoDB.getSessionFactory().getCurrentSession().beginTransaction();
    }    
}