$(function(){   
	 var vls = [50,50,100,100]; 
	 $("div.chartpie").peity("pie", { "width":100,"height":100,"fill": ["#ff9900", "#babaca","#487564","#0000cc"]}).text(vls.join(",")).change();
	//_.loadModule({"mod":"Arquivo","url":"js/br/net/underdesk/arquivo/view/Arquivo.js","act":"getByCaminho","p":["/"]});
});