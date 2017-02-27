function dhtmlXForm(parentObj, data) {
	
	this.i = {
		position:	"label-left",
		labelWidth:	"auto",
		labelHeight:	"auto",
		inputWidth:	"auto",
		inputHeight:	"auto",
		labelAlign:	"left",
		noteWidth:	"auto",
		offsetTop:	0,
		offsetLeft:	0
	};
	this.apos_css = {
		"label-left":	"dhxform_item_label_left",
		"label-right":	"dhxform_item_label_right",
		"label-top":	"dhxform_item_label_top",
		"label-bottom":	"dhxform_item_label_bottom", // new
		"absolute":	"dhxform_item_absolute"
	}
	this.align_css = {
		left:		"dhxform_label_align_left",
		center:		"dhxform_label_align_center",
		right:		"dhxform_label_align_right"
	}
	
	var that = this;
	
	this.skin = (typeof(dhtmlx)!="undefined"?dhtmlx.skin||"dhx_skyblue":"dhx_skyblue");
	this.setSkin = function(skin) {
		this.skin = skin;
		this.cont.className = "dhxform_obj_"+this.skin;
		this.cont.style.fontSize = "13px";
		this._updateBlocks();
		// update calendar skin
		this.forEachItem(function(id){if(that.getItemType(id)=="calendar"){that.doWithItem(id,"setSkin",skin);}});
	}
	
	this.separator = ",";
	this.live_validate = false;
	
	this._type = "checkbox";
	this._rGroup = "default";
	
	this._idIndex = {};
	this._indexId = [];
	
	this.cont = (typeof(parentObj)=="object"?parentObj:document.getElementById(parentObj));
	
	if (!parentObj._isNestedForm) {
		
		this._parentForm = true;
		
		this.cont.style.fontSize = "13px";
		this.cont.className = "dhxform_obj_"+this.skin;
		
		this.setFontSize = function(fs) {
			this.cont.style.fontSize = fs;
			this._updateBlocks();
		}
		
		this.getForm = function() {
			return this;
		}
		
		this.cont.onkeypress = function(e) {
			e = (e||event);
			if (e.keyCode == 13) {
				var t = (e.target||e.srcElement);
				if (typeof(t.tagName) != "undefined" && String(t.tagName).toLowerCase() == "textarea" && !e.ctrlKey) return;
				that.callEvent("onEnter",[]);
			}
		}
		
	}
	
	this.b_index = null;
	this.base = [];
	this._prepare = function(ofsLeft) {
		if (this.b_index == null) this.b_index = 0; else this.b_index++;
		this.base[this.b_index] = document.createElement("DIV");
		this.base[this.b_index].className = "dhxform_base";
		if (typeof(ofsLeft) != "undefined") this.base[this.b_index].style.cssText += " margin-left:"+ofsLeft+"px!important;";
		this.cont.appendChild(this.base[this.b_index]);
	}
	
	
	this.setSizes = function() {
		/*
		for (var q=0; q<this.base.length; q++) {
			this.base.style.height = this.cont.offsetHeight+"px";
			this.base.style.overflow = "auto";
		}
		*/
	}
	
	this._mergeSettings = function(data) {
		
		var u = -1;
		var i = {type: "settings"};
		for (var a in this.i) i[a] = this.i[a];
		
		for (var q=0; q<data.length; q++) {
			if (typeof(data[q]) != "undefined" && data[q].type == "settings") {
				for (var a in data[q]) i[a] = data[q][a];
				u = q;
			}
		}
		data[u>=0?u:data.length] = i;
		return data;
	}
	
	this._genStr = function(w) {
		var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var q=0; q<w; q++) s += z.charAt(Math.round(Math.random() * (z.length-1)));
		return s;
	}
	
	this.idPrefix = "dhxForm_"+this._genStr(12)+"_";
	
	this._rId = (this._parentForm?this._genStr(12)+"_":parentObj._rId);
	
	this.objPull = {};
	this.itemPull = {};
	this._ic = 0;
	
	this._addItem = function(type, id, data, sId, lp) {
		
		// id-index
		if (this.items[type]._index) {
			this.getForm()._indexId.push(id);
			this.getForm()._idIndex[id] = {ind: this.getForm()._indexId.length-1};
			this.getForm()._idIndex[id] = {ind: this.getForm()._indexId.length-1};
		}
		
		if (!type) type = this._type;
		
		if (type == "list" && ({"fieldset":true,"block":true})[this.getItemType(lp)] == true) {
			var tr = this.itemPull[this.idPrefix+lp]._addSubListNode();
		} else {
			if (type == "newcolumn") {
				var tr = {};
			} else {
				var tr = document.createElement("DIV");
				this.base[this.b_index].appendChild(tr);
			}
		}
		
		tr._idd = id;
		tr._rId = this._rId;
		
		if (typeof(tr.style) != "undefined") {
			// read from settings if not set
			if (typeof(data.offsetLeft) == "undefined" && this.i.offsetLeft > 0) data.offsetLeft = this.i.offsetLeft;
			if (typeof(data.offsetTop) == "undefined" && this.i.offsetTop > 0) data.offsetTop = this.i.offsetTop;
			//
			if (typeof(data.offsetLeft) != "undefined") tr.style.cssText += " padding-left:"+data.offsetLeft+"px!important;";
			if (typeof(data.offsetTop) != "undefined") tr.style.cssText += " padding-top:"+data.offsetTop+"px!important;";
		}
		
		if (type == "list") {
			
			if (sId != null) tr._sId = sId;
			
			var listData = this.items[type].render(tr);
			
			if (!this.itemPull[this.idPrefix+id]._listObj) this.itemPull[this.idPrefix+id]._listObj = [];
			if (!this.itemPull[this.idPrefix+id]._list) this.itemPull[this.idPrefix+id]._list = [];
			if (!this.itemPull[this.idPrefix+id]._listBase) this.itemPull[this.idPrefix+id]._listBase = [];
			
			(this.itemPull[this.idPrefix+id]._listObj).push(listData[0]);
			(this.itemPull[this.idPrefix+id]._list).push(listData[1]);
			(this.itemPull[this.idPrefix+id]._listBase).push(tr);
			
			listData[1].checkEvent = function(evName) {
				return that.checkEvent(evName);
			}
			listData[1].callEvent = function(evName, evData) {
				return that.callEvent(evName, evData);
			}
			listData[1].getForm = function() {
				return that.getForm();
			}
			listData[1]._initObj(this._mergeSettings(data));
			
			if (tr._inBlcok) tr.className += " in_block";
			
			return listData[1];
			
		}
		
		if (type == "newcolumn") {
			this._prepare(data.offset);
			return;
		}
		
		if (({input:true,fieldset:true,block:true,password:true,calendar:true,colorpicker:true})[type] !== true) tr.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		
		if (type == "label" && this._ic++ == 0) data._isTopmost = true;
		
		if (type == "select" && this.skin == "dhx_terrace") tr._inpWidthFix=6;
		
		data.position = this.apos_css[(!data.position||!this.apos_css[data.position]?this.i.position:data.position)];
		tr.className = data.position+(typeof(data.className)=="string"?" "+data.className:"");
		
		if (!data.labelWidth) data.labelWidth = this.i.labelWidth;
		if (!data.labelHeight) data.labelHeight = this.i.labelHeight;
		
		if (typeof(data.wrap) != "undefined") data.wrap = this._s2b(data.wrap);
			
		data.labelAlign = (this.align_css[data.labelAlign]?this.align_css[data.labelAlign]:this.align_css[this.i.labelAlign]);
		
		data.inputWidth = (data.width?data.width:(data.inputWidth?data.inputWidth:this.i.inputWidth));
		if (!data.inputHeight) data.inputHeight = this.i.inputHeight;
		
		if (typeof(data.note) != "undefined") {
			if (data.note.length != null && data.note[0] != null) data.note = data.note[0]; // probably array from xml conversion
			if (typeof(data.note.width) == "undefined") data.note.width = this.i.noteWidth;
			if (data.note.width == "auto") data.note.width = data.inputWidth;
		}
		
		tr.checkEvent = function(evName) {
			return that.checkEvent(evName);
		}
		tr.callEvent = function(evName, evData) {
			return that.callEvent(evName, evData);
		}
		tr.getForm = function() {
			return that.getForm();
		}
		tr._autoCheck = function(t) {
			that._autoCheck(t);
		}
		
		// convert r/o
		if (typeof(data.readonly) == "string") data.readonly = this._s2b(data.readonly);
		if (typeof(data.autoStart) == "string") data.autoStart = this._s2b(data.autoStart);
		if (typeof(data.autoRemove) == "string") data.autoRemove = this._s2b(data.autoRemove);
		if (typeof(data.titleScreen) == "string") data.titleScreen = this._s2b(data.titleScreen);
		if (typeof(data.info) == "string") data.info = this._s2b(data.info);
		
		// userdata
		if (typeof(data.userdata) != "undefined") {
			for (var a in data.userdata) this.getForm().setUserData(id,a,data.userdata[a]);
		}
		
		// validate
		if (data.validate) {
			if (typeof(data.validate != "undefined") && (typeof(data.validate) == "function" || typeof(window[data.validate]) == "function")) {
				tr._validate = [data.validate];
			} else {
				tr._validate = String(data.validate).split(this.separator);
			}
		}
		if (typeof(data.required) != "undefined") {
			if (typeof(data.required) == "string") data.required = this._s2b(data.required);
			tr._required = (data.required==true);
		}
		if (tr._required) {
			if (!tr._validate) tr._validate = [];
			var p = false;
			for (q=0; q<tr._validate.length; q++) p = (p||(tr._validate[q]=="NotEmpty"));
			if (!p) tr._validate.push("NotEmpty");
		}
		
		tr._ll = (data.position == this.apos_css["label-left"] || data.position == this.apos_css["label-top"]);
		
		this.objPull[this.idPrefix+id] = this.items[type].render(tr, data);
		this.itemPull[this.idPrefix+id] = tr;
		
	}
	
	/*********************************************************************************************************************************************
		OBJECT INIT
	*********************************************************************************************************************************************/
	
	this._initObj = function(data) {
		
		this._prepare();
		
		// search form settings
		for (var q=0; q<data.length; q++) {
			// add check for incorrect values:
			// position - allow only predefined, this.apos_css
			// labelAlign - allow only predefined, this.align_css
			// input/label top/left/width/height - numeric or auto
			if (typeof(data[q]) != "undefined" && data[q].type == "settings") for (var a in data[q]) this.i[a] = data[q][a];
		}
		
		for (var q=0; q<data.length; q++) {
			
			if (typeof(data[q]) != "undefined") {
			
				var type = (data[q].type||"");
				
				if (this.items[type]) {
					
					if (!data[q].name) data[q].name = this._genStr(12);
					var id = data[q].name;
					if (this.objPull[this.idPrefix+id] != null || type=="radio") id = this._genStr(12);
					
					var obj = data[q];
					obj.label = obj.label||"";
					//obj.value = obj.value||"";
					obj.value = obj.value;
					obj.checked = !!obj.checked;
					obj.disabled = !!obj.disabled;
					obj.name = obj.name||this._genStr(12);
					obj.options = obj.options||[];
					obj.rows = obj.rows||"none";
					obj.uid = this._genStr(12);
					
					this._addItem(type, id, obj);
					
					if (this._parentEnabled === false) this._disableItem(id);
					
					for (var w=0; w<obj.options.length; w++) {
						if (obj.options[w].list != null) {
							if (!obj.options[w].value) obj.options[w].value = this._genStr();
							var subList = this._addItem("list", id, obj.options[w].list, obj.options[w].value);
							subList._subSelect = true;
							subList._subSelectId = obj.options[w].value;
						}
					}
					
					
					if (data[q].list != null) {
						if (!data[q].listParent) data[q].listParent = obj.name;//data[q].name;
						var subList = this._addItem("list", id, data[q].list, null, data[q].listParent);
					}
				}
			}
		}
		this._autoCheck();
	}
	
	/*********************************************************************************************************************************************
		XML
	*********************************************************************************************************************************************/
	
	this._s2b = function(r) {
		if (r == "true" || r == "1" || r == "yes" || r == true) return true;
		return false;
	}
	
	this._xmlSubItems = {item: "list", option: "options", note: "note", userdata: "_userdata"};
	
	this._xmlToObject = function(xmlData, rootLevel) {
		
		var data = (rootLevel?[]:{});
		
		for (var q=0; q<xmlData.childNodes.length; q++) {
			
			if (typeof(xmlData.childNodes[q].tagName) != "undefined") {
				
				var tg = xmlData.childNodes[q].tagName;
				
				if (this._xmlSubItems[tg] != null) {
				
					var node = this._xmlSubItems[tg];
					if (typeof(data[node]) == "undefined") data[node] = [];
					
					// parse attributes
					var k = {};
					for (var w=0; w<xmlData.childNodes[q].attributes.length; w++) {
						var attrName = xmlData.childNodes[q].attributes[w].name;
						var attrValue = xmlData.childNodes[q].attributes[w].value;
						k[attrName] = attrValue;
					}
					
					// parse custom data
					if (node == "note") k.text = xmlData.childNodes[q].firstChild.nodeValue;
					
					// pasrse userdata value
					if (node == "_userdata") k.value = xmlData.childNodes[q].firstChild.nodeValue;
					
					// parse nested items, merge with current
					var data2 = this._xmlToObject(xmlData.childNodes[q]);
					for (var a in data2) {
						if (a == "_userdata") {
							if (!k.userdata) k.userdata = {};
							for (var w=0; w<data2[a].length; w++) k.userdata[data2[a][w].name] = data2[a][w].value;
						} else {
							k[a] = data2[a];
						}
					}
					
					if (rootLevel) data.push(k); else data[node].push(k);
					
				}
				
			}
			
		
		}
		
		return data;
		
	}
	
	this._xmlParser = function() {
		if (that._loadType == "json") {
			eval("var formJSONData="+this.xmlDoc.responseText);
			if (typeof(formJSONData) == "object" && formJSONData != null) that._initObj(formJSONData);
		} else {
			var t = that._xmlToObject(this.getXMLTopNode("items"), true);
			that._initObj(t);
		}
		if (that.cont && that.cont.cmp && that.cont.cmp == "form") that.setSizes();
		that.callEvent("onXLE",[]);
		if (typeof(that._doOnLoad) == "function") that._doOnLoad();
	}
	
	this._doOnLoad = null;
	this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
	
	this.loadStruct = function(a,b,c) {
		this._loadType = "xml";
		if (typeof(b) == "string") {
			if (b.toLowerCase() == "json") {
				this._loadType = "json";
				if (typeof(a) != "string") {
					this._initObj(a);
					return;
				}
			}
			this._doOnLoad = (c||null);
		} else {
			this._doOnLoad = (b||null);
		}
		this.callEvent("onXLS", []);
		this._xmlLoader.loadXML(a);
	}
	this.loadStructString = function(xmlString, onLoadFunction) {
		this._doOnLoad = (onLoadFunction||null);
		this._xmlLoader.loadXMLString(xmlString);
	}
	
	/*********************************************************************************************************************************************
		AUTOCHECK (Global enable/disable functionality)
	*********************************************************************************************************************************************/
	
	this._autoCheck = function(enabled) {
		if (this._locked === true) {
			enabled = false;
		} else {
			if (typeof(enabled) == "undefined") enabled = true;
		}
		for (var a in this.itemPull) {
			var isEnabled = (enabled&&(this.itemPull[a]._udis!==true));
			this[isEnabled?"_enableItem":"_disableItem"](this.itemPull[a]._idd);
			
			// id-index state
			if (this.getForm()._idIndex[this.itemPull[a]._idd] != null) {
				this.getForm()._idIndex[this.itemPull[a]._idd].enabled = isEnabled;
			}
			
			// nested forms
			var pEnabled = (isEnabled&&(typeof(this.itemPull[a]._checked)=="boolean"?this.itemPull[a]._checked:true));
			if (this.itemPull[a]._list) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) {
					var f = true;
					if (this.itemPull[a]._list[q]._subSelect == true) {
						f = false
						var v = this.getItemValue(this.itemPull[a]._idd);
						if (!(typeof(v) == "object" && typeof(v.length) == "number")) v = [v];
						for (var w=0; w<v.length; w++) f = (v[w]==this.itemPull[a]._list[q]._subSelectId)||f;
						this.itemPull[a]._listObj[q][f?"show":"hide"](this.itemPull[a]._listBase[q]);
					}
					this.itemPull[a]._list[q]._autoCheck(pEnabled&&f);
				}
			}
		}
	}
	
	/*********************************************************************************************************************************************
		PUBLIC API
	*********************************************************************************************************************************************/
	
	this.doWithItem = function(id, method, a, b, c, d) {
		// radio		
		if (typeof(id) == "object") {
			var group = id[0];
			var value = id[1];
			var item = null;
			var res = null;
			for (var k in this.itemPull) {
				if ((this.itemPull[k]._value == value || value === null) && this.itemPull[k]._group == group) return this.objPull[k][method](this.itemPull[k], a, b, c, d);
				if (this.itemPull[k]._list != null && !res) {
					for (var q=0; q<this.itemPull[k]._list.length; q++) {
						res = this.itemPull[k]._list[q].doWithItem(id, method, a, b, c);
					}
				}
			}
			if (res != null) {
				return res;
			} else {
				if (method == "getType") return this.doWithItem(id[0], "getType");
			}
		// checkbox, input, select, label
		} else {
			if (!this.itemPull[this.idPrefix+id]) {
				var res = null;
				for (var k in this.itemPull) {
					if (this.itemPull[k]._list && !res) {
						for (var q=0; q<this.itemPull[k]._list.length; q++) {
							if (res == null) res = this.itemPull[k]._list[q].doWithItem(id, method, a, b, c, d);
						}
					}
				}
				return res;
			} else {
				return this.objPull[this.idPrefix+id][method](this.itemPull[this.idPrefix+id], a, b, c, d);
			}
		}
	}
	
	this.removeItem = function(id, value) {
		if (value != null) id = this.doWithItem([id, value], "destruct"); else this.doWithItem(id, "destruct");
		this._clearItemData(id);
	}
	
	this._clearItemData = function(id) {
		if (this.itemPull[this.idPrefix+id]) {
			id = this.idPrefix+id;
			try {
				this.objPull[id] = null;
				this.itemPull[id] = null;
				delete this.objPull[id];
				delete this.itemPull[id];
			} catch(e) {}
		} else {
			for (var k in this.itemPull) {
				if (this.itemPull[k]._list) {
					for (var q=0; q<this.itemPull[k]._list.length; q++) this.itemPull[k]._list[q]._clearItemData(id);
				}
			}
		}
	}
	
	this.isItem = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "isExist");
	}
	
	this.getItemType = function(id, value) {
		id = [id, (value||null)];
		return this.doWithItem(id, "getType");
	}

	/*! returns array of item names (without doubling)
	 **/
	this.getItemsList = function() {
		var list = [];
		var exist = [];
		for (var a in this.itemPull) {
			var id = null;
			if (this.itemPull[a]._group) {
				id = this.itemPull[a]._group;
			} else {
				id = a.replace(this.idPrefix, "");
			}
			if (exist[id] != true)
				list.push(id);
			exist[id] = true;
		}
		return list;
	}
	
	/* iterator */
	this.forEachItem = function(handler) {
		for (var a in this.objPull) {
			handler(String(a).replace(this.idPrefix,""));
			if (this.itemPull[a]._list) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) this.itemPull[a]._list[q].forEachItem(handler);
			}
		}
	}
	
	/* text */
	this.setItemLabel = function(id, value, text) {
		if (text != null) id = [id, value]; else text = value;
		this.doWithItem(id, "setText", text);
	}
	
	this.getItemLabel = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "getText");
	}
	
	this.setItemText = this.setItemLabel;
	this.getItemText = this.getItemLabel;
	
	/* state */
	this._enableItem = function(id) {
		this.doWithItem(id, "enable");
	}
	
	this._disableItem = function(id) {
		this.doWithItem(id, "disable");
	}
	
	this._isItemEnabled = function(id) {
		return this.doWithItem(id, "isEnabled");
	}
	
	/* selection */
	this.checkItem = function(id, value) {
		if (value != null) id = [id, value];
		this.doWithItem(id, "check");
		this._autoCheck();
	}
	
	this.uncheckItem = function(id, value) {
		if (value != null) id = [id, value];
		this.doWithItem(id, "unCheck");
		this._autoCheck();
	}
	
	this.isItemChecked = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "isChecked");
	}
	
	this.getCheckedValue = function(id) {
		return this.doWithItem([id, null], "getChecked");
	}
	
	/* value */
	
	// get radio group by id
	this._getRGroup = function(id, val) {
		for (var a in this.itemPull) {
			if (this.itemPull[a]._group == id && (val == null || this.itemPull[a]._value == val)) return this.itemPull[a]._idd;
			if (this.itemPull[a]._list != null) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) {
					var r = this.itemPull[a]._list[q]._getRGroup(id, val);
					if (r != null) return r;
				}
			}
		}
		return null;
	}
	
	this.setItemValue = function(id, value) {
		if (this.getItemType(id) == "radio") {
			if (this._getRGroup(id, value) != null) this.checkItem(id, value); else this.uncheckItem(id, this.getCheckedValue(id));
			return null;
		}
		return this.doWithItem(id, "setValue", value);
	}
	
	this.getItemValue = function(id, param) {
		this._updateValues();
		if (this.getItemType(id) == "radio") return this.getCheckedValue(id);
		return this.doWithItem(id, "getValue", param);
	}
	
	this.updateValues = function() {
		this._updateValues();
	}
	
	/* visibility */
	this.showItem = function(id, value) {
		if (value != null) id = [id,value];
		this.doWithItem(id, "show");
	}
	
	this.hideItem = function(id, value) {
		if (value != null) id = [id,value];
		this.doWithItem(id, "hide");
	}
	
	this.isItemHidden = function(id, value) {
		if (value != null) id = [id,value];
		return this.doWithItem(id, "isHidden");
	}
	
	/* options (select only) */
	this.getOptions = function(id) {
		return this.doWithItem(id, "getOptions");
	}
	
	/* width/height */
	this.setItemWidth = function(id, width) {
		this.doWithItem(id, "setWidth", width);
	}
	
	this.getItemWidth = function(id) {
		return this.doWithItem(id, "getWidth");
	}
	
	this.setItemHeight = function(id, height) { // textarea
		this.doWithItem(id, "setHeight", height);
	}
	
	this.setItemFocus = function(id) {
		this.doWithItem(id, "setFocus");
	}
	
	/* validation */
	
	// required before validate and data sending for updating values for input, password
	// datasending call validation inside
	this._updateValues = function() {
		for (var a in this.itemPull) {
			if (this.objPull[a] && typeof(this.objPull[a].updateValue) == "function") {
				this.objPull[a].updateValue(this.itemPull[a]);
			}
			if (this.itemPull[a]._list) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) {
					this.itemPull[a]._list[q]._updateValues();
				}
			}
		}
	}
	
	// css
	this._getItemByName = function(id) {
		for (var a in this.itemPull) {
			if (this.itemPull[a]._idd == id) return this.itemPull[a];
			if (this.itemPull[a]._list != null) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) {
					var r = this.itemPull[a]._list[q]._getItemByName(id);
					if (r != null) return r;
				}
			}
		}
		return null;
	}
	this._resetValidateCss = function(item) {
		item.className = (item.className).replace(item._vcss,"");
		item._vcss = null;
	}
	this.setValidateCss = function(name, state, custom) {
		var item = this[this.getItemType(name)=="radio"?"_getRGroup":"_getItemByName"](name);
		if (!item) return;
		if (item._vcss != null) this._resetValidateCss(item);
		item._vcss = (typeof(custom)=="string"?custom:"validate_"+(state===true?"ok":"error"));
		item.className += " "+item._vcss;
	}
	this.resetValidateCss = function(name) {
		for (var a in this.itemPull) {
			if (this.itemPull[a]._vcss != null) this._resetValidateCss(this.itemPull[a]);
			if (this.itemPull[a]._list != null) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) this.itemPull[a]._list[q].resetValidateCss();
			}
		}
	}
	// action
	this.validate = function(type) {
		
		this._updateValues();
		if (this.callEvent("onBeforeValidate",[]) == false) return;
		
		var completed = true;
		
		this.forEachItem(function(name){
			completed = that.doWithItem(name,"_validate") && completed;
		});
		
		this.callEvent("onAfterValidate",[completed]);
		return completed;
		
	}
	
	this.validateItem = function(name) {
		return this.doWithItem(name,"_validate");
	}
	
	this.enableLiveValidation = function(state) {
		this.live_validate = (state==true);
	}
	
	
	/* readonly */
	
	this.setReadonly = function(id, state) {
		this.doWithItem(id, "setReadonly", state);
	}
	
	this.isReadonly = function(id) {
		return this.doWithItem(id, "isReadonly");
	}
	
	/* index */
	
	this.getFirstActive = function(withFocus) {
		for (var q=0; q<this._indexId.length; q++) {
			var k = true;
			if (withFocus == true) {
				var t = this.getItemType(this._indexId[q]);
				if (!dhtmlXForm.prototype.items[t].setFocus) k = false;
			}
			if (k && this._idIndex[this._indexId[q]].enabled) return this._indexId[q];
		}
		return null;
	}
	
	this.setFocusOnFirstActive = function() {
		var k = this.getFirstActive(true);
		if (k != null) this.setItemFocus(k);
	}
	
	/* enable/disable */
	
	this.enableItem = function(id, value) {
		if (value != null) id = [id,value];
		this.doWithItem(id, "userEnable");
		this._autoCheck();
	}
	
	this.disableItem = function(id, value) {
		if (value != null) id = [id,value];
		this.doWithItem(id, "userDisable");
		this._autoCheck();
	}
	
	this.isItemEnabled = function(id, value) {
		if (value != null) id = [id,value];
		return this.doWithItem(id, "isUserEnabled");
	}
	
	this.clear = function() {
		var usedRAs = {};
		this.formId = (new Date()).valueOf();//remove form id, so next operation will be insert
		this.resetDataProcessor("inserted");
		
		for (var a in this.itemPull) {
			var t = this.itemPull[a]._idd;
			// checkbox
			if (this.itemPull[a]._type == "ch") this.uncheckItem(t);
			// input/textarea
			if (this.itemPull[a]._type in {"ta":1,"editor":1,"calendar":1,"pw":1,"hd":1})
				this.setItemValue(t, "");
			// dhxcombo
			if (this.itemPull[a]._type == "combo") (this.getCombo(t)).selectOption(0);
			// select
			if (this.itemPull[a]._type == "se") {
				var opts = this.getOptions(t);
				if (opts.length > 0) opts[0].selected = true;
			}
			// radiobutton
			if (this.itemPull[a]._type == "ra") {
				var g = this.itemPull[a]._group;
				if (!usedRAs[g]) { this.checkItem(g, this.doWithItem(t, "_getFirstValue")); usedRAs[g] = true; }
			}
			// nested lists
			if (this.itemPull[a]._list) for (var q=0; q<this.itemPull[a]._list.length; q++) this.itemPull[a]._list[q].clear();
		}
		usedRAs = null;
		if (this._parentForm) this._autoCheck();
		
		// validate
		this.resetValidateCss();
		
		/*
		for (var a in this.objPull) this.removeItem(String(a).replace(this.idPrefix,""));
		this.objPull = null;
		this.itemPull = null;
		*/
	}
	
	this.unload = function() {
		
		for (var a in this.objPull) this.removeItem(String(a).replace(this.idPrefix,""));
		
		this.detachAllEvents();
		
		if (this._ccTm) window.clearTimeout(this._ccTm);
		this._formLS = null;
		
		this._xmlLoader.destructor();
		this._xmlLoader = null;
		this._xmlParser = null;
		this._xmlToObject = null;
		this.loadXML = null;
		this.loadXMLString = null;
		
		this.items = null;
		this.objPull = null;
		this.itemPull = null;
		
		this._addItem = null;
		this._genStr = null;
		this._initObj = null;
		this._autoCheck = null;
		this._clearItemData = null;
		this._enableItem = null;
		this._disableItem = null;
		this._isItemEnabled = null;
		this.forEachItem = null;
		this.isItem = null;
		this.clear = null;
		this.doWithItem = null;
		this.getItemType = null;
		this.removeItem = null;
		this.unload = null;
		this.getForm = null;
		
		this.attachEvent = null;
		this.callEvent = null;
		this.checkEvent = null;
		this.detachEvent = null;
		this.eventCatcher = null;
		
		this.setItemPosition = null;
		this.getItemPosition = null;
		this._setPosition = null;
		this._getPosition = null;
		
		this.setItemLabel = null;
		this.getItemLabel = null
		this.setItemText = null;
		this.getItemText = null;
		this.setItemValue = null;
		this.getItemValue = null;
		this.showItem = null;
		this.hideItem = null;
		this.isItemHidden = null;
		this.checkItem = null;
		this.uncheckItem = null;
		this.isItemChecked = null;
		this.getOptions = null;
		
		this._ic = null;
		this._ulToObject = null;
		this.loadStruct = null;
		this.loadStructString = null;
		this.remove = null;
		this.setFontSize = null;
		this.setItemHeight = null;
		this.setItemWidth = null;
		this.setSkin = null;
		
		this._rGroup = null;
		this._type = null;
		this._parentEnabled = null;
		this._parentForm = null;
		this._doLock = null;
		this._mergeSettings = null;
		this._locked = null;
		
		this._prepare = null;
		this.detachAllEvents = null;
		this.getCheckedValue = null;
		this.getItemWidth = null;
		this.setUserData = null;
		this.getUserData = null;
		this.setRTL = null;
		this.setSizes = null;
		
		this.getCalendar = null;
		this.getColorPicker = null;
		this.getCombo = null;
		this.getEditor = null;
		
		this.setFormData = null;
		this.getFormData = null;
		this.getItemsList = null;
		this.lock = null;
		this.unlock = null;
		this.isLocked = null;
		this.setReadonly = null;
		this.isReadonly = null;
		
		this.apos_css = null;
		this.align_css = null;
		this.b_index = null;
		this.i = null;
		this.skin = null;
		this.idPrefix = null;
		
		this._subSelect = null;
		this._subSelectId = null;
		
		for (var q=0; q<this.base.length; q++) {
			while (this.base[q].childNodes.length > 0) this.base[q].removeChild(this.base[q].childNodes[0]);
			if (this.base[q].parentNode) this.base[q].parentNode.removeChild(this.base[q]);
			this.base[q] = null;
		}
		this.base = null;
		
		this.cont.onkeypress = null;
		this.cont.className = "";
		this.cont = null;
		
		//try { for (var a in this) delete this[a]; } catch(e) {}
		
	}
	
	for (var a in this.items) {
		
		this.items[a].t = a;
		
		if (typeof(this.items[a]._index) == "undefined") {
			this.items[a]._index = true;
		}
		
		if (!this.items[a].show) {
			this.items[a].show = function(item) {
				item.style.display = "";
				if (item._listObj) for (var q=0; q<item._listObj.length; q++) item._listObj[q].show(item._listBase[q]);
			}
		}
		
		if (!this.items[a].hide) {
			this.items[a].hide = function(item) {
				item.style.display = "none";
				if (item._listObj) for (var q=0; q<item._listObj.length; q++) item._listObj[q].hide(item._listBase[q]);
			}
		}
		
		if (!this.items[a].isHidden) {
			this.items[a].isHidden = function(item) {
				return (item.style.display == "none");
			}
		}
		
		if (!this.items[a].userEnable) {
			this.items[a].userEnable = function(item) {
				item._udis = false;
			}
		}
			
		if (!this.items[a].userDisable) {
			this.items[a].userDisable = function(item) {
				item._udis = true;
			}
		}
		
		if (!this.items[a].isUserEnabled) {
			this.items[a].isUserEnabled = function(item) {
				return (item._udis!==true);
			}
		}
		
		if (!this.items[a].getType) {
			this.items[a].getType = function() {
				return this.t;
			}
		}
		
		if (!this.items[a].isExist) {
			this.items[a].isExist = function() {
				return true;
			}
		}
		
		if (!this.items[a].validate) {
			this.items[a]._validate = function(item) {
				
				if (!item._validate || !item._enabled) return true;
				
				if (item._type == "ch") {
					var val = (this.isChecked(item)?this.getValue(item):0);
				} else {
					var val = this.getValue(item);
				}
				
				var r = true;
				for (var q=0; q<item._validate.length; q++) {
					var v = "is"+item._validate[q];
					
					if ((val == null || val.length == 0) && v != "isNotEmpty") {
						// field not required or empty (+ validate not set to NotEmpty)
					} else {
						var f = dhtmlxValidation[v];
						if (typeof(f) != "function" && typeof(item._validate[q]) == "function") f = item._validate[q];
						if (typeof(f) != "function" && typeof(window[item._validate[q]]) == "function") f = window[item._validate[q]];
						r = ((typeof(f)=="function"?f(val):new RegExp(item._validate[q]).test(val)) && r);
						f = null;
					}
				}
				
				if (!(item.callEvent("onValidate"+(r?"Success":"Error"),[item._idd,val,r])===false)) item.getForm().setValidateCss(item._idd, r);
				
				return r;
			}
		}
		
		
	}
	
	// lock/unlock form
	this._locked = false;
	this._doLock = function(state) {
		var t = (state===true?true:false);
		if (this._locked == t) return; else this._locked = t;
		this._autoCheck(!this._locked);
	}
	this.lock = function() {
		this._doLock(true);
	}
	this.unlock = function() {
		this._doLock(false);
	}
	this.isLocked = function() {
		return this._locked;
	}
	
	// date format for inputs
	this.setNumberFormat = function(id, format, g_sep, d_sep) {
		// return false if format incorrect and true if it successfuly applied
		return this.doWithItem(id, "setNumberFormat", format, g_sep, d_sep);
	}
	
	
	dhtmlxEventable(this);
	this.attachEvent("_onButtonClick", function(name, cmd){
		this.callEvent("onButtonClick", [name, cmd]);
	});
	
	this._updateBlocks = function() {
		this.forEachItem(function(id){
			if (that.getItemType(id) == "block" || that.getItemType(id) == "combo") {
				that.doWithItem(id,"_setCss",that.skin,that.cont.style.fontSize);
			}
		});
	}
	
	// copy init data to prevent init obj extension
	this._isObj = function(k) {
		return (k != null && typeof(k) == "object" && typeof(k.length) == "undefined");
	}
	this._copyObj = function(r) {
		if (this._isObj(r)) {
			var t = {};
			for (var a in r) {
				if (typeof(r[a]) == "object" && r[a] != null) t[a] = this._copyObj(r[a]); else t[a] = r[a];
			}
		} else {
			var t = [];
			for (var a=0; a<r.length; a++) {
				if (typeof(r[a]) == "object" && r[a] != null) t[a] = this._copyObj(r[a]); else t[a] = r[a];
			}
		}
		return t;
	}
	//
	
	if (data != null && typeof(data) == "object") {
		this._initObj(this._copyObj(data));
	};
	
	if (this._parentForm) {
		this._updateBlocks();
	}
	
	// ls for input change, affected: input, select, pwd, calendar, colorpicker
	this._ccActive = false;
	this._ccTm = null;
	
	this._ccActivate = function(id, inp, val) {
		
		if (!this._formLS) this._formLS = {};
		if (!this._formLS[id]) this._formLS[id] = {input: inp, value: val};
		if (!this._ccActive) {
			this._ccActive = true;
			this._ccDo();
		}
		inp = null;
		
	}
	
	this._ccDeactivate = function(id) {
		if (this._ccTm) window.clearTimeout(this._ccTm);
		
		this._ccActive = false;
		
		if (this._formLS != null && this._formLS[id] != null) {
			this._formLS[id].input = null;
			this._formLS[id] = null;
			delete this._formLS[id];
		}
	}
	
	this._ccDo = function() {
		
		if (this._ccTm) window.clearTimeout(this._ccTm);
		
		for (var a in this._formLS) {
			
			var inp = this._formLS[a].input;
			
			if (String(inp.tagName).toLowerCase() == "select") {
				var v = "";
				if (inp.selectedIndex >= 0 && inp.selectedIndex < inp.options.length) v = inp.options[inp.selectedIndex].value;
			} else {
				var v = inp.value;
			}
			if (v != this._formLS[a].value) {
				this._formLS[a].value = v;
				this.callEvent("onInputChange",[inp._idd,v,this]);
			}
			inp = null;
			
		}
			
		if (this._ccActive) this._ccTm = window.setTimeout(function(){that._ccDo();},100);
		
	}
	
	
	return this;
	
};

