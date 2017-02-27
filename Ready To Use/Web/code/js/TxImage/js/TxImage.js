var JS_Picture_Name;
var JS_Selection;
var dhxTabbar, dhxForm, formData;

function onLoad(){
    translate();
    Int_Tabs();
    LoadImgInformation();

}

// Load the URL of the picture and insert the picture into the editor
function Insert() {
	var elm = parent.tinymce.activeEditor.selection.getNode();			
		 
	var LinkName = document.getElementById("src").value;
	
	var LinkName= LinkName.replace("../../../", "../../");
	var title = document.getElementById("title").value;
	var description = document.getElementById("alt").value;
	var h = document.getElementById("h").value;
	var w = document.getElementById("w").value;
	var al = document.getElementById("align").value;
	elm2 = parent.tinymce.activeEditor.dom.getParent(elm, 'img');
	if (elm2 == null) {
		var elementCreated = parent.tinymce.activeEditor.dom.createHTML('img', {src: LinkName,  width : w, align: al, title: title, alt: description});
		parent.tinymce.activeEditor.selection.setContent(elementCreated);
	} else {
		var newElement = parent.tinymce.activeEditor.dom.create('img', {src:LinkName, width : w, align : al, title: title, alt: description});
		parent.tinymce.activeEditor.dom.replace(newElement, elm2);
	}
	CloseTinyPop();
} 

// Return the true dimensions of the picture
function ReturnTrueHeight() {
	var tmp_img = new Image();
	tmp_img.src= src.value;
	tmp_img.onload= function(){ 
		return height = this.height;
	} 
}
	
function ReturnTrueWidth() {
	var tmp_img = new Image();
	tmp_img.src= src.value;
	tmp_img.onload= function (){ 
		return width = this.width;
	}
}

// Proportion of the picture is controlled while changing its dimensions 
function changeHeight() {
	var constrain = document.getElementById("constrain");
	var h = document.getElementById("h");
	var w = document.getElementById("w");
	var w_hidden = document.getElementById("w_hidden");
	var h_hidden = document.getElementById("h_hidden");
	var tp ;

	if (w.value == "" || h.value == "")
		return;

	if (constrain.checked) {
		tp = (parseInt(w.value) / parseInt(w_hidden.value)) *parseInt(h_hidden.value);
		h.value = tp.toFixed(0);		
	}
}
	
function changeWidth() {
	var constrain = document.getElementById("constrain");
	var h = document.getElementById("h");
	var w = document.getElementById("w");
	var w_hidden = document.getElementById("w_hidden");
	var h_hidden = document.getElementById("h_hidden");
	var tp ;
	
	if (w.value == "" || h.value == "")
		return;
				
	if (constrain.checked) {
		tp = (parseInt(h.value) / parseInt(h_hidden.value)) * parseInt( w_hidden.value);
		w.value = tp.toFixed(0);
	}
}
	
// Load informations about the picture
function LoadImgInformation() {
    // Get src path 
    var inst = parent.tinymce.activeEditor;
    var elm = inst.selection.getNode();		
    var srcValue = inst.dom.getAttrib(elm, 'src');
    var titleValue = inst.dom.getAttrib(elm, 'title');
    var descValue = inst.dom.getAttrib(elm, 'alt');
    var heightValue = inst.dom.getAttrib(elm, 'height');
    var widthValue = inst.dom.getAttrib(elm, 'width');
	if (srcValue != ''){
		var src = document.getElementById('src');		
		var srcValue= srcValue.replace("../../", "../../../");
		J("#src").val(srcValue);
		J("#title").val(titleValue);
		J("#alt").val(descValue);

		document.getElementById("prev").innerHTML = "";
		var img = document.createElement("img");
		
		img.setAttribute("src",srcValue);
		img.setAttribute("width","330px");
		img.setAttribute("height","195px");
		document.getElementById("prev").appendChild(img); 
		// Launch function which fills the preview
		
		var tmp_img = new Image();
		tmp_img.src= src.value;
		tmp_img.onload= function(){ 
			width = this.width;
			height = this.height;

			J("#w").attr("value", widthValue);
			J("#h").attr("value", heightValue);
			
			J("#w_hidden").attr("value", width);
			J("#h_hidden").attr("value", height);
		}
		
	}
} 	
	
// Initializing DHTMLX Tabbar  for the insertion of pictures
function Int_Tabs(){
	dhxTabbar=new dhtmlXTabBar("a_tabbar","top");
	dhxTabbar.setImagePath(_url("/resources/theme/img/dhtmlx/tabbar/"));
	dhxTabbar.addTab("tab1",_("Général"),"100px");
	dhxTabbar.addTab("tab2",_("Apparence"),"100px");
	dhxTabbar.enableAutoSize(true, true);
	dhxTabbar.setContent("tab1","a1");
	dhxTabbar.setContent("tab2","a2");
	dhxTabbar.setTabActive("tab1");
	dhxTabbar.attachEvent("onTabClick", function (id) {
	    if (id == "tab2") {
	        resizeTxImageWdow(780, 270);
	    }

	    if (id == "tab1") {
	        resizeTxImageWdow(780, 537);
	    }
	});
}

function resizeTxImageWdow(aWidth, aHeight) {
    var ed = parent.tinymce.activeEditor.windowManager.windows[0];
    ed.resizeTo(aWidth, aHeight);
    dhxTabbar.enableAutoSize(true, true);
}

// Change the appearance of the picture
function changeappearance() {
	var selection = document.getElementById("align").value;
	var img = document.getElementById("myImg");
	img.setAttribute("align",selection);
}

// Close the TinyMCE Popup 
function CloseTinyPop(){
    parent.tinymce.activeEditor.windowManager.windows[0].close();
} 

// Launch function for preview
function showPreviewImage() {
	document.getElementById("prev").innerHTML = "";
	var img = document.createElement("img");
	var src = document.getElementById('src');
    img.setAttribute("src",src.value);
	img.setAttribute("width","330px");
	img.setAttribute("height","195px");
	document.getElementById("prev").appendChild(img); 

	var tmp_img = new Image();
	tmp_img.src = src.value;
	tmp_img.onload = function (){ 
	    J("#w").val(this.width);
	    J("#h").val(this.height);

	    J("#w_hidden").val(this.width);
	    J("#h_hidden").val(this.height);
	}
}

// Launch function for the list of pictures
function selection(){
	var filename = JS_Picture_Name.replace(/^.*\\/, "");
	var ext = filename.substr(filename.lastIndexOf('.') + 1);	
	filename=filename.substring(0, filename.indexOf("."+ext));
	
	var x = "_"+Math.floor((Math.random() * 999) + 1);
	var LastFileName = filename+x+"."+ext;
	Save_NameFile(LastFileName);
	var ServerPath = "../../../Pictures/";
	JS_Selection = ServerPath+LastFileName;
	
	self.parent.document.forms[0].elements['src'].value=JS_Selection;
	Save_PathFile(JS_Selection);
}

function Save_PathFile(AJS_Picture_Name){	
	J.ajax({
		url:'ajax_wrapper.asp',
		async: false,
		cache: false,
		data:{	
			sFunctionName:"Save_PathFile",
			JS_Selection:AJS_Picture_Name
		}
	})
	return true;
}

function Save_NameFile(AFileName){	
	J.ajax({
		url:'ajax_wrapper.asp',
		async: false,
		cache: false,
		data:{	
			sFunctionName:"Save_NameFile",
			FileName:AFileName
		}
	})
	return true;
}