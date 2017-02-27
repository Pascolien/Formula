
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

function navigation(aId, aIdObject, aSource, aCloseWindow) {
    TTest = 0;
    if (aCloseWindow) {
        TTest = 1;
    }
    if (aSource == 'mcs') {
        iFrom = 7;
    } else if (aSource == 'search') {
        iFrom = 8;
    } else if (aSource == 'read_form') {
        iFrom = 4;
    } else if (aSource == 'write_form') {
        iFrom = 5;
    }
    J.ajax({
        url: _url('/code/asp/ajax/log_navigation_action.asp'),
        async: false,
        cache: false,
        data: { origin: iFrom, id_obj: aIdObject }
    });
    if (isAssigned(txASP)) {
        //case of select entity in content Form to display a linked node.
        txASP.displayObject(aIdObject);
    } else {
        if (TTest == 0) {
            J.ajax({
                url: _url('/code/asp/ajax/alert_background_window.asp'),
                async: false,
                cache: false,
                success: function (aResult) {
                    TTest = aResult;
                }
            });
        }
        if (!window.parent.opener) {
            parent.txASP.displayObject(aIdObject);
        } else if (window.parent.opener.parent.frames['iFrameTxASP']) {
            //case of selected node in search window.
            window.parent.opener.parent.frames['iFrameTxASP'].txASP.displayObject(aIdObject);
        } else {
            if (window.parent.opener.parent.opener.parent.frames['iFrameTxASP']) {
                window.parent.opener.parent.opener.parent.frames['iFrameTxASP'].txASP.displayObject(aIdObject);
                window.parent.opener.parent.opener.parent.focus();
            } else {
                window.parent.opener.parent.opener.parent.opener.parent.frames['iFrameTxASP'].txASP.displayObject(aIdObject);
                window.parent.opener.parent.opener.parent.opener.parent.focus();
            }
        }
    }
    if (aCloseWindow) {
        window.close();
    }
}

function displayPopupSrcInfoRead(aIdObject, aIdSource, aIdAttribute, aType) {
    var bSource = aIdSource > 0,
        sHeader = bSource ? _('Source') : _('Information'),
        sIcon = 'resources/theme/img/btn_form/' + (bSource ? _('16x16_Existing_Source.png') : _('16x16_Existing_information.png'));

    var sDivName = 'idDivInfoSourceRead';
    J(document.body).append('<div id="' + sDivName + '"></div>');

    J('#' + sDivName).load(_url('/code/TxASP/WindowSrcInfoRead.asp'), {
        idObject: aIdObject,
        idObjectSource: aIdSource,
        idAttribute: aIdAttribute,
        bSource : bSource
    });

    txASP.wdowContainer.addWindow({
        sName: "wInfoSourceRead",
        sHeader: sHeader,
        sIcon: sIcon,
        iWidth: 500,
        iHeight: 450,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: sDivName
    });
}

function ExportTable(aIdAtt, aIdObj) {
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "exportTable",
            idObject: aIdObj,
            idAtt: aIdAtt
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sFileName = results[1];
                downloadFile(sFileName);
            } else{
                msgWarning(results[0]);
			}
        }
    });
}