dhtmlXForm.prototype.getInput = function(id) {
	return this.doWithItem(id, "getInput");
};

dhtmlXForm.prototype.getSelect = function(id) {
	return this.doWithItem(id, "getSelect");
};


dhtmlXForm.prototype.items = {};

/* checkbox */
dhtmlXForm.prototype.items.checkbox = {
	
	render: function(item, data) {
		
		item._type = "ch";
		item._enabled = true;
		item._checked = false;
		item._value = (typeof(data.value)=="undefined"?null:String(data.value));
		item._ro = (data.readonly==true);
		
		if (data._autoInputWidth !== false) data.inputWidth = 14;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "TEXT", true, true, "dhxform_textarea");
		
		item.childNodes[item._ll?1:0].className += " dhxform_img_node";
		
		var p = document.createElement("DIV");
		p.className = "dhxform_img chbx0";
		item.appendChild(p);
		
		if (!isNaN(data.inputLeft)) item.childNodes[item._ll?1:0].style.left = parseInt(data.inputLeft)+"px";
		if (!isNaN(data.inputTop)) item.childNodes[item._ll?1:0].style.top = parseInt(data.inputTop)+"px";
		
		item.childNodes[item._ll?1:0].appendChild(p);
		item.childNodes[item._ll?1:0].firstChild.value = String(data.value);
		
		item._updateImgNode = function(item, state) {
			if (item.getForm().skin != "dhx_terrace") return;
			var t = item.childNodes[item._ll?1:0].lastChild;
			
			if (state) {
				t.className = t.className.replace(/dhxform_img/gi,"dhxform_actv_c");
			} else {
				t.className = t.className.replace(/dhxform_actv_c/gi,"dhxform_img");
			}
			t = null;
		}
		
		if (data.checked == true) this.check(item);
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		this.doAttachEvents(item);
		
		return this;
	},
	
	destruct: function(item) {
		
		this.doUnloadNestedLists(item);
		this.doDestruct(item);
	},
	
	doAddLabel: function(item, data) {
		
		var t = document.createElement("DIV");
		t.className = "dhxform_label "+data.labelAlign;
		
		if (data.wrap == true) t.style.whiteSpace = "normal";
		
		if (item._ll) {
			item.insertBefore(t,item.firstChild);
		} else {
			item.appendChild(t);
		}
		
		if (typeof(data.tooltip) != "undefined") t.title = data.tooltip;
		
		t.innerHTML = "<div class='dhxform_label_nav_link' "+
				"onfocus='if(this.parentNode.parentNode._updateImgNode)this.parentNode.parentNode._updateImgNode(this.parentNode.parentNode,true);' "+
				"onblur='if(this.parentNode.parentNode._updateImgNode)this.parentNode.parentNode._updateImgNode(this.parentNode.parentNode,false);' "+
				"onkeypress='e=event||window.arguments[0];if(e.keyCode==32||e.charCode==32){e.cancelBubble=true;e.returnValue=false;_dhxForm_doClick(this,\"mousedown\");return false;}' "+
				(_dhxForm_isIPad?"ontouchstart='e=event;e.preventDefault();_dhxForm_doClick(this,\"mousedown\");' ":"")+
				"role='link' tabindex='0'>"+data.label+(data.info?"<span class='dhxform_info'>[?]</span>":"")+(item._required?"<span class='dhxform_item_required'>*</span>":"")+'</div>';
		
		if (!isNaN(data.labelWidth)) t.firstChild.style.width = parseInt(data.labelWidth)+"px";
		if (!isNaN(data.labelHeight)) t.firstChild.style.height = parseInt(data.labelHeight)+"px";
		
		if (!isNaN(data.labelLeft)) t.style.left = parseInt(data.labelLeft)+"px";
		if (!isNaN(data.labelTop)) t.style.top = parseInt(data.labelTop)+"px";
		
	},
	
	doAddInput: function(item, data, el, type, pos, dim, css) {
		
		var p = document.createElement("DIV");
		p.className = "dhxform_control";
		
		if (item._ll) {
			item.appendChild(p);
		} else {
			item.insertBefore(p,item.firstChild);
		}
		
		var t = document.createElement(el);
		t.className = css;
		t.name = item._idd;
		t._idd = item._idd;
		t.id = data.uid;
		
		if (typeof(type) == "string") t.type = type;
		
		if (el == "INPUT" || el == "TEXTAREA") {
			t.onkeyup = function(e) {
				e = e||event;
				item.callEvent("onKeyUp",[this,e]);
			};
		}
		/*
		if (el == "INPUT" || el == "TEXTAREA" || el == "SELECT") {
			var id2 = item.getForm()._rId;
			if (window.dhtmlXFormLs && window.dhtmlXFormLs[id2]) {
				window.dhtmlXFormLs[id2].inps.push(t);
				window.dhtmlXFormLs[id2].vals[t._idd] = "";
			}
		}
		*/
		
		p.appendChild(t);
		
		if (data.readonly) this.setReadonly(item, true);
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		if (pos) {
			if (!isNaN(data.inputLeft)) p.style.left = parseInt(data.inputLeft)+"px";
			if (!isNaN(data.inputTop)) p.style.top = parseInt(data.inputTop)+"px";
		}
		
		var u = "";
		
		if (dim) {
			if (!isNaN(data.inputWidth)) u += "width:"+parseInt(data.inputWidth)+"px;";
			if (!isNaN(data.inputHeight)) u += "height:"+parseInt(data.inputHeight)+"px;";
			
		}
		if (typeof(data.style) == "string") u += data.style;
		t.style.cssText = u;
	
		if (data.maxLength) t.setAttribute("maxLength", data.maxLength);
		if (data.connector) t.setAttribute("connector",data.connector);
		
		if (typeof(data.note) == "object") {
			var note = document.createElement("DIV");
			note.className = "dhxform_note";
			note.style.width = (isNaN(data.note.width)?t.offsetWidth:parseInt(data.note.width))+"px";
			note._w = data.note.width;
			note.innerHTML = data.note.text;
			p.appendChild(note);
			note = null;
		}
		
	},
	
	doUnloadNestedLists: function(item) {
		
		if (!item._list) return;
		for (var q=0; q<item._list.length; q++) {
			item._list[q].unload();
			item._list[q] = null;
			item._listObj[q] = null;
			item._listBase[q].parentNode.removeChild(item._listBase[q]);
			item._listBase[q] = null;
		}
		item._list = null;
		item._listObj = null;
		item._listBase = null;
	},
	
	doDestruct: function(item) {
		
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		
		item._autoCheck = null;
		item._checked = null;
		item._enabled = null;
		item._idd = null;
		item._type = null;
		item._value = null;
		item._group = null;
		
		item.onselectstart = null;
		
		item.childNodes[item._ll?1:0].onmousedown = null;
		item.childNodes[item._ll?1:0].ontouchstart = null;
		
		item.childNodes[item._ll?0:1].onmousedown = null;
		item.childNodes[item._ll?0:1].ontouchstart = null;
		
		item.childNodes[item._ll?0:1].childNodes[0].onkeypress = null;
		item.childNodes[item._ll?0:1].childNodes[0].ontouchstart = null;
		item.childNodes[item._ll?0:1].removeChild(item.childNodes[item._ll?0:1].childNodes[0]);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	doAttachEvents: function(item) {
		var that = this;
		// image click
		item.childNodes[item._ll?1:0][_dhxForm_isIPad?"ontouchstart":"onmousedown"] = function(e) {
			e = e||event;
			if (e.preventDefault) e.preventDefault();
			var t = (e.target||e.srcElement); // need to skip "note" if exists
			if (!this.parentNode._enabled || this.parentNode._ro || (typeof(t.className) != "undefined" && t.className == "dhxform_note")) {
				e.cancelBubble = true;
				e.returnValue = false;
				return false;
			}
			that.doClick(this.parentNode);
		}
		// label click
		item.childNodes[item._ll?0:1].childNodes[0][_dhxForm_isIPad?"ontouchstart":"onmousedown"] = function(e) {
			e = e||event;
			if (e.preventDefault) e.preventDefault();
			// do not check if r/o here, allow item's be highlighted, check for r/o added into doClick
			if (!this.parentNode.parentNode._enabled) {
				e.cancelBubble = true;
				e.returnValue = false;
				return false;
			}
			// check if "info" clicked (checkbox/radio only)
			var t = e.target||e.srcElement;
			if (typeof(t.className) != "undefined" && t.className == "dhxform_info") {
				this.parentNode.parentNode.callEvent("onInfo",[this.parentNode.parentNode._idd]);
				e.cancelBubble = true;
				e.returnValue = false;
				return false;
			}
			that.doClick(this.parentNode.parentNode);
		}
	},
	
	doClick: function(item) {
		
		item.childNodes[item._ll?0:1].childNodes[0].focus();
		
		if (!item._enabled || item._ro) return;
		
		if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange", [item._idd, item._value, item._checked]) !== true) return;
		
		this.setChecked(item, !item._checked);
		item._autoCheck();
		item.callEvent("onChange", [item._idd, item._value, item._checked]);
	},
	
	doCheckValue: function(item) {
		if (item._checked && item._enabled) {
			item.childNodes[item._ll?1:0].firstChild.setAttribute("name", String(item._idd));
		} else {
			item.childNodes[item._ll?1:0].firstChild.removeAttribute("name");
		}
	},
	
	setChecked: function(item, state) {
		item._checked = (state===true?true:false);
		//item.childNodes[item._ll?1:0].lastChild.className = "dhxform_img "+(item._checked?"chbx1":"chbx0");
		item.childNodes[item._ll?1:0].lastChild.className = item.childNodes[item._ll?1:0].lastChild.className.replace(/chbx[0-1]{1}/gi,"")+(item._checked?" chbx1":" chbx0");
		this.doCheckValue(item);
	},
	
	check: function(item) {
		this.setChecked(item, true);
	},
	
	unCheck: function(item) {
		this.setChecked(item, false);
	},
	
	isChecked: function(item) {
		return item._checked;
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
		item.childNodes[item._ll?0:1].childNodes[0].tabIndex = 0;
		item.childNodes[item._ll?0:1].childNodes[0].removeAttribute("disabled");
		this.doCheckValue(item);
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
		item.childNodes[item._ll?0:1].childNodes[0].tabIndex = -1;
		item.childNodes[item._ll?0:1].childNodes[0].setAttribute("disabled", "true");
		this.doCheckValue(item);
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setText: function(item, text) {
		item.childNodes[item._ll?0:1].childNodes[0].innerHTML = text;
	},
	
	getText: function(item) {
		return item.childNodes[item._ll?0:1].childNodes[0].innerHTML;
	},
	
	setValue: function(item, value) {
		this.setChecked(item,(value===true||item._value===value));
	},
	
	getValue: function(item) {
		return ((typeof(item._value)=="undefined"||item._value==null)?(item._checked?1:0):item._value);
	},
	
	setReadonly: function(item, state) {
		item._ro = (state===true);
	},
	
	isReadonly: function(item) {
		return item._ro;
	}
	
};

/* radio */
dhtmlXForm.prototype.items.radio = {
	
	input: {},
	
	r: {},
	
	firstValue: {},
	
	render: function(item, data, uid) {
		
		item._type = "ra";
		item._enabled = true;
		item._checked = false;
		item._group = data.name;
		item._value = data.value;
		item._uid = uid;
		item._ro = (data.readonly==true);
		
		this.r[item._idd] = item;
		
		data.inputWidth = 14;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "TEXT", true, true, "dhxform_textarea");
		
		item.childNodes[item._ll?1:0].className += " dhxform_img_node";
		
		// radio img
		var p = document.createElement("DIV");
		p.className = "dhxform_img rdbt0";
		item.appendChild(p);
		
		if (!isNaN(data.inputLeft)) item.childNodes[item._ll?1:0].style.left = parseInt(data.inputLeft)+"px";
		if (!isNaN(data.inputTop)) item.childNodes[item._ll?1:0].style.top = parseInt(data.inputTop)+"px";
		
		item.childNodes[item._ll?1:0].appendChild(p);
		item.childNodes[item._ll?1:0].firstChild.value = String(data.value);
		
		item._updateImgNode = function(item, state) {
			if (item.getForm().skin != "dhx_terrace") return;
			var t = item.childNodes[item._ll?1:0].lastChild;
			
			if (state) {
				t.className = t.className.replace(/dhxform_img/gi,"dhxform_actv_r");
			} else {
				t.className = t.className.replace(/dhxform_actv_r/gi,"dhxform_img");
			}
			t = null;
		}
		
		// input
		if (this.input[data.name] == null) {
			var k = document.createElement("INPUT");
			k.type = "HIDDEN";
			k.name = data.name;
			k.firstValue = item._value;
			item.appendChild(k);
			this.input[data.name] = k;
		}
		
		if (!this.firstValue[data.name]) this.firstValue[data.name] = data.value;
		
		if (data.checked == true) this.check(item);
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		this.doAttachEvents(item);
		
		return this;
	},
	
	destruct: function(item, value) {
		
		// check if any items will left to keep hidden input on page
		
		if (item.lastChild == this.input[item._group]) {
			var done = false;
			for (var a in this.r) {
				if (!done && this.r[a]._group == item._group && this.r[a]._idd != item._idd) {
					this.r[a].appendChild(this.input[item._group]);
					done = true;
				}
			}
			if (!done) {
				// remove hidden input
				this.input[item._group].parentNode.removeChild(this.input[item._group]);
				this.input[item._group] = null;
				this.firstValue[item._group] = null;
			}
		}
		
		var id = item._idd;
		
		this.doUnloadNestedLists(item);
		this.doDestruct(item);
		
		return id;
		
	},
	
	doClick: function(item) {
		
		item.childNodes[item._ll?0:1].childNodes[0].focus();
		
		if (!(item._enabled && !item._checked)) return;
		if (item._ro) return;
		
		var args = [item._group, item._value, true];
		if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange", args) !== true) return;
		this.setChecked(item, true);
		item.getForm()._autoCheck();
		item.callEvent("onChange", args);
		
	},
	
	doCheckValue: function(item) {
		var value = null;
		for (var a in this.r) {
			if (this.r[a]._checked && this.r[a]._enabled && this.r[a]._group == item._group && this.r[a]._rId == item._rId) value = this.r[a]._value;
		}
		if (value != null) {
			this.input[item._group].setAttribute("name", String(item._group));
			this.input[item._group].setAttribute("value", value);
			this.input[item._group]._value = value;
		} else {
			this.input[item._group].removeAttribute("name");
			this.input[item._group].removeAttribute("value");
			this.input[item._group]._value = null;
		}
	},
	
	setChecked: function(item, state) {
		state = (state===true);
		for (var a in this.r) {
			if (this.r[a]._group == item._group && this.r[a]._rId == item._rId) {
				var needCheck = false;
				if (this.r[a]._idd == item._idd) {
					if (this.r[a]._checked != state) { this.r[a]._checked = state; needCheck = true; }
				} else {
					if (this.r[a]._checked) { this.r[a]._checked = false; needCheck = true; }
				}
				if (needCheck) {
					var t = this.r[a].childNodes[this.r[a]._ll?1:0].childNodes[1];
					t.className = t.className.replace(/rdbt[0-1]{1}/gi,"")+(this.r[a]._checked?" rdbt1":" rdbt0");
					t = null;
				}
			}
		}
		this.doCheckValue(item);
	},
	
	getChecked: function(item) {
		return this.input[item._group]._value;
	},
	
	_getFirstValue: function(item) {
		return this.firstValue[item._group];
	},
	
	_getId: function(item) {
		return item._idd; // return inner id by name/value
	},
	
	setValue: function(item, value) {
		// this method will never called at all
	}
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doDestruct:1,doUnloadNestedLists:1,doAttachEvents:1,check:1,unCheck:1,isChecked:1,enable:1,disable:1,isEnabled:1,setText:1,getText:1,getValue:1,setReadonly:1,isReadonly:1})
		dhtmlXForm.prototype.items.radio[a] = dhtmlXForm.prototype.items.checkbox[a];
})();


