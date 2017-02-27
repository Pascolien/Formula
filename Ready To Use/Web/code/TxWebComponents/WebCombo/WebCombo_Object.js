function WebComboObject(AComboName,ALoadOptions,aValueToSelect){
	//private variables
	var dhxCombo;
	var sComboName;
	
	var initializeWebCombo = function(){
		sComboName = AComboName;
		dhxCombo = eval(sComboName);
		InitializedhxCombo();
	};
	
	//Declaration of public methods
	this.getComboName = function(){
		return sComboName;
	};	
	this.getCombo = function(){
		return dhxCombo;
	};	

	this.getObjectSelected = function(){
		return parseInt(dhxCombo.getSelectedValue());
	}
	this.handleEventOnChange = function (AFunctionName) {
	    dhxCombo.attachEvent("onChange", AFunctionName);
	}
	this.loadXML = function (AXML) {
	    if (AXML != null) {
	        dhxCombo.unSelectOption();
	        dhxCombo.clearAll();
	        dhxCombo.loadXMLString(AXML);
	    }
	}
	this.setWidth = function (AWidth) {
	    dhxCombo.setSize(AWidth);
	}
	this.selectFirstOption = function () {
	    dhxCombo.selectOption(0);
	}

	this.selectOption = function (AIndex) {
	    dhxCombo.selectOption(AIndex);
	}

	this.selectOptionFromValue = function (aValue) {
	    DoSelectOptionFromValue(aValue);
	}
	
	this.unSelectOption = function(){
		dhxCombo.unSelectOption();
		dhxCombo.setComboValue("");
	}
	
	//private functions
	function Initialize_Combo(){
		J.ajax({
			url:sFileNameWebComboAjax,
			async:false,
			data:{
				sFunctionName:"Initialize_Combo",
				sCombo_Name:sComboName
			},
			success: function (aResult) {
			    dhxCombo.loadXMLString(aResult);
			    DoSelectOptionFromValue(aValueToSelect);
			}
		});	
	}
	
	function InitializedhxCombo(){
		// Loading
		if (ALoadOptions)
			Initialize_Combo();
		
		//Onchange
		dhxCombo.attachEvent("onChange", function(){
			try{HandleComboOnChange(sComboName);}catch(e){}
		});	
		
		//onAfter load
		dhxCombo.attachEvent("onXLE",function(){
			try{HandleComboOnXLE(sComboName);}catch(e){}
		});
	}

	function DoSelectOptionFromValue(aValue) {
	    if (aValue > 0) {
	        iIndex = dhxCombo.getIndexByValue(aValue);
	        dhxCombo.selectOption(iIndex);
	    }
	}
	
	if (AComboName){
		initializeWebCombo();
	}	
}
