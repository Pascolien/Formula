/*** Tooltip ***/
eXcell_link.prototype.getTitle = eXcell_link.prototype.getContent; // Tooltip = text in cell (and not JS function)

/**************************************************/
/***********[ custom Boolean Read mode ]***********/
/**************************************************/

function eXcell_customBoolRM(a) {
    try {
        this.cell = a;
        this.grid = this.cell.parentNode.grid;
        this.cell.obj = this
    } catch (b) { }
    this.getValue = function () {
        try { return this.cell.chstate.toString() }
        catch (c) { return null }
    };
    this.isChecked = function () {
        if (this.getValue() == "1") { return true } else { return false }
    };
    this.detach = function () { return this.val != this.getValue() };
    this.drawCurrentState = function () {
        if (this.cell.chstate == 1) { return "<div style='font-weight:bold; text-align:center;'><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16_True.png") +"' alt='" + _("Oui") + "' style='height:12px; width:12px; display:inline-block;'/>&nbsp;" + _("Oui") + "</div>" }
        else if (this.cell.chstate == 0) { return "<div style='text-align:center;'><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16_false.png") +"' alt='" + _("Non") + "' style='height:10px; width:10px; display:inline-block;'/>&nbsp;" + _("Non") + "</div>" }
        else { return "<div style='text-align:center;'><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16-About.png") +"' alt='" + _("Indéfini") + "' style='height:12px; width:12px; display:inline-block;'/>&nbsp;" + _("Indéfini") + "</div>" }
    }
}
eXcell_customBoolRM.prototype = new eXcell;
eXcell_customBoolRM.prototype.setValue = function (b) {
    b = (b || "").toString();
    if (b.indexOf("1") != -1 || b.indexOf("true") != -1) { b = "1"; this.cell.chstate = "1" }
    else if (b.indexOf("0") != -1 || b.indexOf("false") != -1) { b = "0"; this.cell.chstate = "0" }
    else { b = "2"; this.cell.chstate = "2" }
    var a = this;
    this.setCValue(this.drawCurrentState(), this.cell.chstate)
};

/**************************************************/
/****************[ custom Boolean ]****************/
/*************************************************/