/* select */
dhtmlXForm.prototype.items.select = {
	
	render: function(item, data) {
		
		item._type = "se";
		item._enabled = true;
		item._value = null;
		item._newValue = null;
		
		// in ff borders included into width
		if ((_isFF||_isIE) && typeof(data.inputWidth) == "number") data.inputWidth+=(item._inpWidthFix||2);
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "SELECT", null, true, true, "dhxform_select");
		this.doAttachEvents(item);
		this.doLoadOpts(item, data);
		
		if (data.connector) {
			var that = this;
			item._connector_working = true;
			dhtmlxAjax.get(data.connector, function(loader) {
				var opts = loader.doXPath("//item");
				var opt_data = [];
				for (var i=0; i<opts.length; i++) {
					opt_data[i] = {label:opts[i].getAttribute("label"), value:opts[i].getAttribute("value"), selected: (opts[i].getAttribute("selected")!=null)};
				};
				that.doLoadOpts(item, {options:opt_data}, true);
				// try to set value if it was called while options loading was in progress
				item._connector_working = false;
				if (item._connector_value != null) {
					that.setValue(item, item._connector_value);
					item._connector_value = null;
				}
			});
		}
		
		return this;
	},
	
	destruct: function(item) {
		
		this.doUnloadNestedLists(item);
		
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		
		item._autoCheck = null;
		item._enabled = null;
		item._idd = null;
		item._type = null;
		item._value = null;
		item._newValue = null;
		
		item.onselectstart = null;
		
		item.childNodes[item._ll?1:0].childNodes[0].onclick = null;
		item.childNodes[item._ll?1:0].childNodes[0].onkeydown = null;
		item.childNodes[item._ll?1:0].childNodes[0].onchange = null;
		item.childNodes[item._ll?1:0].childNodes[0].onfocus = null;
		item.childNodes[item._ll?1:0].childNodes[0].onblur = null;
		item.childNodes[item._ll?1:0].childNodes[0].onkeyup = null;
		item.childNodes[item._ll?1:0].removeChild(item.childNodes[item._ll?1:0].childNodes[0]);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	doAddLabel: function(item, data) {
		
		var j = document.createElement("DIV");
		j.className = "dhxform_label "+data.labelAlign;
		j.innerHTML = "<label for='"+data.uid+"'>"+
				data.label+
				(data.info?"<span class='dhxform_info'>[?]</span>":"")+
				(item._required?"<span class='dhxform_item_required'>*</span>":"")+
				"</label>";
		//
		if (data.wrap == true) j.style.whiteSpace = "normal";
		
		if (typeof(data.tooltip) != "undefined") j.title = data.tooltip;
		
		item.appendChild(j);
		
		if (typeof(data.label) == "undefined" || data.label == null || data.label.length == 0) j.style.display = "none";
		
		if (!isNaN(data.labelWidth)) j.style.width = parseInt(data.labelWidth)+"px";
		if (!isNaN(data.labelHeight)) j.style.height = parseInt(data.labelHeight)+"px";
		
		if (!isNaN(data.labelLeft)) j.style.left = parseInt(data.labelLeft)+"px";
		if (!isNaN(data.labelTop)) j.style.top = parseInt(data.labelTop)+"px";
		
		if (data.info) {
			j.onclick = function(e) {
				e = e||event;
				var t = e.target||e.srcElement;
				if (typeof(t.className) != "undefined" && t.className == "dhxform_info") {
					this.parentNode.callEvent("onInfo",[this.parentNode._idd]);
					e.cancelBubble = true;
					e.returnValue = false;
					return false;
				}
			}
		}
	},
	
	doAttachEvents: function(item) {
		
		var t = item.childNodes[1].childNodes[0];
		var that = this;
		
		t.onclick = function() {
			that.doOnChange(this);
			that.doValidate(this.parentNode.parentNode);
		}
		t.onkeydown = function() {
			that.doOnChange(this);
			that.doValidate(this.parentNode.parentNode);
		}
		t.onchange = function() { // needed for safari/chrome
			that.doOnChange(this);
			that.doValidate(this.parentNode.parentNode);
		}
		t = null;
		
		this.doAttachChangeLS(item);
	},
	
	doAttachChangeLS: function(item) {
		var t = item.childNodes[1].childNodes[0];
		t.onfocus = function() {
			var i = this.parentNode.parentNode;
			i.getForm()._ccActivate(i._idd, this, i.getForm().getItemValue(i._idd,true));
		}
		t.onblur = function() {
			var i = this.parentNode.parentNode;
			i.getForm()._ccDeactivate(i._idd);
		}
		t = null;
	},
	
	doValidate: function(item) {
		if (item.getForm().live_validate) this._validate(item);
	},
	
	doLoadOpts: function(item, data, callEvent) {
		var t = item.childNodes[item._ll?1:0].childNodes[0];
		var opts = data.options;
		for (var q=0; q<opts.length; q++) {
			var t0 = opts[q].text||opts[q].label;
			if (!t0 || typeof(t0) == "undefined") t0 = "";
			var opt = new Option(t0, opts[q].value);
			if (typeof(opts[q].img_src) == "string") opt.setAttribute("img_src", opts[q].img_src);
			t.options.add(opt);
			if (opts[q].selected == true || opts[q].selected == "true") {
				opt.selected = true;
				item._value = opts[q].value;
			}
		}
		if (callEvent === true) item.callEvent("onOptionsLoaded", [item._idd]);
		// fix note if width set to auto
		this._checkNoteWidth(item);
	},
	
	doOnChange: function(sel) {
		var item = sel.parentNode.parentNode;
		item._newValue = (sel.selectedIndex>=0?sel.options[sel.selectedIndex].value:null);
		if (item._newValue != item._value) {
			if (item.checkEvent("onBeforeChange")) {
				if (item.callEvent("onBeforeChange", [item._idd, item._value, item._newValue]) !== true) {
					// restore last value
					for (var q=0; q<sel.options.length; q++) if (sel.options[q].value == item._value) sel.options[q].selected = true;
					return;
				}
			}
			item._value = item._newValue;
			item.callEvent("onChange", [item._idd, item._value]);
		}
		item._autoCheck();
	},
	
	setText: function(item, text) {
		if (!text) text = "";
		item.childNodes[item._ll?0:1].childNodes[0].innerHTML = text;
		item.childNodes[item._ll?0:1].style.display = (text.length==0||text==null?"none":"");
	},
	
	getText: function(item) {
		return item.childNodes[item._ll?0:1].childNodes[0].innerHTML;
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
		item.childNodes[item._ll?1:0].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
		item.childNodes[item._ll?1:0].childNodes[0].setAttribute("disabled", true);
	},
	
	getOptions: function(item) {
		return item.childNodes[item._ll?1:0].childNodes[0].options;
	},
	
	setValue: function(item, val) {
		if (item._connector_working) { // attemp to set value while optins not yet loaded (connector used)
			item._connector_value = val;
			return;
		}
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) {
			if (opts[q].value == val) {
				opts[q].selected = true;
				item._value = opts[q].value;
			}
		}
		//window.dhtmlXFormLs[item.getForm()._rId].vals[item._idd] = item._value;
	},
	
	getValue: function(item) {
		var k = -1;
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) if (opts[q].selected) k = opts[q].value;
		return k;
	},
	
	setWidth: function(item, width) {
		item.childNodes[item._ll?1:0].childNodes[0].style.width = width+"px";
	},
	
	getSelect: function(item) {
		return item.childNodes[item._ll?1:0].childNodes[0];
	},
	
	setFocus: function(item) {
		item.childNodes[item._ll?1:0].childNodes[0].focus();
	},
	
	_checkNoteWidth: function(item) {
		var t;
		if (item.childNodes[item._ll?1:0].childNodes[1] != null) {
			t = item.childNodes[item._ll?1:0].childNodes[1];
			if (t.className != null && t.className.search(/dhxform_note/gi) >= 0 && t._w == "auto") t.style.width = item.childNodes[item._ll?1:0].childNodes[0].offsetWidth+"px";
		}
		t = null;
	}
	
};
(function(){
	for (var a in {doAddInput:1,doUnloadNestedLists:1,isEnabled:1})
		dhtmlXForm.prototype.items.select[a] = dhtmlXForm.prototype.items.checkbox[a];
})();

