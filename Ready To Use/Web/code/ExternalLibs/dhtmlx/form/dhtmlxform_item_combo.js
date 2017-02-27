dhtmlXForm.prototype.items.combo = {
	
	render: function(item, data) {
		
		item._type = "combo";
		item._enabled = true;
		item._value = null;
		item._newValue = null;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "SELECT", null, true, true, "dhxform_select");
		this.doAttachEvents(item);
		this.doLoadOpts(item, data);
		
		// allow selection to prevent broking combo logic
		item.onselectstart = function(e){e=e||event;e.returnValue=true;return true;}
		
		// item.childNodes[1].childNodes[0].opt_type = data.comboType||"";
		item.childNodes[item._ll?1:0].childNodes[0].setAttribute("opt_type", data.comboType||"");
		
		item._combo = new dhtmlXComboFromSelect(item.childNodes[item._ll?1:0].childNodes[0]);
		item._combo._currentComboValue = item._combo.getSelectedValue();
		item._combo.DOMelem_input.id = data.uid;
		
		if (data.connector) {
			var that = this;
			item._connector_working = true;
			item._combo.loadXML(data.connector, function(){
				// try to set value if it was called while options loading was in progress
				item.callEvent("onOptionsLoaded", [item._idd]);
				item._connector_working = false;
				if (item._connector_value != null) {
					that.setValue(item, item._connector_value);
					item._connector_value = null;
				}
			});
		}
		if (data.filtering) item._combo.enableFilteringMode(true);
		
		if (data.readonly == true) this.setReadonly(item, true);
		
		if (data.style) item._combo.DOMelem_input.style.cssText += data.style;
		
		if (typeof(window.addEventListener) == "function" && item.getForm().skin == "dhx_terrace") {
			
			item._combo.DOMelem_input.addEventListener("focus", function(){
				
				var k = this.parentNode.parentNode;
				k._inFocus = true;
				if (k.className.search(/combo_in_focus/) < 0) k.className += " combo_in_focus";
				k = null;
				
			}, false);
			
			item._combo.DOMelem_input.addEventListener("blur", function(){
				var k = this.parentNode.parentNode;
				if (k.className.search(/combo_in_focus/) >= 0) k.className = k.className.replace(/combo_in_focus/gi,"");
				k = null;
				
			}, false);
			
			
		}
		
		return this;
	},
	
	destruct: function(item) {
		
		// unload combo
		item.childNodes[item._ll?1:0].childNodes[0].onchange = null;
		item._combo._currentComboValue = null;
		item._combo.destructor();
		item._combo = null;
		
		// unload item
		item._apiChange = null;
		this.d2(item);
		item = null;
		
	},
	
	doAttachEvents: function(item) {
		
		var that = this;
		
		item.childNodes[item._ll?1:0].childNodes[0].onchange = function() {
			that.doOnChange(this);
			that.doValidate(this.DOMParent.parentNode.parentNode);
		}
	},
	
	doValidate: function(item) {
		if (item.getForm().hot_validate) this._validate(item);
	},
	
	doOnChange: function(combo) {
		var item = combo.DOMParent.parentNode.parentNode;
		if (item._apiChange) return;
		combo._newComboValue = combo.getSelectedValue();
		if (combo._newComboValue != combo._currentComboValue) {
			if (item.checkEvent("onBeforeChange")) {
				if (item.callEvent("onBeforeChange", [item._idd, combo._currentComboValue, combo._newComboValue]) !== true) {
					// restore last value
					// not the best solution, should be improved
					window.setTimeout(function(){combo.setComboValue(combo._currentComboValue);},1);
					return false;
				}
			}
			combo._currentComboValue = combo._newComboValue;
			item.callEvent("onChange", [item._idd, combo._currentComboValue]);
		}
		item._autoCheck(item._enabled);
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
		item._combo.disable(false);
		item._combo.DOMelem_button.src = (window.dhx_globalImgPath?dhx_globalImgPath:"")+'combo_select'+(dhtmlx.skin?"_"+dhtmlx.skin:"")+'.gif';
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
		item._combo.disable(true);
		item._combo.DOMelem_button.src = (window.dhx_globalImgPath?dhx_globalImgPath:"")+'combo_select_dis'+(dhtmlx.skin?"_"+dhtmlx.skin:"")+'.gif';
	},
	
	getCombo: function(item) {
		return item._combo;
	},
	
	setValue: function(item, val) {
		if (item._connector_working) { // attemp to set value while optins not yet loaded (connector used)
			item._connector_value = val;
			return;
		}
		item._apiChange = true;
		item._combo.setComboValue(val);
		item._combo._currentComboValue = item._combo.getActualValue();
		item._apiChange = false;
	},
	
	getValue: function(item) {
		return item._combo.getActualValue();
	},
	
	setWidth: function(item, width) {
		item.childNodes[item._ll?1:0].childNodes[0].style.width = width+"px";
	},
	
	setReadonly: function(item, state) {
		if (!item._combo) return;
		item._combo_ro = state;
		item._combo.readonly(item._combo_ro);
	},

	isReadonly: function(item, state) {
		return item._combo_ro||false;
	},
	
	_setCss: function(item, skin, fontSize) {
		// update font-size for list-options div
		item._combo.DOMlist.style.fontSize = fontSize;
	}
	
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doLoadOpts:1,doUnloadNestedLists:1,setText:1,getText:1,isEnabled:1,_checkNoteWidth:1})
		dhtmlXForm.prototype.items.combo[a] = dhtmlXForm.prototype.items.select[a];
})();

dhtmlXForm.prototype.items.combo.d2 = dhtmlXForm.prototype.items.select.destruct;

dhtmlXForm.prototype.getCombo = function(name) {
	return this.doWithItem(name, "getCombo");
};

