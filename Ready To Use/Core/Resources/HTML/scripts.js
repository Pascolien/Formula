
function OpenClose(id) {
	obj = document.getElementById('id_div_group_'+ id);	
	objDisplay = document.getElementById('id_div_group_'+id).style.display;
	if (objDisplay == 'block' || objDisplay == '') {
	  obj.style.display = 'none';
	} else {
	  obj.style.display = 'block';
	}
}

var NB_LINKS;
function Display_Arrows(ADisplayed,AID_Attribute,ANb_Links,ATitle_Arrow,AText){
	var obj = document.getElementById('id_div_arrows_'+AID_Attribute);
	var ArrowUp = document.getElementById('id_arrow_up_'+AID_Attribute);
	var ArrowDown = document.getElementById('id_arrow_down_'+AID_Attribute);
	var Links = document.getElementById('id_div_link_'+AID_Attribute);
	if (obj != null){
		if (ADisplayed){
			NB_LINKS = ANb_Links;
			obj.style.display = 'block';
			Create_Link_More(AID_Attribute,ATitle_Arrow,AText);
			Collapse_Links(AID_Attribute);			
		} else {
			obj.style.display = 'none';
		}
	}
}

function Create_Link_More(AID_Attribute,ATitle_Arrow,AText){
	var txt2 = document.createTextNode(AText);
	var Links = document.getElementById('id_div_link_'+AID_Attribute);
	rLink = document.createElement("a");
	rLink.href = "#";
	rLink.title = ATitle_Arrow;
	rLink.onclick = function(){
		Expand_Links(AID_Attribute);
		rDiv.style.display = 'none';
	};
	rLink.appendChild(txt2);
	rDiv = document.createElement("DIV");
	rDiv.id = "id_more_links_"+AID_Attribute;
	rDiv.setAttribute("class","cl_more_links");
	rDiv.setAttribute("className","cl_more_links");
	rDiv.appendChild(rLink);
	Links.appendChild(rDiv);
}

function Collapse_Links(AID_Attribute){
	var ArrowUp = document.getElementById('id_arrow_up_'+AID_Attribute);
	var ArrowDown = document.getElementById('id_arrow_down_'+AID_Attribute);
	var Links = document.getElementById('id_div_link_'+AID_Attribute);
	var DivMoreLinks = document.getElementById("id_more_links_"+AID_Attribute);
	var Children = Links.children;
	ArrowUp.style.display = 'none';
	ArrowDown.style.display = 'block';
	Links.style.height = NB_LINKS * 20+20+'px';
	for (var i = NB_LINKS ; i < Children.length ; i++){
		Children[i].style.display = 'none';
	}
	DivMoreLinks.style.display = "block";
}

function Expand_Links(AID_Attribute){
	var ArrowUp = document.getElementById('id_arrow_up_'+AID_Attribute);
	var ArrowDown = document.getElementById('id_arrow_down_'+AID_Attribute);
	var Links = document.getElementById('id_div_link_'+AID_Attribute);
	var Children = Links.children;
	var DivMoreLinks = document.getElementById("id_more_links_"+AID_Attribute);
	ArrowUp.style.display = 'block';
	ArrowDown.style.display = 'none';
	Links.style.height = 'auto';
	for (var i = NB_LINKS ; i < Children.length ; i++){
		Children[i].style.display = 'block';
	}
	DivMoreLinks.style.display = "none";
}

function ClickOn_Yellow_Arrows(AID_Attribute){	
	var ArrowUp = document.getElementById('id_arrow_up_'+AID_Attribute);
	//ArrowUp.style.
	if (ArrowUp.style.display == 'block') {
		Collapse_Links(AID_Attribute);
	} else {
		Expand_Links(AID_Attribute);
	}
}