/* multiselect */
dhtmlXForm.prototype.items.multiselect = {
	
	doLoadOpts: function(item, data, callEvent) {
		var t = item.childNodes[item._ll?1:0].childNodes[0];
		t.multiple = true;
		if (!isNaN(data.size)) t.size = Number(data.size);
		item._value = [];
		item._newValue = [];
		var opts = data.options;
		for (var q=0; q<opts.length; q++) {
			var opt = new Option(opts[q].text||opts[q].label, opts[q].value);
			t.options.add(opt);
			if (opts[q].selected == true || opts[q].selected == "true") {
				opt.selected = true;
				item._value.push(opts[q].value);
			}
		}
		if (callEvent === true) item.callEvent("onOptionsLoaded", [item._idd]);
		//
		this._checkNoteWidth(item);
	},
	
	doAttachEvents: function(item) {
			
		var t = item.childNodes[item._ll?1:0].childNodes[0];
		var that = this;
		
		t.onblur = function() {
			that.doOnChange(this);
		}
		
		t.onclick = function() {
			item._autoCheck();
		}
		
	},
	
	doOnChange: function(sel) {
		
		var item = sel.parentNode.parentNode;
		
		item._newValue = [];
		for (var q=0; q<sel.options.length; q++) if (sel.options[q].selected) item._newValue.push(sel.options[q].value);
		
		if ((item._value).sort().toString() != (item._newValue).sort().toString()) {
			if (item.checkEvent("onBeforeChange")) {
				if (item.callEvent("onBeforeChange", [item._idd, item._value, item._newValue]) !== true) {
					// restore last value
					var k = {};
					for (var q=0; q<item._value.length; q++) k[item._value[q]] = true;
					for (var q=0; q<sel.options.length; q++) sel.options[q].selected = (k[sel.options[q].value] == true);
					k = null;
					return;
				}
			}
			item._value = [];
			for (var q=0; q<item._newValue.length; q++) item._value.push(item._newValue[q]);
			item.callEvent("onChange", [item._idd, item._value]);
		}
		
		// check autocheck for multiselect
		item._autoCheck();
		
	},
	
	setValue: function(item, val) {
		
		var k = {};
		if (typeof(val) == "string") val = val.split(",");
		if (typeof(val) != "object") val = [val];
		for (var q=0; q<val.length; q++) k[val[q]] = true;
		
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) opts[q].selected = (k[opts[q].value] == true);
		
		item._autoCheck();
	},
	
	getValue: function(item) {
		
		var k = [];
		
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) if (opts[q].selected) k.push(opts[q].value);
		return k;
	}
};