function eXcell_customBool(a){
	try{
		this.cell=a;
		this.grid=this.cell.parentNode.grid;
		this.cell.obj=this
	}catch(b){}
	this.changeState=function(){
		if((!this.grid.isEditable)||(this.cell.parentNode._locked)||(this.isDisabled())){return}
		if(this.grid.callEvent("onEditCell",[0,this.cell.parentNode.idd,this.cell._cellIndex])!=false){
			this.val=this.getValue();
			if(this.val=="1"){this.setValue("<checkbox state='false'>")}
			else if(this.val=="0"){this.setValue("<checkbox state='none'>")}
			else{this.setValue("<checkbox state='true'>")}
			this.cell.wasChanged=true;
			this.grid.callEvent("onEditCell",[1,this.cell.parentNode.idd,this.cell._cellIndex]);
			this.grid.callEvent("onCheck",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!="1")]);
			this.grid.callEvent("onCheckbox",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!="1")])
		}else{this.editor=null}
	};
	this.removeState=function(oldValue){
		//this.val=this.getValue();
		if(oldValue=="0"){this.setValue("<checkbox state='false'>")}
		else if(oldValue=="2"){this.setValue("<checkbox state='none'>")}
		else{this.setValue("<checkbox state='true'>")}
		this.cell.wasChanged=true;
		this.grid.callEvent("onEditCell",[1,this.cell.parentNode.idd,this.cell._cellIndex]);
		this.grid.callEvent("onCheck",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!="1")]);
		this.grid.callEvent("onCheckbox",[this.cell.parentNode.idd,this.cell._cellIndex,(this.val!="1")])	
	}
	this.getValue=function(){
		try{return this.cell.chstate.toString()}
		catch(c){return null}
	};
	this.isCheckbox=function(){
		return true
	};
	this.isChecked=function(){
		if(this.getValue()=="1"){return true}else{return false}
	};
	//this.setChecked=function(c){this.setValue(c.toString())};
	this.detach=function(){return this.val!=this.getValue()};
	this.drawCurrentState=function(){
	    if (this.cell.chstate == 1) { return "<div onclick='(new eXcell_customBool(this.parentNode)).changeState(); (arguments[0]||event).cancelBubble=true;'  style='cursor:pointer; font-weight:bold; text-align:center; '><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16_True.png") +"' alt='" + _("Oui") + "' style='height:12px; width:12px; display:inline-block;'/>&nbsp;" + _("Oui") + "</div>" }
	    else if (this.cell.chstate == 0) { return "<div onclick='(new eXcell_customBool(this.parentNode)).changeState(); (arguments[0]||event).cancelBubble=true;' style='cursor:pointer;  text-align:center; '><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16_false.png") +"' alt='" + _("Non") + "' style='height:10px; width:10px; display:inline-block;'/>&nbsp;" + _("Non") + "</div>" }
		else { return "<div onclick='(new eXcell_customBool(this.parentNode)).changeState(); (arguments[0]||event).cancelBubble=true;' style='cursor:pointer;  text-align:center; '><img src='"+ _url("/temp_resources/models/TxTableView/imgs/16x16-About.png") +"' alt='" + _("Indéfini") + "' style='height:12px; width:12px; display:inline-block;'/>&nbsp;" + _("Indéfini") + "</div>" }
	}
}
eXcell_customBool.prototype=new eXcell;
eXcell_customBool.prototype.setValue=function(b){
	b=(b||"").toString();
	if(b.indexOf("1") != -1||b.indexOf("true")!=-1){b="1";this.cell.chstate="1"}
	else if(b.indexOf("0") != -1||b.indexOf("false")!=-1){b="0";this.cell.chstate="0"}
	else{b="2";this.cell.chstate="2"}
	var a=this;
	this.setCValue(this.drawCurrentState(),this.cell.chstate)
};

/*******************************************************/
/******************[ custom Righ ]******************/
/*******************************************************/

function eXcell_readRight(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_readRight.prototype=new eXcell;

/*******************************************************/
/******************[ custom List ]******************/
/*******************************************************/

function eXcell_listAtt(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_listAtt.prototype=new eXcell;

/*******************************************************/
/******************[ custom Input ]******************/
/*******************************************************/

function eXcell_customString(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customString.prototype=new eXcell;

function eXcell_customURL(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customURL.prototype=new eXcell;

function eXcell_customEmail(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customEmail.prototype=new eXcell;

/*******************************************************/
/******************[ custom Calendar ]******************/
/*******************************************************/

function eXcell_customCalendar(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customCalendar.prototype=new eXcell;

/***********************************************************/
/******************[ custom numRangeMean ]******************/
/***********************************************************/

function eXcell_customNumRangeMean(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customNumRangeMean.prototype=new eXcell;

/***********************************************************/
/********************[ custom numUnique ]*******************/
/***********************************************************/

function eXcell_customNumUnique(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customNumUnique.prototype=new eXcell;

/***********************************************************/
/*******************[ custom customTree ]*******************/
/***********************************************************/

function eXcell_customTree(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customTree.prototype=new eXcell;

/***********************************************************/
/*******************[ custom customLink ]*******************/
/***********************************************************/

function eXcell_customLink(a) {
    if (a) {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    }
    this.setValue = function (val) {
        this.setCValue("<span class='cellLinkValue'>"+val+"</span>");
    }
    this.getValue = function () {
        return this.cell.firstChild.innerHTML; // get value
    }
}
eXcell_customLink.prototype = new eXcell;

/****************************************************************/
/******************[ custom File (provisoire) ]******************/
/****************************************************************/

function eXcell_customFile(a){
	if(a){
		this.cell=a;
		this.grid=this.cell.parentNode.grid
	}
	this.setValue=function(val){
		this.setCValue(val);                                     
	}
	this.getValue=function(){
		return this.cell.innerHTML; // get value
	}
}
eXcell_customFile.prototype=new eXcell;