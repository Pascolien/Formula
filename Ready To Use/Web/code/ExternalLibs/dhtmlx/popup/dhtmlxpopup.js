//v.3.6 build 131108

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
function dhtmlXPopup(conf) {
	
	var that = this;
	
	this.conf = conf||{};
	conf = null;
	
	this.mode = (this.conf.mode||"bottom"); // popup position related to caller element
	
	this.p = document.createElement("DIV");
	this.p.style.display = "none";
	this.p.innerHTML = "<div class='dhx_popup_area"+(_isIE?" dhx_popup_area_ie":"")+"'>"+
					"<table cellspacing='0' cellpadding='0' border='0' class='dhx_popup_table'><tbody></tbody></table>"+
				"</div>"+
				"<div class='dhx_popup_arrow dhx_popup_arrow_"+this.mode+"'></div>";
	
	document.body.appendChild(this.p);
	
	this.skinParams = {
		dhx_terrace: {
			t0: 19, // minimal top offset for polygon, i.e. space between polygon top and arrow top
			t1: 9,  // if no more space at top, and "t0 allowed" - move top polygon position a bit to bottom, t1 = offset for empty space at top
			t2: 19, // same as t0, for width
			t3: 9   // same as t1, for width
		},
		dhx_skyblue: {t0: 12, t1: 9, t2: 12, t3: 9},
		dhx_web: {t0: 12, t1: 9, t2: 12, t3: 9}
	};
	
	this.p.onclick = function(e) {
		e = e||event;
		e.cancelBubble = true;
		if (that._nodeObj != null) {
			that.callEvent("onContentClick",[]);
			return true;
		}
		var t = (e.target||e.srcElement);
		var id = null;
		while (t != that.p) {
			if (typeof(t._idd) != "undefined" && !t._isSeparator) id = t._idd;
			t = t.parentNode;
		}
		t = null;
		if (id) {
			that.callEvent("onClick",[id]);
			if (that != null && that.isVisible != null && that.isVisible() && that.callEvent("onBeforeHide",["select",e,id]) === true) {
				that.hide();
			}
		}
	}
	
	
	this.separator = "DHXSEP"+new Date().getTime();
	
	this.tpl = [];
	this.setTemplate = function(t) {
		this.tpl = t.split(",");
	}
	
	this.uid = function() {
		if (!this.idd) this.idd = new Date().getTime(); else this.idd++;
		return this.idd;
	}
	
	this.show = function(id) { // 4 coords for custom object, x, y, width, height
		
		var p = null;
		
		if (arguments.length == 1) {
			
			// if id not specified show on first
			
			if (!id) {
				id = this.conf.id[0];
			} else {
				if (!this._idExists(id)) return;
			}
			if (this.conf.toolbar) {
				p = this.conf.toolbar.getItemDim(id);
			}
			if (this.conf.form) {
				p = this.conf.form.getItemDim(id);
			}
			
		} else if (arguments.length == 4) {
			
			this._clearClick = true;
			
			// show for custom object, 4 coords
			p = {
				left:   arguments[0],
				top:    arguments[1],
				width:  arguments[2],
				height: arguments[3]
			}
			
			id = null;
		}
		
		if (!p) return;
		
		this.p.style.visibility = "hidden";
		this.p.style.display = "";
		
		this._setPos(p);
		
		this.p.style.visibility = "visible";
		
		this._lastId = id;
		
		this.callEvent("onShow",[id]);
		
		
	}
	
	this._setPos = function(p, state) {
		
		var x = p.left;
		var y = p.top;
		var w = p.width;
		var h = p.height;
		
		this._posData = {
			left: x,
			top: y,
			width: w,
			height: h
		};
		
		var tx = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollLeft, document.body.scrollLeft);
		var tx2 = tx+(_isIE?Math.max(document.documentElement.clientWidth||0,document.documentElement.offsetWidth||0,document.body.clientWidth||0):window.innerWidth);
		
		var ty = Math.max((_isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
		var ty2 = ty+(_isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.body.clientHeight||0):window.innerHeight);
		
		var mode = state||this.mode;
		if (typeof(state) == "undefined") state = false;
		
		// avail space form each side, negative value = no-space
		var availSpace = {
			top: (y-this.p.offsetHeight)-ty,
			bottom: ty2-(y+h+this.p.offsetHeight),
			left: x-this.p.offsetWidth-tx,
			right: tx2-(x+w+this.p.offsetWidth)
		};
		
		if (!state && availSpace[mode] < 0) {
			var k = this._getAvailPos(mode, availSpace);
			if (k !== false) {
				this._setPos(p, k);
				return;
			}
			
		}
		
		if (mode == "top" || mode == "bottom") {
			
			var t0 = this.skinParams[this.skin].t2;
			var t1 = this.skinParams[this.skin].t3;
			
			var pw2 = Math.round(this.p.offsetWidth/2); // 1/2 polygon width
			var aw2 = Math.round(this.p.lastChild.offsetWidth/2); // 1/2 arrow width
			
			// define max left and right position of input including rendering [tx..tx2] area
			if (x < tx) { var x1 = Math.min(x+w, tx); w = x+w-x1; x = x1; } // left
			if (x+w > tx2) w = tx2-x; // right
			
			// arrow position
			var ta = Math.round(x+w/2);
			
			// polygon top
			var left = ta - pw2;
			var maxLeft = ta - t0 - aw2;
			var maxLeftRight = ta+aw2+t0-this.p.offsetWidth;
			
			
			if (left < tx-t1) { // left
				left = Math.min(tx-t1, maxLeft);
			} else if (left+this.p.offsetWidth > tx2+t1) { // right
				left = Math.max(maxLeftRight, tx2+t1-this.p.offsetWidth); // -scrollWidth here?
			}
			
			// draw polygon
			this.p.style.left = left+"px";
			this.p.style.top = (mode=="top"?y-this.p.offsetHeight:y+h)+"px";
			
			// fix arrow offset (it inside polygon)
			ta = ta-left-aw2;
			
			// draw arrow
			this.p.lastChild.className = "dhx_popup_arrow dhx_popup_arrow_"+mode;
			this.p.lastChild.style.top = (mode=="top"?this.p.offsetHeight-this.p.lastChild.offsetHeight:0)+"px";
			this.p.lastChild.style.left = ta+"px";
			
			
		}
		
		
		if (mode == "left" || mode == "right") {
			
			var t0 = this.skinParams[this.skin].t0;
			var t1 = this.skinParams[this.skin].t1;
			
			var ph2 = Math.round(this.p.offsetHeight/2); // 1/2 polygon height
			var ah2 = Math.round(this.p.lastChild.offsetHeight/2); // 1/2 arrow height
			
			// define max top and bottom position of input including rendering [ty..ty2] area
			if (y < ty) { var y1 = Math.min(y+h, ty); h = y+h-y1; y = y1; } // top
			if (y+h > ty2) h = ty2-y; // bottom
			
			// arrow position
			var ta = Math.round(y+h/2);
			
			// polygon top
			var top = ta - ph2;
			var maxTop = ta - t0 - ah2;
			var maxTopBottom = ta+ah2+t0-this.p.offsetHeight;
			
			
			if (top < ty-t1) { // top
				top = Math.min(ty-t1, maxTop);
			} else if (top+this.p.offsetHeight > ty2+t1) { // bottom
				top = Math.max(maxTopBottom, ty2+t1-this.p.offsetHeight);
			}
			
			// draw polygon
			this.p.style.left = (mode=="left"?x-this.p.offsetWidth:x+w)+"px";
			this.p.style.top = top+"px";
			
			// fix arrow offset (it inside polygon)
			ta = ta-top-ah2;
			
			// draw arrow
			this.p.lastChild.className = "dhx_popup_arrow dhx_popup_arrow_"+mode;
			this.p.lastChild.style.left = (mode=="left"?this.p.offsetWidth-this.p.lastChild.offsetWidth:0)+"px";
			this.p.lastChild.style.top = ta+"px";
			
		}
		
		if (this._IEDisp && this._nodeId != null) {
			var t = document.getElementById(this._nodeId);
			//t.style.visibility = "hidden";
			window.setTimeout(function(){
				t.style.visibility = "visible";
				t = null;
			},1);
		}
	}
	
	this._getAvailPos = function(mode, data) {
		
		var seq = {
			top: ["bottom","right","left"],
			bottom: ["top","right","left"],
			left: ["right", "bottom", "top"],
			right: ["left", "bottom", "top"]
		};
		
		var dir = null;
		
		// check "next" with avail space
		for (var q=0; q<seq[mode].length; q++) {
			if (dir == null && data[seq[mode][q]] > 0) dir = seq[mode][q];
		}
		
		// define which side have more space
		if (dir == null) {
			dir = "bottom";
			for (var a in data) if (data[a] > data[dir]) dir = a;
		}
		
		if (dir == mode) return false;
		
		return dir;
		
	}
	
	this._repaint = function() {
		if (this.isVisible()) this._setPos(this._posData);
	}
	
	this.clear = function() {
		
		if (this._nodeObj) {
			if (_isIE && typeof(dhtmlXLayoutObject) != "undefined" && this._nodeObj instanceof dhtmlXLayoutObject) {
				this.p.onmousedown = null;
			}
			if (this._nodeObj.unload) {
				this._nodeObj.unload();
			} else if (this._nodeObj.destruct) {
				this._nodeObj.destruct();
			}
			this._nodeObj = this._nodeId = null;
		}
		
		if (this._IEHoverInited) this._IEHoverClear();
		
		var r = this.p.firstChild.firstChild.firstChild; // table->tbody
		while (r.childNodes.length > 0) r.removeChild(r.lastChild);
		
		r = null;
		
		this.itemData = {};
	}
	
	this.hide = function() {
		if (this.p.style.display != "none") {
			this.p.style.display = "none";
			var id = this._lastId;
			this._lastId = null;
			this.callEvent("onHide",[id]);
		}
	}
	
	this.isVisible = function() {
		return (this.p.style.display == "");
	}
	
	this.itemData = {};
	
	this.getItemData = function(id) {
		if (!id) return this.itemData;
		if (this.itemData[id]) return this.itemData[id];
		return {};
	}
	
	this.setSkin = function(skin) {
		this.skin = skin;
		this.p.className = "dhx_popup_"+this.skin;
		if (this._nodeObj != null && typeof(this._nodeObj.setSkin) == "function") this._nodeObj.setSkin(this.skin);
		this._repaint();
	}
	
	this.skinDetect = function() {
		var t = document.createElement("DIV");
		t.className = "dhx_popup_skin_detect";
		if (document.body.firstChild) document.body.insertBefore(t, document.body.firstChild); else document.body.appendChild(t);
		var w = t.offsetWidth;
		t.parentNode.removeChild(t);
		t = null;
		return {10:"dhx_skyblue",20:"dhx_web",30:"dhx_terrace"}[w]||null;
	}
	
	this.attachList = function(template, data) {
		
		this.setTemplate(template);
		
		this.clear();
		var r = this.p.firstChild.firstChild.firstChild; // table->tbody
		
		for (var q=0; q<data.length; q++) {
			var tr = document.createElement("TR");
			tr._idd = data[q].id||this.uid();
			r.appendChild(tr);
			this.itemData[tr._idd] = data[q];
			if (data[q] == this.separator) {
				tr.className = "dhx_popup_sep";
				tr._isSeparator = true;
				var td = document.createElement("TD");
				td.className = "dhx_popup_sep";
				td.colSpan = this.tpl.length;
				td.innerHTML = "<div class='dhx_popup_sep'>&nbsp;</div>";
				tr.appendChild(td);
				td = null;
			} else {
				for (var w=0; w<this.tpl.length; w++) {
					var css = "dhx_popup_td";
					if (this._IEFirstLast && (this.tpl.length==1||w==0||w==this.tpl.length-1)) {
						if (this.tpl.length==1) css += " dhx_popup_td_single"; else css += (w==0?" dhx_popup_td_first":" dhx_popup_td_last");
					}
					var td = document.createElement("TD");
					td.className = css;
					td.innerHTML = data[q][this.tpl[w]]||"&nbsp;";
					tr.appendChild(td);
					td = null;
				}
				// IE6 hover functionality
				if (this._IEHover) {
					tr._IEHover = true;
					if (!this._IEHoverInited) this._IEHoverInit();
				}
			}
			tr = null;
		}
		r = null;
		
		this._repaint();
		
	}
	
	this.attachObject = function(obj) {
		return this._attachNode("object", {obj: obj});
	}
	
	this.attachHTML = function(html) {
		return this._attachNode("html", {html: html});
	}
	
	this.attachForm = function(struct) {
		return this._attachNode("form", {struct: struct});
	}
	
	this.attachCalendar = function() {
		return this._attachNode("calendar", {});
	}
	
	this.attachGrid = function(width, height) {
		return this._attachNode("grid", {width: width||400, height: height||200});
	}
	
	this.attachTree = function(width, height, rootId) {
		return this._attachNode("tree", {width: width||400, height: height||200, rootId: rootId||0});
	}
	
	this.attachLayout = function(width, height, pattern) {
		return this._attachNode("layout", {width: width||400, height: height||200, pattern: pattern||"3L"});
	}
	
	this.attachAccordion = function(width, height) {
		return this._attachNode("accordion", {width: width||400, height: height||200});
	}
	
	this.attachTabbar = function(width, height, mode) {
		return this._attachNode("tabbar", {width: width||400, height: height||200, mode: mode||"top"});
	}
	
	this._attachNode = function(mode, data) {
		
		this.clear();
		
		this._nodeId = "cn_"+new Date().getTime();
		
		var r = this.p.firstChild.firstChild.firstChild; // table->tbody
		
		var tr = document.createElement("TR");
		tr.className = "dhxnode";
		r.appendChild(tr);
		
		var td = document.createElement("TD");
		td.className = "dhx_popup_td";
		td.innerHTML = "<div id='"+this._nodeId+"' style='position:relative;'></div>";
		
		if (data.width) td.firstChild.style.width = data.width+"px";
		if (data.height) td.firstChild.style.height = data.height+"px";
		
		tr.appendChild(td);
		
		td = tr = r = null;
		
		// attach
		if (mode == "object") {
			this._nodeObj = (typeof(data.obj)=="string"?document.getElementById(data.obj):data.obj);
			data.obj = null;
			document.getElementById(this._nodeId).appendChild(this._nodeObj);
			this._nodeObj.style.display = "";
			this._nodeObj.style.visibility = "visible";
		}
		
		if (mode == "html") {
			document.getElementById(this._nodeId).innerHTML = data.html;
			this._nodeObj = {text: data.html};
		}
		
		if (mode == "form") {
			this._nodeObj = new dhtmlXForm(this._nodeId, data.struct);
			this._nodeObj.setSkin(this.skin);
		}
		
		if (mode == "calendar") {
			this._nodeObj = new dhtmlXCalendarObject(this._nodeId);
			this._nodeObj.setSkin(this.skin);
			this._nodeObj.show();
		}
		
		if (mode == "grid") {
			this._nodeObj = new dhtmlXGridObject(this._nodeId);
			this._nodeObj.setSkin(this.skin);
		}
		
		if (mode == "tree") {
			this._nodeObj = new dhtmlXTreeObject(this._nodeId, "100%", "100%", (data.rootId))
		}
		
		if (mode == "layout") {
			this._nodeObj = new dhtmlXLayoutObject(this._nodeId, data.pattern, this.skin)
			if (_isIE) this.p.onmousedown = function(){ that._clearClick = true; }
		}
		
		if (mode == "accordion") {
			this._nodeObj = new dhtmlXAccordion(this._nodeId, this.skin)
		}
		
		if (mode == "tabbar") {
			this._nodeObj = new dhtmlXTabBar(this._nodeId, data.mode);
			this._nodeObj.setSkin(this.skin);
		}
		
		this._repaint();
		
		return this._nodeObj;
		
	}
	
	this.unload = function() {
		
		if (window.addEventListener) {
			window.removeEventListener("click", this._doOnClick, false);
			window.removeEventListener("unload", this._doOnUnload, false);
		} else {
			document.body.detachEvent("onclick", this._doOnClick, false);
			document.body.detachEvent("onunload", this._doOnUnload, false);
		}
		
		this.clear();
		
		this._doOnClick = null;
		this._doOnUnload = null;
		this._doOnKeyUp = null;
		
		
		if (this.conf.toolbarEvent != null && this.conf.toolbar != null) {
			if (this.conf.toolbar.detachEvent != null) {
				// make sure toolbar wasn't unloaded
				this.conf.toolbar.detachEvent(this.conf.toolbarEvent);
			} else {
				this.conf.toolbar.getItemDim = null;
			}
		}
		
		this.detachAllEvents();
		this.attachEvent = this.detachEvent = this.callEvent = this.checkEvent = this.detachAllEvents = this.eventCatcher = null;
		this.attachList = this.attachAccordion = this.attachCalendar = this.attachForm = this.attachGrid = this.attachLayout = this.attachTabbar = this.attachTree = this.attachHTML = this.attachObject = this._attachNode = null;
		
		this.show = this.hide = this.isVisible = this.setTemplate = this._repaint = this._setPos = this.getItemData = this.clear = this._idExists = this._doOnToolbarClick = this.setSkin = this.skinDetect = null;
		this.tpl = this.idd = this.uid = this.itemData = this.separator = this.skin = this.mode = null;
		this._clearClick = this._lastId = this._posData = this.skinParams = this.skinParent = null;
		
		this.p.onclick = null;
		this.p.parentNode.removeChild(this.p);
		this.p = null;
		
		this.conf.toolbar = this.conf.toolbarEvent = this.conf.form = this.conf.id = null;
		this.conf = null;
		
		this._IEHover = this._IEHoverTM = this._IEHoverInit = this._IEHoverClear = this._IEHoverRender = this._IEHoverInited = null;
		this._IEDisp = null;
		
		this.unload = null;
		that = null;
		
	}
	
	dhtmlxEventable(this);
	
	this._doOnClick = function(e) {
		e = e||event;
		if (that._clearClick) {
			that._clearClick = false;
			return;
		}
		if (that.conf.form != null) {
			var id;
			var t = (e.target||e.srcElement);
			if ((t.tagName||"").toLowerCase() == "option") t = t.parentNode;
			if (t.className != null && t.className.search("dhxform") >= 0) {
				if (t.parentNode != null && t.parentNode.parentNode != null && t.parentNode.parentNode._idd != null) {
					id = t.parentNode.parentNode._idd;
					if (t.parentNode.parentNode._type == "ra") id = [t.parentNode.parentNode._group, t.parentNode.parentNode._value];
				}
			} else {
				// check if button or editor
				var k = true;
				var f = false;
				while (k && !f) {
					f = ((t.className||"").toLowerCase() == "dhxform_btn" || (t.className||"").search(/dhxeditor_inside/gi) >= 0);
					t = t.parentNode;
					k = (t != null);
				}
				if (f) return;
			}
			t = null;
			if (id != null && that._idExists(id)) return;
		}
		if (that.isVisible() && that.callEvent("onBeforeHide",["click",e]) === true) {
			that.hide();
		}
	}
	this._doOnKeyUp = function(e) {
		e = e||event;
		if (e.keyCode == 27) {
			if (that.isVisible() && that.callEvent("onBeforeHide",["esc",e]) === true) {
				that.hide();
			}
		}
	}
	this._doOnUnload = function() {
		that.unload();
	}
	
	if (window.addEventListener) {
		window.addEventListener("click", this._doOnClick, false);
		window.addEventListener("keyup", this._doOnKeyUp, false);
		window.addEventListener("unload", this._doOnUnload, false);
	} else {
		document.body.attachEvent("onclick", this._doOnClick, false);
		document.body.attachEvent("onkeyup", this._doOnKeyUp, false);
		document.body.attachEvent("onunload", this._doOnUnload, false);
	}
	
	this._idExists = function(id) {
		var r = false;
		for (var q=0; q<this.conf.id.length; q++) {
			if (this.conf.id[q] instanceof Array) { // radiobutton
				r = r||(this.conf.id[q][0]==id[0]&&this.conf.id[q][1]==id[1]);
			} else {
				r = r||this.conf.id[q]==id;
			}
		}
		return r;
	}
	
	// IE6/Quircks Display fix
	this._IEDisp = (_isIE && (navigator.userAgent.search("MSIE 6.0")>=0 || document.compatMode != "CSS1Compat"));
	
	// IE6 hover functionality
	this._IEHover = (_isIE && navigator.userAgent.search("MSIE 6.0")>=0);
	if (this._IEHover) {
		this._IEHoverInit = function() {
			this.p.onmouseover = function() {
				var t = event.srcElement;
				while (t != this && t._IEHover != true) t = t.parentNode;
				if (t._IEHover) {
					if (that._IEHoverTM) window.clearTimeout(that._IEHoverTM);
					if (that._lastIEHover == t) return;
					that._IEHoverRender(t);
					t = null;
				}
			}
			this.p.onmouseout = function() {
				if (that._IEHoverTM) window.clearTimeout(that._IEHoverTM);
				that._IEHoverTM = window.setTimeout(function(){that._IEHoverRender(null);},1);
			}
			this._IEHoverRender = function(t) {
				if (this._lastIEHover != null) {
					if (this._lastIEHover.className.search(/tr_hover/gi) >= 0) {
						this._lastIEHover.className = this._lastIEHover.className.replace(/\s{0,}tr_hover/gi, "");
						this._lastIEHover = null;
					}
				}
				if (t != null && t.className.search(/tr_hover/gi) < 0) {
					t.className += " tr_hover";
					that._lastIEHover = t;
				}
			}
			this._IEHoverInited = true;
		}
		this._IEHoverClear =  function() {
			this.p.onmouseover = null;
			this.p.onmouseout = null;
			this._IEHoverInited = false;
		}
	}
	
	// IE6/7/8 first/last-child
	this._IEFirstLast = (_isIE && navigator.userAgent.search(/MSIE [6,7,8]\.0/i)>=0);
	
	
	// auto-init, toolbar mode
	if (typeof(dhtmlXToolbarObject) != "undefined" && this.conf.toolbar != null && this.conf.toolbar instanceof dhtmlXToolbarObject && this.conf.id != null) {
		
		if (!(this.conf.id instanceof Array)) this.conf.id = [this.conf.id];
		
		this.skinParent = this.conf.toolbar.skin;
		
		this._doOnToolbarClick = function(id) {
			for (var q=0; q<that.conf.id.length; q++) {
				if (id == that.conf.id[q]) {
					if (id != that._lastId) {
						that.show(id);
						that._clearClick = true;
					}
				}
			}
		}
		
		// extension for toolbar, return pos/dim for specified button
		if (typeof(dhtmlXToolbarObject.prototype.getItemDim) == "undefined") {
			
			dhtmlXToolbarObject.prototype.getItemDim = function(id) {
				var t = this.objPull[this.idPrefix+id];
				var p = {
					left: getAbsoluteLeft(t.obj),
					top: getAbsoluteTop(t.obj),
					width: t.obj.offsetWidth+(t.arw?t.arw.offsetWidth:0),
					height: t.obj.offsetHeight
				};
				t = null;
				return p;
			}
			
		}
		
		this.conf.toolbarEvent = this.conf.toolbar.attachEvent("onClick", that._doOnToolbarClick);
		
	}
	
	// form mode
	if (typeof(dhtmlXForm) != "undefined" && this.conf.form != null && this.conf.form instanceof dhtmlXForm && this.conf.id != null) {
		
		if (!(this.conf.id instanceof Array)) this.conf.id = [this.conf.id];
		
		if (!this.conf.mode) this.mode = "right"; // default mode for form
		this.skinParent = this.conf.form.skin;
		
		if (typeof(dhtmlXForm.prototype.getItemDim) == "undefined") {
			
			dhtmlXForm.prototype.getItemDim = function(name, value) {
				return this.doWithItem(name, "_getDim");
			};
			
			// file - ??
			for (var a in {input: 1, password: 1, select: 1, multiselect: 1, checkbox: 1, radio: 1, button: 1, combo: 1, btn2state: 1, calendar: 1, colorpicker: 1, editor: 1}) {
				
				if (dhtmlXForm.prototype.items[a] != null) {
				
					dhtmlXForm.prototype.items[a]._getDim = function(item) {
						
						var t = item;
						if ({"ta":true,"pw":true,"se":true,"calendar":true,"colorpicker":1,"editor":true}[item._type]) {
							t = item.childNodes[item._ll?1:0].childNodes[0];
						}
						if ({"ch":true,"ra":true,"btn2state":true}[item._type]) {
							t = item.childNodes[item._ll?1:0].childNodes[1];
						}
						if ({"bt":true}[item._type]){
							t = item.firstChild;
						}
						if ({"combo":true}[item._type]){
							t = item._combo.DOMParent.firstChild;
						}
						
						
						var p = {
							left: getAbsoluteLeft(t),
							top: getAbsoluteTop(t),
							width: t.offsetWidth,
							height: t.offsetHeight
						};
						t = null;
						return p;
					};
				}
			}
			
		}
		
	}
	
	// define skin
	this.setSkin(this.conf.skin||(typeof(dhtmlx)!="undefined"?dhtmlx.skin:null)||this.skinParent||this.skinDetect()||"dhx_skyblue");
	
	return this;
	
}