(function() {
	for (var a in dhtmlXForm.prototype.items.select) {
		if (!dhtmlXForm.prototype.items.multiselect[a]) dhtmlXForm.prototype.items.multiselect[a] = dhtmlXForm.prototype.items.select[a];
	}
})();

/* input */
dhtmlXForm.prototype.items.input = {
	
	render: function(item, data) {
		
		var ta = (!isNaN(data.rows));
		
		item._type = "ta";
		item._enabled = true;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, (ta?"TEXTAREA":"INPUT"), (ta?null:"TEXT"), true, true, "dhxform_textarea");
		this.doAttachEvents(item);
		
		if (ta) item.childNodes[item._ll?1:0].childNodes[0].rows = data.rows;
		
		if (typeof(data.numberFormat) != "undefined") {
			var a,b=null,c=null;
			if (typeof(data.numberFormat) != "string") {
				a = data.numberFormat[0];
				b = data.numberFormat[1]||null;
				c = data.numberFormat[2]||null;
			} else {
				a = data.numberFormat;
				if (typeof(data.groupSep) == "string") b = data.groupSep;
				if (typeof(data.decSep) == "string") c = data.decSep;
			}
			this.setNumberFormat(item, a, b, c, false);
		}
		
		this.setValue(item, data.value);
		
		return this;
		
	},
	
	doAttachEvents: function(item) {
		
		var that = this;
		
		if (item._type == "ta" || item._type == "se" || item._type == "pw") {
			item.childNodes[item._ll?1:0].childNodes[0].onfocus = function() {
				var i = this.parentNode.parentNode;
				if (i._df != null) this.value = i._value||"";
				i.getForm()._ccActivate(i._idd, this, this.value);
			}
		}
		
		item.childNodes[item._ll?1:0].childNodes[0].onblur = function() {
			var i = this.parentNode.parentNode;
			i.getForm()._ccDeactivate(i._idd);
			that.updateValue(i);
			if (i.getForm().live_validate) that._validate(i);
			i = null;
		}
	},
	
	updateValue: function(item) {
		var value = item.childNodes[item._ll?1:0].childNodes[0].value;
		if (item._df != null && value == this._getFmtValue(item, value)) return;
		var t = this;
		if (item._value != value) {
			if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange",[item._idd, item._value, value]) !== true) {
				// restore
				if (item._df != null) t.setValue(item, item._value); else item.childNodes[item._ll?1:0].childNodes[0].value = item._value;
				return;
			}
			// accepted
			if (item._df != null) t.setValue(item, value); else item._value = value;
			item.callEvent("onChange",[item._idd, value]);
			return;
		}
		if (item._df != null) this.setValue(item, item._value);
	},
	
	setValue: function(item, value) {
		// with null/undef
		/*
		item._value = value;
		if (item.childNodes[item._ll?1:0].childNodes[0].value != (item._value||"")) item.childNodes[item._ll?1:0].childNodes[0].value = (item._value||"");
		window.dhtmlXFormLs[item.getForm()._rId].vals[item._idd] = item.childNodes[1].childNodes[0].value;
		*/
		
		// str only
		item._value = (typeof(value) != "undefined" && value != null ? value : "");
		
		var v = (item._value||"");
		var k = item.childNodes[item._ll?1:0].childNodes[0];
		
		// check if formatting available
		if (item._df != null && typeof(this._getFmtValue) == "function") v = this._getFmtValue(item, v);
		
		if (k.value != v) {
			k.value = v;
			//window.dhtmlXFormLs[item.getForm()._rId].vals[item._idd] = k.value;
		}
		
		k = null;
	},
	
	getValue: function(item) {
		// with null/undef
		/*
		return item._value;
		*/
		// str only
		return (typeof(item._value) != "undefined" && item._value != null ? item._value : "");
	},
	
	setReadonly: function(item, state) {
		item._ro = (state===true);
		if (item._ro) {
			item.childNodes[item._ll?1:0].childNodes[0].setAttribute("readOnly", "true");
		} else {
			item.childNodes[item._ll?1:0].childNodes[0].removeAttribute("readOnly");
		}
	},
	
	isReadonly: function(item) {
		if (!item._ro) item._ro = false;
		return item._ro;
	},
	
	getInput: function(item) {
		return item.childNodes[item._ll?1:0].childNodes[0];
	},
	
	setNumberFormat: function(item, format, g_sep, d_sep, refresh) {
		
		if (typeof(refresh) != "boolean") refresh = true;
		
		if (format == "") {
			item._df = null;
			if (refresh) this.setValue(item, item._value);
			return true;
		}
		
		if (typeof(format) != "string") return;
		
		var t = format.match(/^([^\.\,0-9]*)([0\.\,]*)([^\.\,0-9]*)/);
		// t = [whole str, before, format, after]
		if (t == null || t.length != 4) return false;
		
		item._df = {
			// int group
			i_len: false,
			i_sep: (typeof(g_sep)=="string"?g_sep:","),
			// decimal
			d_len: false,
			d_sep: (typeof(d_sep)=="string"?d_sep:"."),
			// chars before and after
			s_bef: (typeof(t[1])=="string"?t[1]:""),
			s_aft: (typeof(t[3])=="string"?t[3]:"")
		};
		
		var f = t[2].split(".");
		if (f[1] != null) item._df.d_len = f[1].length;
		
		var r = f[0].split(",");
		if (r.length > 1) item._df.i_len = r[r.length-1].length;
		
		if (refresh) this.setValue(item, item._value);
		
		return true;
		
	},
	
	_getFmtValue: function(item, v) {
		
		var r = v.match(/^(-)?([0-9]{1,})(\.([0-9]{1,}))?$/);
		// r = [coplete value, minus sign, integer, full decimal, decimal]
		if (r != null && r.length == 5) {
			var v0 = "";
			// minus sign
			if (r[1] != null) v0 += r[1];
			// chars before
			v0 += item._df.s_bef;
			// int part
			if (item._df.i_len !== false) {
				var i = 0; var v1 = "";
				for (var q=r[2].length-1; q>=0; q--) {
					v1 = ""+r[2][q]+v1;
					if (++i == item._df.i_len && q > 0) { v1=item._df.i_sep+v1; i=0; }
				}
				v0 += v1;
			} else {
				v0 += r[2];
			}
			// dec part
			if (item._df.d_len !== false) {
				if (r[4] == null) r[4] = "";
				while (r[4].length < item._df.d_len) r[4] += "0";
				eval("var t0 = new RegExp(/\\d{"+item._df.d_len+"}/);");
				var t1 = (r[4]).match(t0);
				if (t1 != null) v0 += item._df.d_sep+t1;
				t0 = t1 = null;
			}
			// chars after
			v0 += item._df.s_aft;
			
			return v0;
		}
		
		return v;
	}
	
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,destruct:1,doUnloadNestedLists:1,setText:1,getText:1,enable:1,disable:1,isEnabled:1,setWidth:1,setFocus:1})
		dhtmlXForm.prototype.items.input[a] = dhtmlXForm.prototype.items.select[a];
})();


