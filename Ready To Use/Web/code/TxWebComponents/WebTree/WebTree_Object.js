function WebTreeObject(ATreeName,AToolbarName,ALoadRootNodes,AID_Object_Checked){
	//private variables
	var dhxTree;
	var sTreeName;
	var dhxToolbar;
	var sToolbarName;	
	var initializeWebTree = function(){
	    sTreeName = ATreeName;
		dhxTree = eval(sTreeName);
		sToolbarName = AToolbarName;
		dhxToolbar = eval(sToolbarName);

		InitializeDhxTree();
		InitializeDhxToolbar();
	};
	
	//Declaration of public methods
	this.getTreeName = function(){
		return sTreeName;
	};	
	this.getTree = function(){
		return dhxTree;
	};	
	this.getToolbar = function(){
		return dhxToolbar;
	}
	this.getToolbarName = function(){
		return sToolbarName;
	}

	this.getAllTxId = function () {
	    arrIds = dhxTree.getAllLeafs().split(',');
	    arrTxIds = [];
	    for (var i = 0 ; i < arrIds.length ; i++) {
	        arrTxIds.push(GetIdObject(arrIds[i]));
	    }
	    return JSON.stringify(arrTxIds);
	}
	
	this.getObjectSelectedName = function () {
	    return dhxTree.getItemText(dhxTree.getSelectedItemId());
	}

	this.getObjectCheckedName = function () {
		var arrIdItemChecked = dhxTree.getAllChecked().split(',');
		var sNameItemChecked = '';
		for (var i = arrIdItemChecked.length - 1; i >= 0; i--) {
			if (sNameItemChecked != '') {
				sNameItemChecked = sNameItemChecked+'; '+dhxTree.getItemText(arrIdItemChecked[i]);
			} else {
				sNameItemChecked = dhxTree.getItemText(arrIdItemChecked[i]);	
			}
			
		};
	    return (sNameItemChecked == 0) ? '' : sNameItemChecked;
	}
	
	this.getObjectChecked = function () {
	    var sObjectChecked = "";
	    J.ajax({
	        url: sFileNameWebTreeAjax,
	        async: false,
	        cache: false,
	        data: {
	            sFunctionName: 'Get_WebTree_IdObjectsChecked',
	            sTreeName: sTreeName
	        },
	        success: function (aResult) {
	            var results = aResult.split("|");
	            if (results[0] == sOk)
	                sObjectChecked = (results[1] == null) ? "" : results[1];
	            else
	                parent.Popup_Error(results[0]);
	        }
	    });
	    return sObjectChecked;
	}

	this.loadJSON = function (AJSON) {
	    DoLoadJSON(AJSON);
	}

	this.handleEventOnCheck = function (AFunctionName) {
	    dhxTree.attachEvent("onCheck", AFunctionName);
	}

	this.handleEventOnXLE = function (AFunctionName) {
	    dhxTree.attachEvent("onXLE", AFunctionName);
	}
	
	this.setIDsObjectChecked = function(AIDs_Object_Checked){
		J.ajax({
			url:sFileNameWebTreeAjax,
			async:false,
			cache:false,
			dataType:'script',
			type:'post',
			data:{ 
				sFunctionName: "Set_IDs_Object_Checked",
				ids_object_checked: AIDs_Object_Checked,
				sTreeName:sTreeName
			}
		});	
	}

	this.setIDsObjectDisabled = function(AIDs_Object_Disabled){
		J.ajax({
			url:sFileNameWebTreeAjax,
			async:false,
			cache:false,
			dataType:'script',
			type:'post',
			data:{ 
				sFunctionName: "Set_IDs_Object_Disabled",
				ids_object_disabled:AIDs_Object_Disabled,
				sTreeName:sTreeName
			}
		});	
	}
	
	this.getIdObjectFromIndex = function (AIndex) {
	    return GetIdObject(AIndex);
	}

	this.getIdsObjectFromIndexes = function (AIndexes) {
	    var ArrObjectId = [];

	    if (dhxTree.getAllChecked() == "")
	        return;

	    ArrIdChecked = AIndexes.split(",");
	    for (var i = 0 ; i < ArrIdChecked.length ; i++) {
	        ArrObjectId.push(GetIdObject(ArrIdChecked[i]));
	    }
	    return ArrObjectId.join(";");
	}

	this.searchValue = function (aSearchedValue) {
	    OnSearchEditEnter(aSearchedValue);
	}

	this.destructor = function(){
		dhxTree.destructor();
	}
	
	//private functions
	function OnRootNodeExpand() {
		J.ajax({
			url:sFileNameWebTreeAjax,
			async:false,
			cache:false,
			dataType:'json',
			data:{
				sFunctionName:"OnRootNodeExpand",
				sTreeName: sTreeName
			},
			success: function (aResult) {
			    if (aResult != null)
			        dhxTree.loadJSONObject(aResult);
			    //setTimeout(function () { dhxTree.loadJSONObject(aResult); });
			}
		});	
	}	
	
	function InitializeDhxTree() {
	    //by default display the button tree arbo
	    if (dhxToolbar.isVisible("treeview")) {
	        dhxToolbar.showItem("linear");
	        dhxToolbar.hideItem("treeview");
	    }

		// Loading
		if (ALoadRootNodes)
			OnRootNodeExpand(sTreeName,dhxTree);
		
		dhxTree.setXMLAutoLoadingBehaviour("function");
		//dhxTree.setXMLAutoLoading(sFileNameWebTreeAjax + "?sFunctionName=OnExpand&sTreeName=" + sTreeName);
		dhxTree.setXMLAutoLoading(TestFunction);
		
	    //Checking
		OnCheck();		
		
		//Selecting
		OnSelect();
		
	    // Switch to linear view if there is object(s) checked
		if (AID_Object_Checked != sNull && AID_Object_Checked != '' && dhxToolbar.isVisible("linear"))
			Switch_To_Linear_View();			
	}
	
	function InitializeDhxToolbar() {
		//Click on buttons
		dhxToolbar.attachEvent("onClick",function(AID_Button){
			switch (AID_Button){
				case "addItem":
					//TODO
				break;
				case "addChild":
					//TODO
				break;
				case "deleteItem":
					//TODO
				break;
				case "moveDown":
					//TODO
				break;
				case "moveUp":
					//TODO
				break;
				case "checkAll":
				    Check_All(dhxTree.getSelectedItemId());
				break;
				case "unCheckAll":
				    UnCheck_All(dhxTree.getSelectedItemId());
				break;
				case "linear":
					var sSearch_value = dhxToolbar.getValue("searchInput");
					Switch_To_Linear_View(sSearch_value);
				break;
				case "treeview":
					Switch_To_TreeView_View();
				break;
			}
			return true;
		});
		
		//Search
		dhxToolbar.attachEvent("onEnter", function (aId, aSearchedValue) {
		    OnSearchEditEnter(aSearchedValue);
		});
	}
	
	function OnCheck() {
	    dhxTree.attachEvent("onCheck", function (AID, AChecked) {
	        J.ajax({
	            url: sFileNameWebTreeAjax,
	            async: false,
	            cache: false,
	            data: {
	                sFunctionName: 'OnCheck',
	                id_object: AID,
	                sTreeName: sTreeName,
	                bChecked: AChecked
	            },
	            success: function (aResult) {
	                var results = aResult.split("|");
	                if (results[0] == sOk)
	                    eval(results[1]);
                    else
	                    parent.Popup_Error(results[0]);
	            }
	        });
	        try { Custom_OnCheck(sTreeName); } catch (e) { }
	        return true;
	    });
	}

	function OnSelect() {
	    dhxTree.attachEvent("onSelect", function (AID) {
	        J.ajax({
	            url: sFileNameWebTreeAjax,
	            async: false,
	            cache: false,
	            dataType: 'script',
	            data: {
	                sFunctionName: "OnSelect",
	                id_object: AID,
	                sTreeName: sTreeName
	            }
	        });
	        return true;
	    });
	}

	function Check_All(AID_Selected){	
		if (AID_Selected == "") 
			AID_Selected = '0';
		
		J.ajax({
			url:sFileNameWebTreeAjax,
			type:'post',
			dataType:'script',
			async:false,
			cache:false,
			data:{
				sFunctionName:"Check_All",
				sTreeName:sTreeName,
				id_selected:AID_Selected
			},
			success: function () {
		        try{HandleCheckAll(sTreeName,true);}catch(e){}
			}
		});
	}
	
	function UnCheck_All(AID_Selected){
		if (AID_Selected == "") 
			AID_Selected = '0';
		J.ajax({
			url:sFileNameWebTreeAjax,
			type:'post',
			dataType: 'script',
			async: false,
			cache:false,
			data:{
				sFunctionName:"UnCheck_All",
				sTreeName:sTreeName,
				id_selected:AID_Selected
			},
			success: function () {
			    try { HandleCheckAll(sTreeName,false); } catch (e) { }
			}
		});
	}
	
	function Switch_To_Linear_View() {
		J.ajax({
			url:sFileNameWebTreeAjax,
			dataType: 'script',
			async: false,
			cache:false,
			data:{
				sFunctionName:"Switch_To_Linear_View",
				sTreeName:sTreeName
			}
		});
	}
	
	function Switch_To_TreeView_View(){
		J.ajax({
			url:sFileNameWebTreeAjax,
			dataType: 'script',
			async: false,
			cache:false,
			data:{
				sFunctionName:"Switch_To_TreeView_View",
				sTreeName:sTreeName
			}
		});
	}

	function OnSearchEditEnter(aSearchedValue) {
	    J.ajax({
	        url: sFileNameWebTreeAjax,
	        async: false,
	        cache: false,
	        data: {
	            sFunctionName: "OnSearchEditEnter",
	            value_searched: aSearchedValue,
	            sTreeName: sTreeName
	        },
	        success: function (aResult) {
	            var results = aResult.split("|");
	            if (results[0] == "ok")
	                eval(results[1]);
	            else
	                parent.msgWarning(results[0]);
	        }
	    });
	}

	function GetIdObjectSelected() {
	    return GetIdObject(dhxTree.getSelectedItemId());
	}

    //this function returning the id_object attribute value of a given id_order tree's element.
	function GetIdObject(AID) {
	    return dhxTree.getAttribute(AID, "id_object");
	}

	if (ATreeName){
		initializeWebTree();
	}

	function TestFunction(AID) {
	    IdObject = GetIdObject(AID);
	    //dhxTree.loadJSON(sFileNameWebTreeAjax + "?sFunctionName=OnExpand&sTreeName=" + sTreeName + "&IdObject=" + IdObject);
	    J.ajax({
	        url: sFileNameWebTreeAjax,
	        dataType: 'json',
	        async: false,
	        cache: false,
	        data: {
	            sFunctionName: "OnExpand",
	            sTreeName: sTreeName,
	            id: AID,
	            IdObject: IdObject
	        },
	        success: function (aResult) {
	            dhxTree.loadJSONObject(aResult);
	        }
	    });
	}

	function DoLoadJSON(AJSON){
	    if (AJSON != null) {
	        dhxTree.deleteChildItems("0");
	        dhxTree.loadJSONObject(AJSON);
	        //GetNodesLegacy();
	    }
	}

	function GetNodesLegacy() {
	    J.ajax({
	        url: sFileNameWebTreeAjax,
	        async: false,
	        cache: false,
	        data: {
	            sFunctionName: "GetNodesLegacy",
	            sTreeName: sTreeName
	        }
	    });
        
	}

}