/* password */
dhtmlXForm.prototype.items.password = {
	
	render: function(item, data) {
		
		item._type = "pw";
		item._enabled = true;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "PASSWORD", true, true, "dhxform_textarea");
		this.doAttachEvents(item);
		
		this.setValue(item, data.value);
		
		return this;
		
	}
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doAttachEvents:1,destruct:1,doUnloadNestedLists:1,setText:1,getText:1,setValue:1,getValue:1,updateValue:1,enable:1,disable:1,isEnabled:1,setWidth:1,setReadonly:1,isReadonly:1,setFocus:1,getInput:1})
		dhtmlXForm.prototype.items.password[a] = dhtmlXForm.prototype.items.input[a];
})();

/* file */
dhtmlXForm.prototype.items.file = {
	
	render: function(item, data) {
		
		item._type = "fl";
		item._enabled = true;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "FILE", true, false, "dhxform_textarea");
		
		item.childNodes[item._ll?1:0].childNodes[0].onchange = function() {
			item.callEvent("onChange", [item._idd, this.value]);
		}
		
		return this;
		
	},
	
	setValue: function(){},
	
	getValue: function(item) {
		return item.childNodes[item._ll?1:0].childNodes[0].value;
	}
	
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,destruct:1,doUnloadNestedLists:1,setText:1,getText:1,enable:1,disable:1,isEnabled:1,setWidth:1})
		dhtmlXForm.prototype.items.file[a] = dhtmlXForm.prototype.items.input[a];
})();

/* label */
dhtmlXForm.prototype.items.label = {
	
	_index: false,
	
	render: function(item, data) {
		
		item._type = "lb";
		item._enabled = true;
		item._checked = true;
		
		var t = document.createElement("DIV");
		t.className = "dhxform_txt_label2"+(data._isTopmost?" topmost":"");
		t.innerHTML = data.label;
		item.appendChild(t);
		
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		if (!isNaN(data.labelWidth)) t.style.width = parseInt(data.labelWidth)+"px";
		if (!isNaN(data.labelHeight)) t.style.height = parseInt(data.labelHeight)+"px";
		
		if (!isNaN(data.labelLeft)) t.style.left = parseInt(data.labelLeft)+"px";
		if (!isNaN(data.labelTop)) t.style.top = parseInt(data.labelTop)+"px";
		
		return this;
	},
	
	destruct: function(item) {
		
		this.doUnloadNestedLists(item);
		
		item._autoCheck = null;
		item._enabled = null;
		item._type = null;
		
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		
		item.onselectstart = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
	},
	
	setText: function(item, text) {
		item.firstChild.innerHTML = text;
	},

	getText: function(item) {
		return item.firstChild.innerHTML;
	}
	
};

(function(){
	for (var a in {doUnloadNestedLists:1,isEnabled:1})
		dhtmlXForm.prototype.items.label[a] = dhtmlXForm.prototype.items.checkbox[a];
})();


/* button */
dhtmlXForm.prototype.items.button = {
	
	render: function(item, data) {
		
		item._type = "bt";
		item._enabled = true;
		item._name = data.name;
		
		item.className = String(item.className).replace("item_label_top","item_label_left").replace("item_label_right","item_label_left");
		
		if (!isNaN(data.width)) var w = Math.max(data.width,10);
		var k = (typeof(w) != "undefined");
		
		item.innerHTML = '<div class="dhxform_btn" role="link" tabindex="0" dir="ltr" '+(k?' style="width:'+w+'px;"':'')+
					'onkeypress="e=event||window.arguments[0];if((e.keyCode==32||e.charCode==32||e.keyCode==13||e.charCode==13)&&!this.parentNode._busy){this.parentNode._busy=true;e.cancelBubble=true;e.returnValue=false;_dhxForm_doClick(this.childNodes[0],[\'mousedown\',\'mouseup\']);return false;}" '+
					'ontouchstart="e=event;e.preventDefault();if(!this.parentNode._busy){this.parentNode._busy=true;_dhxForm_doClick(this.childNodes[0],[\'mousedown\',\'mouseup\']);}" '+
					'onblur="_dhxForm_doClick(this.childNodes[0],\'mouseout\');" >'+
					'<table cellspacing="0" cellpadding="0" border="0" align="left" style="font-size:inherit; '+(k?'width:'+w+'px;table-layout:fixed;':'')+'">'+
						'<tr>'+
							'<td class="btn_l"><div class="btn_l">&nbsp;</div></td>'+
							'<td class="btn_m" '+(k?'style="width:'+(w-10)+'px;"':'')+'>'+
								'<div class="btn_txt'+(k?" btn_txt_fixed_size":"")+'">'+data.value+'</div></td>'+
							'<td class="btn_r"><div class="btn_r">&nbsp;</div></td>'+
						'</tr>'+
					'</table>'+
				"</div>";
		
		if (!isNaN(data.inputLeft)) item.childNodes[0].style.left = parseInt(data.inputLeft)+"px";
		if (!isNaN(data.inputTop)) item.childNodes[0].style.top = parseInt(data.inputTop)+"px";
		
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		if (typeof(data.tooltip) != "undefined") item.firstChild.title = data.tooltip;
		
		// item onselect start also needed once
		// will reconstructed!
		
		item.onselectstart = function(e){e=e||event;e.cancelBubble=true;e.returnValue=false;return false;}
		item.childNodes[0].onselectstart = function(e){e=e||event;e.cancelBubble=true;e.returnValue=false;return false;}
		
		item.childNodes[0].childNodes[0].onmouseover = function(){
			var t = this.parentNode.parentNode;
			if (!t._enabled) return;
			this._isOver = true;
			this.className = "dhxform_btn_over";
			t = null;
		}
		item.childNodes[0].childNodes[0].onmouseout = function(){
			var t = this.parentNode.parentNode;
			if (!t._enabled) return;
			this.className = "";
			this._allowClick = false;
			this._pressed = false;
			this._isOver = false;
			t = null;
		}
		item.childNodes[0].childNodes[0].onmousedown = function(){
			if (this._pressed) return;
			var t = this.parentNode.parentNode;
			if (!t._enabled) return;
			this.className = "dhxform_btn_pressed";
			this._allowClick = true;
			this._pressed = true;
			t = null;
		}
		
		item.childNodes[0].childNodes[0].onmouseup = function(){
			if (!this._pressed) return;
			var t = this.parentNode.parentNode;
			if (!t._enabled) return;
			t._busy = false;
			this.className = (this._isOver?"dhxform_btn_over":"");
			if (this._pressed && this._allowClick) t.callEvent("_onButtonClick", [t._name, t._cmd]);
			this._allowClick = false;
			this._pressed = false;
			t = null;
		}
		
		return this;
	},
	
	destruct: function(item) {
		
		this.doUnloadNestedLists(item);
		
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		
		item._autoCheck = null;
		item._type = null;
		item._enabled = null;
		item._cmd = null;
		item._name = null;
		
		item.onselectstart = null;
		
		item.childNodes[0].onselectstart = null;
		item.childNodes[0].onkeypress = null;
		item.childNodes[0].ontouchstart = null;
		item.childNodes[0].onblur = null;
		
		item.childNodes[0].childNodes[0].onmouseover = null;
		item.childNodes[0].childNodes[0].onmouseout = null;
		item.childNodes[0].childNodes[0].onmousedown = null;
		item.childNodes[0].childNodes[0].onmouseup = null;
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
		item.childNodes[0].tabIndex = 0;
		item.childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
		item.childNodes[0].tabIndex = -1;
		item.childNodes[0].setAttribute("disabled", "true");
	},
	
	setText: function(item, text) {
		item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML = text;
	},

	getText: function(item) {
		return item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML;
	}
	
};

(function(){
	for (var a in {doUnloadNestedLists:1,isEnabled:1})
		dhtmlXForm.prototype.items.button[a] = dhtmlXForm.prototype.items.checkbox[a];
})();

/* hidden item */
dhtmlXForm.prototype.items.hidden = {
	
	_index: false,
	
	render: function(item, data) {
		
		item.style.display = "none";
		
		item._name = data.name;
		item._type = "hd";
		item._enabled = true;
		
		var t = document.createElement("INPUT");
		t.type = "HIDDEN";
		t.name = data.name;
		t.value = (data.value||"")
		item.appendChild(t);
		
		return this;
	},
	
	destruct: function(item) {
		
		
		this.doUnloadNestedLists(item);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		item._autoCheck = null;
		item._name = null;
		item._type = null;
		item._enabled = null;
		item.onselectstart = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		item._enabled = true;
		item.childNodes[0].setAttribute("name", item._name);
	},
	
	disable: function(item) {
		item._enabled = false;
		item.childNodes[0].removeAttribute("name");
	},
	
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	isHidden: function() {
		return true;
	},
	
	setValue: function(item, val) {
		item.childNodes[0].value = val;
		//window.dhtmlXFormLs[item.getForm()._rId].vals[item._idd] = item.childNodes[0].value;
	},
	
	getValue: function(item) {
		return item.childNodes[0].value;
	},
	
	getInput: function(item) {
		return item.childNodes[0];
	}
	
};

(function(){
	for (var a in {doUnloadNestedLists:1,isEnabled:1})
		dhtmlXForm.prototype.items.hidden[a] = dhtmlXForm.prototype.items.checkbox[a];
})();

/* sub list */
dhtmlXForm.prototype.items.list = {
	
	_index: false,
	
	render: function(item) {
		
		item._type = "list";
		item._enabled = true;
		item._isNestedForm = true;
		
		item.className = "dhxform_base_nested";
		
		return [this, new dhtmlXForm(item)];
	},
	
	destruct: function(item) {
		
		// linked to _listBase
		// automaticaly cleared when parent item unloaded
		
	}
};

/* fieldset */
dhtmlXForm.prototype.items.fieldset = {
	
	_index: false,
	
	render: function(item, data) {
		
		item._type = "fs";
		
		if (typeof(parseInt(data.inputWidth)) == "number") {
			if (_isFF||_isOpera) data.inputWidth -= 12;
			// chrome-11/ie9 - ok
		}
		
		item._width = data.width;
		
		item._enabled = true;
		item._checked = true; // required for authoCheck
		
		item.className = "fs_"+data.position+(typeof(data.className)=="string"?" "+data.className:"");
		
		var f = document.createElement("FIELDSET");
		f.className = "dhxform_fs";
		var align = String(data.labelAlign).replace("align_","");
		f.innerHTML = "<legend class='fs_legend' align='"+align+"' style='text-align:"+align+"'>"+data.label+"</legend>";
		item.appendChild(f);
		
		if (!isNaN(data.inputLeft)) f.style.left = parseInt(data.inputLeft)+"px";
		if (!isNaN(data.inputTop)) f.style.top = parseInt(data.inputTop)+"px";
		if (data.inputWidth != "auto") if (!isNaN(data.inputWidth)) f.style.width = parseInt(data.inputWidth)+"px";
		
		item._addSubListNode = function() {
			var t = document.createElement("DIV");
			this.childNodes[0].appendChild(t);
			return t;
		}
		
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		return this;
	},
	
	destruct: function(item) {
		
		this.doUnloadNestedLists(item);
		
		item._checked = null;
		item._enabled = null;
		item._idd = null;
		item._type = null;
		item._width = null;
		
		item.onselectstart = null;
		
		item._addSubListNode = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.getForm = null;
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		item.parentNode.removeChild(item);
		item = null;
	
	},
	
	setText: function(item, text) {
		item.childNodes[0].childNodes[0].innerHTML = text;
	},
	
	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	},
	
	enable: function(item) {
		item._enabled = true;
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
	},
	
	disable: function(item) {
		item._enabled = false;
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
	},
	
	setWidth: function(item, width) {
		item.childNodes[0].style.width = width+"px";
		item._width = width;
	},
	
	getWidth: function(item) {
		return item._width;
	}
	
};

(function(){
	for (var a in {doUnloadNestedLists:1,isEnabled:1})
		dhtmlXForm.prototype.items.fieldset[a] = dhtmlXForm.prototype.items.checkbox[a];
})();


/* block */
dhtmlXForm.prototype.items.block = {
	
	_index: false,
	
	render: function(item, data) {
		
		item._type = "bl";
		
		item._width = data.width;
		
		item._enabled = true;
		item._checked = true; // required for authoCheck
		
		item.className = "block_"+data.position+(typeof(data.className)=="string"?" "+data.className:"");
		
		var b = document.createElement("DIV");
		b.className = "dhxform_block";
		if (data.style) b.style.cssText = data.style;
		
		if (typeof(data.id) != "undefined") b.id = data.id;
		
		item.appendChild(b);
		
		if (!isNaN(data.inputLeft)) b.style.left = parseInt(data.inputLeft)+"px";
		if (!isNaN(data.inputTop)) b.style.top = parseInt(data.inputTop)+"px";
		if (data.inputWidth != "auto") if (!isNaN(data.inputWidth)) b.style.width = parseInt(data.inputWidth)+"px";
		
		item._addSubListNode = function() {
			var t = document.createElement("DIV");
			t._inBlcok = true;
			this.childNodes[0].appendChild(t);
			return t;
		}
		
		if (data.hidden == true) this.hide(item);
		if (data.disabled == true) this.userDisable(item);
		
		return this;
	},
	
	_setCss: function(item, skin, fontSize) {
		item.firstChild.className = "dhxform_obj_"+skin+" dhxform_block";
		item.firstChild.style.fontSize = fontSize;
	}
};

(function(){
	for (var a in {enable:1,disable:1,isEnabled:1,setWidth:1,getWidth:1,doUnloadNestedLists:1,destruct:1})
		dhtmlXForm.prototype.items.block[a] = dhtmlXForm.prototype.items.fieldset[a];
})();

/* new column */
dhtmlXForm.prototype.items.newcolumn = {
	_index: false
};

/* template */
dhtmlXForm.prototype.items.template = {
	
	render: function(item, data) {
		
		var ta = (!isNaN(data.rows));
		
		item._type = "tp";
		item._enabled = true;
		
		if (data.format) {
			if (typeof(data.format) == "function") item.format = data.format;
			if (typeof(window[data.format]) == "function") item.format = window[data.format];
		}
		if (!item.format) item.format = function(name, value) { return value; }
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "DIV", null, true, true, "dhxform_item_template");
		
		item._value = (data.value||"");
		item.childNodes[1].childNodes[0].innerHTML = item.format(item._idd, item._value);
		
		return this;
		
	},
	
	// destruct should be added,
	// item.format also should be cleared
	
	setValue: function(item, value) {
		item._value = value;
		item.childNodes[1].childNodes[0].innerHTML = item.format(item._idd, item._value);
	},
	
	getValue: function(item) {
		return item._value;
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
	}
	
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,destruct:1,doUnloadNestedLists:1,setText:1,getText:1,/*enable:1,disable:1,*/isEnabled:1,setWidth:1})
		dhtmlXForm.prototype.items.template[a] = dhtmlXForm.prototype.items.select[a];
})();

//loading from UL list

dhtmlXForm.prototype._ulToObject = function(ulData, a) {
	var obj = [];
	for (var q=0; q<ulData.childNodes.length; q++) {
		if (String(ulData.childNodes[q].tagName||"").toLowerCase() == "li") {
			var p = {};
			var t = ulData.childNodes[q];
			for (var w=0; w<a.length; w++) if (t.getAttribute(a[w]) != null) p[String(a[w]).replace("ftype","type")] = t.getAttribute(a[w]);
			if (!p.label) try { p.label = t.firstChild.nodeValue; } catch(e){}
			var n = t.getElementsByTagName("UL");
			if (n[0] != null) p[(p.type=="select"?"options":"list")] = dhtmlXForm.prototype._ulToObject(n[0], a);
			// userdata
			for (var w=0; w<t.childNodes.length; w++) {
				if (String(t.childNodes[w].tagName||"").toLowerCase() == "userdata") {
					if (!p.userdata) p.userdata = {};
					p.userdata[t.childNodes[w].getAttribute("name")] = t.childNodes[w].firstChild.nodeValue;
				}
			}
			obj[obj.length] = p;
		}
		if (String(ulData.childNodes[q].tagName||"").toLowerCase() == "div") {
			var p = {};
			p.type = "label";
			try { p.label = ulData.childNodes[q].firstChild.nodeValue; } catch(e){}
			obj[obj.length] = p;
		}
	}
	return obj;
};

dhtmlxEvent(window, "load", function(){
	var a = [
		"ftype", "name", "value", "label", "check", "checked", "disabled", "text", "rows", "select", "selected", "width", "style", "className",
		"labelWidth", "labelHeight", "labelLeft", "labelTop", "inputWidth", "inputHeight", "inputLeft", "inputTop", "position", "size"
	];
	var k = document.getElementsByTagName("UL");
	var u = [];
	for (var q=0; q<k.length; q++) {
		if (k[q].className == "dhtmlxForm") {
			var formNode = document.createElement("DIV");
			u[u.length] = {nodeUL:k[q], nodeForm:formNode, data:dhtmlXForm.prototype._ulToObject(k[q], a), name:(k[q].getAttribute("name")||null)};
		}
	}
	for (var q=0; q<u.length; q++) {
		u[q].nodeUL.parentNode.insertBefore(u[q].nodeForm, u[q].nodeUL);
		var listObj = new dhtmlXForm(u[q].nodeForm, u[q].data);
		if (u[q].name !== null) window[u[q].name] = listObj;
		var t = (u[q].nodeUL.getAttribute("oninit")||null);
		u[q].nodeUL.parentNode.removeChild(u[q].nodeUL);
		u[q].nodeUL = null;
		u[q].nodeForm = null;
		u[q].data = null;
		u[q] = null;
		// oninit call
		if (t) { if (typeof(t) == "function") t(); else if (typeof(window[t]) == "function") window[t](); }
	}
});

// extended container functionality
if (window.dhtmlXContainer) {
	// attach form functionality
	if (!dhtmlx.attaches) dhtmlx.attaches = {};
	if (!dhtmlx.attaches["attachForm"]) {
		dhtmlx.attaches["attachForm"] = function(data) {
			var obj = document.createElement("DIV");
			obj.id = "dhxFormObj_"+this._genStr(12);
			obj.style.position = "relative";
			obj.style.width = "100%";
			obj.style.height = "100%";
			obj.style.overflow = "auto";
			obj.cmp = "form";
			this.attachObject(obj, false, true, false);
			//
			this.vs[this.av].form = new dhtmlXForm(obj, data);
			this.vs[this.av].form.setSkin(this.skin);
			this.vs[this.av].form.setSizes();
			this.vs[this.av].formObj = obj;
			
			if (this.skin == "dhx_terrace") {
				this.adjust();
				this.updateNestedObjects();
			}
			
			return this.vs[this.av].form;
		}
	}
	// detach form functionality
	if (!dhtmlx.detaches) dhtmlx.detaches = {};
	if (!dhtmlx.detaches["detachForm"]) {
		dhtmlx.detaches["detachForm"] = function(contObj) {
			if (!contObj.form) return;
			contObj.form.unload();
			contObj.form = null;
			contObj.formObj = null;
			contObj.attachForm = null;
		}
	}
};

dhtmlXForm.prototype.setUserData = function(id, name, value, rValue) {
	if (typeof(rValue) != "undefined") { // radiobutton: name,value,ud_name,ud_value
		var k = this.doWithItem([id,name], "_getId");
		if (k != null) { id = k; name = value; value = rValue; }
	}
	if (!this._userdata) this._userdata = {};
	this._userdata[id] = (this._userdata[id]||{});
	this._userdata[id][name] = value;
};

dhtmlXForm.prototype.getUserData = function(id, name, rValue) {
	if (typeof(rValue) != "undefined") { // radiobutton: name,value,ud_name
		var k = this.doWithItem([id,name], "_getId");
		if (k != null) { id = k; name = rValue; }
	}
	if (this._userdata != null && typeof(this._userdata[id]) != "undefined" && typeof(this._userdata[id][name]) != "undefined") return this._userdata[id][name];
	return "";
};

dhtmlXForm.prototype.setRTL = function(state) {
	this._rtl = (state===true?true:false);
	for (var q=0; q<this.base.length; q++) {
		if (this._rtl) {
			if (String(this.base[q].className).search(/dhxform_rtl/gi) < 0) this.base[q].className += " dhxform_rtl";
		} else {
			if (String(this.base[q].className).search(/dhxform_rtl/gi) >= 0) this.base[q].className = String(this.base[q].className).replace(/dhxform_rtl/gi,"");
		}
	}
};

_dhxForm_doClick = function(obj, evType) {
	if (typeof(evType) == "object") {
		var t = evType[1];
		evType = evType[0];
	}
	if (document.createEvent) {
		var e = document.createEvent("MouseEvents");
		e.initEvent(evType, true, false);
		obj.dispatchEvent(e);
	} else if (document.createEventObject) {
		var e = document.createEventObject();
		e.button = 1;
		obj.fireEvent("on"+evType, e);
	}
	if (t) window.setTimeout(function(){_dhxForm_doClick(obj,t);},100);
}

dhtmlXForm.prototype.setFormData = function(t) {
	for (var a in t) {
		var r = this.getItemType(a);
		switch (r) {
			case "checkbox":
				this[t[a]==true||parseInt(t[a])==1||t[a]=="true"?"checkItem":"uncheckItem"](a);
				break;
			case "radio":
				this.checkItem(a,t[a]);
				break;
			case "input":
			case "textarea":
			case "select":
			case "multiselect":
			case "hidden":
			case "template":
			case "combo":
			case "calendar":
			case "colorpicker":
			case "editor":
				this.setItemValue(a,t[a]);
				break;
			default:
				if (this["setFormData_"+r]) {
					// check for custom cell
					this["setFormData_"+r](a,t[a]);
				} else {
					// if item with specified name not found, keep value in userdata
					if (!this.hId) this.hId = this._genStr(12);
					this.setUserData(this.hId, a, t[a]);
				}
				break;
		}
	}
};

dhtmlXForm.prototype.getFormData = function(p0, only_fields) {
	this._updateValues();
	var r = {};
	var that = this;
	for (var a in this.itemPull) {
		var i = this.itemPull[a]._idd;
		var t = this.itemPull[a]._type;
		if (t == "ch") r[i] = (this.isItemChecked(i)?this.getItemValue(i):0);
		if (t == "ra" && !r[this.itemPull[a]._group]) r[this.itemPull[a]._group] = this.getCheckedValue(this.itemPull[a]._group);
		if (t in {se:1,ta:1,pw:1,hd:1,tp:1,fl:1,calendar:1,combo:1,editor:1,colorpicker:1}) r[i] = this.getItemValue(i,p0);
		// check for custom cell
		if (this["getFormData_"+t]) r[i] = this["getFormData_"+t](i);
		// merge with files/uploader
		if (t == "up") {
			var r0 = this.getItemValue(i);
			for (var a0 in r0) r[a0] = r0[a0];
		}
		//
		if (this.itemPull[a]._list) {
			for (var q=0; q<this.itemPull[a]._list.length; q++) {
				var k = this.itemPull[a]._list[q].getFormData(p0,only_fields);
				for (var b in k) r[b] = k[b];
			}
		}
	}
	// collecr hId userdata
	if (!only_fields && this.hId && this._userdata[this.hId]) {
		for (var a in this._userdata[this.hId]) {
			if (!r[a]) r[a] = this._userdata[this.hId][a];
		}
	}
	return r;
};

dhtmlXForm.prototype.adjustParentSize = function(pId) {
	
	var kx = 0;
	var ky = -1;
	for (var q=0; q<this.base.length; q++) {
		kx += this.base[q].offsetWidth;
		if (this.base[q].offsetHeight > ky) ky = this.base[q].offsetHeight;
	}
	
	// check if layout
	var isLayout = false;
	try {
		isLayout = (this.cont.parentNode.parentNode.parentNode.parentNode._isCell==true);
		if (isLayout) var layoutCell = this.cont.parentNode.parentNode.parentNode.parentNode;
	} catch(e){};
	
	if (isLayout && typeof(layoutCell) != "undefined") {
		
		if (kx > 0) layoutCell.setWidth(kx+10);
		if (ky > 0) layoutCell.setHeight(ky+layoutCell.firstChild.firstChild.offsetHeight+5);
		
		isLayout = layoutCell = null;
		return;
	}
	
	// check if window
	var isWindow = false;
	try {
		isWindow = (this.cont.parentNode.parentNode.parentNode.parentNode._isWindow==true);
		if (isWindow) var winCell = this.cont.parentNode.parentNode.parentNode.parentNode;
	} catch(e){};
	
	if (isWindow && typeof(winCell) != "undefined") {
		
		this.cont.style.display = "none";
		if (kx > 0 || ky > 0) winCell._adjustToContent(kx+10,ky+10);
		this.cont.style.display = "";
		isWindow = winCell = null;
		return;
	}
};


_dhxForm_isIPad = (navigator.userAgent.search(/iPad/gi)>=0);

dhtmlXForm.prototype.load = function(url, type, callback) {
	var form = this;
	form.callEvent("onXLS",[]);
	
	if (typeof type == 'function'){
		callback = type;
		type = 'xml';
	}
	
	dhtmlxAjax.get(url, function(loader){
		var data ={};
		if (type == "json"){
			eval("data="+loader.xmlDoc.responseText);
		} else {
			var top = loader.doXPath("//data")[0];
			if (top && top.getAttribute("dhx_security"))
				dhtmlx.security_key = top.getAttribute("dhx_security");
			var tags = loader.doXPath("//data/*");
			for (var i=0; i < tags.length; i++) {
				data[tags[i].tagName] = tags[i].firstChild?tags[i].firstChild.nodeValue:"";
			};
		}		
		
		var id = url.match(/(\?|\&)id\=([a-z0-9_]*)/i);
		if (id && id[0])
			id = id[0].split("=")[1];	
			
		if (form.callEvent("onBeforeDataLoad", [id, data])){
			form.formId = id;
			form._last_load_data = data;
			form.setFormData(data);
			form.resetDataProcessor("updated");
		}
		
		//after load callback
		form.callEvent("onXLE",[]);	
		if (callback) callback.call(this);
	});
	
};

dhtmlXForm.prototype.reset = function() {
		if (this.callEvent("onBeforeReset",[this.formId,this.getFormData()])){
			if (this._last_load_data)
				this.setFormData(this._last_load_data);
			this.callEvent("onAfterReset", [this.formId]);
		}
};
	

dhtmlXForm.prototype.send = function(url, mode, callback, skipValidation) {
	if (typeof mode == 'function'){
		callback = mode;
		mode = 'post';
	}
	if (skipValidation !== true && !this.validate()) return;
	var formdata = this.getFormData(true);
	var data = [];
	for (var key in formdata) data.push(key+"="+encodeURIComponent(formdata[key]));
	
	var afterload = function(loader){
		if (callback) callback.call(this, loader, loader.xmlDoc.responseText);
	};
	
	if (mode == 'get')	
		dhtmlxAjax.get(url+(url.indexOf("?")==-1?"?":"&")+data.join("&"), afterload);
	else
		dhtmlxAjax.post(url, data.join("&"), afterload);
	
};

dhtmlXForm.prototype.save = function(url, type){};

dhtmlXForm.prototype.dummy = function() {
	
};

dhtmlXForm.prototype._changeFormId = function(oldid, newid) {
	this.formId = newid;
};

dhtmlXForm.prototype._dp_init = function(dp) {
	dp._methods=["dummy","dummy","_changeFormId","dummy"];
	
	dp._getRowData=function(id,pref){
		var data = this.obj.getFormData(true);
		data[this.action_param] = this.obj.getUserData(id, this.action_param);
		return data;
	};
	dp._clearUpdateFlag=function(){};
	
	dp.attachEvent("onAfterUpdate",function(sid, action, tid, tag){
		if (action == "inserted" || action == "updated"){
			this.obj.resetDataProcessor("updated");
			this.obj._last_load_data = this.obj.getFormData(true);
		}
		this.obj.callEvent("onAfterSave",[this.obj.formId, tag]);
		return true;
	});
	dp.autoUpdate = false;
	dp.setTransactionMode("POST", true);
	this.dp = dp;
	this.formId = (new Date()).valueOf();
	this.resetDataProcessor("inserted");
	
	this.save = function(){
		if (!this.callEvent("onBeforeSave",[this.formId, this.getFormData()])) return;
		if (!this.validate()) return;
		dp.sendData();
	};
};


dhtmlXForm.prototype.resetDataProcessor=function(mode){
	if (!this.dp) return;
	this.dp.updatedRows = []; this.dp._in_progress = [];
	this.dp.setUpdated(this.formId,true,mode);
};

/* validation */
//all purpose set of rules, based on http://code.google.com/p/validation-js
if (!window.dhtmlxValidation){
	dhtmlxValidation = function(){};
	dhtmlxValidation.prototype = {
		isEmpty: function(value) {
			return value == '';
		},
		isNotEmpty: function(value) {
			return !value == '';
		},
		isValidBoolean: function(value) {
			return !!value.match(/^(0|1|true|false)$/);
		},
		isValidEmail: function(value) {
			return !!value.match(/(^[a-z]([a-z0-9_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\-\.]*)(\.[a-z]{2,3})$)/i); 
		},
		isValidInteger: function(value) {
			return !!value.match(/(^-?\d+$)/);
		},
		isValidNumeric: function(value) {
			return !!value.match(/(^-?\d\d*[\.|,]\d*$)|(^-?\d\d*$)|(^-?[\.|,]\d\d*$)/);
		},
		isValidAplhaNumeric: function(value) {
			return !!value.match(/^[_\-a-z0-9]+$/gi);
		},
		// 0000-00-00 00:00:00 to 9999:12:31 59:59:59 (no it is not a "valid DATE" function)
		isValidDatetime: function(value) {
			var dt = value.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);
			return dt && !!(dt[1]<=9999 && dt[2]<=12 && dt[3]<=31 && dt[4]<=59 && dt[5]<=59 && dt[6]<=59) || false;
		},
		// 0000-00-00 to 9999-12-31
		isValidDate: function(value) {
			var d = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
			return d && !!(d[1]<=9999 && d[2]<=12 && d[3]<=31) || false;
		},
		// 00:00:00 to 59:59:59
		isValidTime: function(value) {
			var t = value.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
			return t && !!(t[1]<=24 && t[2]<=59 && t[3]<=59) || false;
		},
		// 0.0.0.0 to 255.255.255.255
		isValidIPv4: function(value) { 
			var ip = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
			return ip && !!(ip[1]<=255 && ip[2]<=255 && ip[3]<=255 && ip[4]<=255) || false;
		},
		isValidCurrency: function(value) { // Q: Should I consider those signs valid too ? : ¢|€|₤|₦|¥
			return value.match(/^\$?\s?\d+?[\.,\,]?\d+?\s?\$?$/) && true || false;
		},
		// Social Security Number (999-99-9999 or 999999999)
		isValidSSN: function(value) {
			return value.match(/^\d{3}\-?\d{2}\-?\d{4}$/) && true || false;
		},
		// Social Insurance Number (999999999)
		isValidSIN: function(value) {
			return value.match(/^\d{9}$/) && true || false;
		}
	};
	dhtmlxValidation = new dhtmlxValidation();
};

