/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param
        aSettings.sIdDivTree *** MANDATORY ***
        aSettings.sIdDivToolbar *** MANDATORY ***
        aSettings.idObject *** MANDATORY ***
        aSettings.bDefaultOpening *** MANDATORY ***
 * @returns CTreeComment object.
 */

var sPathFileajaxExecuteFunction = _url("/temp_resources/models/TxCommunity/ajax_TxCommunity.asp");
var CTxCommunityDllRFilePath = "TxCommunity\\TxCommunity.dll";


var CTreeComment = function (aSettings) {
    this.idObject = undefined;
    var rThis = this;

    //include language file according to the current language
    if (GetLanguage() === "fr") {
        var jsLink = J("<script type='text/javascript' src='" + _url("/temp_resources/Models/TxCommunity/Lang/fr.js") + "'>");
    } else {
        var jsLink = J("<script type='text/javascript' src='" + _url("/temp_resources/Models/TxCommunity/Lang/en.js") + "'>");
    }
    J("head").append(jsLink);

    //Add class to the selected DIV
    var DivTree = document.getElementById(aSettings.sIdDiv);
    var ClasseAttr = document.createAttribute("class");
    ClasseAttr.value = "div_TreeComment";
    DivTree.setAttributeNode(ClasseAttr);

    //Add the TreeSettings
    aSettings.sImgPath = _url("/resources/theme/img/dhtmlx/tree/");
    aSettings.sSkin = "default";
    aSettings.sStdImages = "";
    aSettings.bEnableTextSigns = true;
    aSettings.bEnableMultiLineItems = true;
    aSettings.bEnableEdition = false;
    aSettings.onEdit = function (aState, aId, aTree, aValue) { rThis.OnEditTreeComment(aState, aId, aTree, aValue); };

    //Generate toolbar settings
    var bIdDivToolbarExist = getValue(aSettings.sIdDivToolbar) != "";
    if (bIdDivToolbarExist) {
        aSettings.toolbarSettings = {
            sIdDivToolbar: aSettings.sIdDivToolbar,
            btns: [
                { sId: "btnAddParentComment", iBtnType: tbtSimple, sHint: RS_New_Comment_Thread, sImgEnabled: "add.png" },
                { sId: "btnTxtAddParentComment", iBtnType: tbtText, sCaption: RS_New_Comment_Thread }
            ],
            onClick: function (aId) { rThis.toolbarOnClick(aId) }
        }
    }

    //Generate TreeComment content
    aSettings.jJSON = { id: 0, item: [] }
    CTree.call(this, aSettings);

    rThis.tree.attachEvent("onClick", function (aId) {
        if (rThis.tree.getOpenState(aId) == 1) { //1 = node is open; -1 node is closed 
            rThis.tree.closeItem(aId);
        } else {
            rThis.tree.openItem(aId);
        }
    });

    rThis.ReloadTreeComment(rThis.idObject);

    this.functionsToExecute = {
        "txObjs": ["ReloadTreeComment"],
        "cell": ["collapseCellComment"],
        "idOT": ["ClearTreeComment"]
    }
    setTimeout(function () { rThis._collapseParentCell(); }, 0);

};

//inheritage
CTreeComment.prototype = createObject(CTree.prototype);
CTreeComment.prototype.constructor = CTreeComment; // Otherwise instances of CTreeComment would have a constructor of CTree
CTreeComment.prototype.ClearTreeComment = function () {
    var rThis = this;
    rThis.clear();
}
CTreeComment.prototype.ReloadTreeComment = function (aIdObject) {
    var rThis = this;
    var jTreeComment = {};
    var request = {};
    var ajaxResponse = {};


    rThis.randomID = Math.floor(Math.random() * (1000 + 1)) + 0;
    if (aIdObject !== undefined) {
        if (isNumber(aIdObject) === false) {
            rThis.idObject = aIdObject[0].ID;
        }

        request.sDllFilePath = CTxCommunityDllRFilePath;
        request.sFunction = "OnInitializingTreeComment"
        request.idObject = rThis.idObject;

        ajaxResponse = txAjax(sPathFileajaxExecuteFunction, request);

        if (ajaxResponse.sStatus == "ok") {
            jTreeComment = FormatTreeComments(ajaxResponse.response.idObjectCurrentUser, ajaxResponse.response.comments);
        }
        else {
            //Error Message 
            jTreeComment = { id: 0, item: [] };
        }
    }
    else {
        jTreeComment = { id: 0, item: [] };
    }
    rThis.clear();
    rThis.doLoad(jTreeComment);

    ////Function to transform TreeComments Data into dhtmlx format
    function FormatTreeComments(aidObjectCurrentUser, aComments) {
        var JdhxTreeComment = { id: 0, item: [] };
        var Item = [];
        var iChildItem = 0;
        var ChildNode = {};
        var ChildItem = [];
        J("#" + rThis.sIdDivTree).empty();
        for (var i = 0; i < aComments.length; i++) {
            var ParentNode = {};
            ParentNode.id = aComments[i].ID;

            if (aComments[i].answers) {
                iChildItem = aComments[i].answers.length;
            }
            else {
                iChildItem = 0;
            }

            ParentNode.text = SetParentNode(aidObjectCurrentUser, aComments[i]);
            ParentNode.child = 1;
            ChildItem = [];

            if (iChildItem > 0) {
                for (var j = 0; j < iChildItem; j++) {
                    ChildNode = {};
                    ChildNode.id = aComments[i].answers[j].ID;
                    ChildNode.text = SetChildNode(aidObjectCurrentUser, aComments[i].answers[j]);
                    ChildNode.child = 0;
                    ChildNode.im0 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/leaf.png";
                    ChildItem.push(ChildNode);
                }
            }
            ChildNode = {};
            ChildNode.id = aComments[i].ID + "_0";
            ChildNode.text = SetEditChildNode(aComments[i].ID);
            ChildNode.child = 0;
            ChildNode.im0 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/leaf.png";
            ChildItem.push(ChildNode);

            ParentNode.item = ChildItem;

            ParentNode.im1 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/comment_expanded_v2.png";
            switch (iChildItem) {
                case 0:
                    ParentNode.im2 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/message0_v2.png";
                    break;
                case 1:
                    ParentNode.im2 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/message1_v2.png";
                    break;
                case 2:
                    ParentNode.im2 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/message2_v2.png";
                    break;
                case 3:
                    ParentNode.im2 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/message3_v2.png";
                    break;
                default:
                    ParentNode.im2 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/message3plus_v2.png";
            }
            ParentNode.im0 = "../../../../../temp_resources/models/TxCommunity/css/img/pictures_comments/leaf.png";

            Item.push(ParentNode);
        }
        JdhxTreeComment.item = Item;
        // console.log(JSON.stringify(JdhxTreeComment));
        return JdhxTreeComment;
    }
    ////Parent Comment node
    function SetParentNode(aidObjectCurrentUser, aComment) {
        var ClasseAttr;
        var ParentNode = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Board";
        ParentNode.setAttributeNode(ClasseAttr);

        //Comment Container
        var CommentContainer = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "CommentContainer";
        CommentContainer.setAttributeNode(ClasseAttr);
        ParentNode.appendChild(CommentContainer);

        var CommentInformation = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Information";
        CommentInformation.setAttributeNode(ClasseAttr);
        CommentContainer.appendChild(CommentInformation);

        var CommentAuthor = document.createElement("strong");
        CommentAuthor.innerHTML = aComment.sAuthor;//Author
        CommentInformation.appendChild(CommentAuthor);

        var CommentDate = document.createElement("span");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "date_comment";
        CommentDate.setAttributeNode(ClasseAttr);
        CommentDate.innerHTML = SetDateTreeComment(aComment.sFormatedDate);//Date
        CommentInformation.appendChild(CommentDate);


        var ParentComment = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Parent_Comment";
        ParentComment.setAttributeNode(ClasseAttr);
        CommentContainer.appendChild(ParentComment);
        ParentComment.innerHTML = aComment.sName; //Comment value

        //Comment Menu
        var CommentMenu = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Menu";
        CommentMenu.setAttributeNode(ClasseAttr);
        ParentNode.appendChild(CommentMenu);

        var CommentEdit = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Edit";
        CommentEdit.setAttributeNode(ClasseAttr);
        CommentMenu.appendChild(CommentEdit);

        var InputEdit = document.createElement("img");
        ClasseAttr = document.createAttribute("id");
        ClasseAttr.value = "EditComment_" + rThis.randomID + "_" + aComment.ID;
        InputEdit.setAttributeNode(ClasseAttr);

        if ((aComment.idAuthor == aidObjectCurrentUser) || (aidObjectCurrentUser == "1")) {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/modify_comment.png";
            InputEdit.setAttributeNode(ClasseAttr);
            J(document).on('click', "#" + "EditComment_" + rThis.randomID + "_" + aComment.ID, function () {
                //  console.log('edit CommentPopUp', aComment.ID);
                rThis.CommentPopUp(aComment.ID);
            });

        } else {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/Modify_Comment_disabled.png";
            InputEdit.setAttributeNode(ClasseAttr);
        }

        InputEdit.setAttributeNode(ClasseAttr);

        CommentEdit.appendChild(InputEdit);

        var CommentDelete = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Delete";
        CommentDelete.setAttributeNode(ClasseAttr);
        CommentMenu.appendChild(CommentDelete);

        var InputDelete = document.createElement("img");
        ClasseAttr = document.createAttribute("id");
        ClasseAttr.value = "DeleteComment_" + rThis.randomID + "_" + aComment.ID;
        InputDelete.setAttributeNode(ClasseAttr);
        if ((aComment.idAuthor == aidObjectCurrentUser) || (aidObjectCurrentUser == "1")) {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/delete_comment.png";
            InputDelete.setAttributeNode(ClasseAttr);
            J(document).on('click', "#" + "DeleteComment_" + rThis.randomID + "_" + aComment.ID, function () {
                rThis.DeleteCommentsPopup(aComment.ID, 0);
            });

        } else {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/Delete_Comment_disable.png";
            InputDelete.setAttributeNode(ClasseAttr);
        }
        CommentDelete.appendChild(InputDelete);

        return ParentNode.outerHTML;
    }
    ////Child Comment nodes
    function SetChildNode(aidObjectCurrentUser, aComment) {
        var ClasseAttr;
        var ParentNode = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Board";
        ParentNode.setAttributeNode(ClasseAttr);

        //Comment Container
        var CommentContainer = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "CommentContainerChild";
        CommentContainer.setAttributeNode(ClasseAttr);
        ParentNode.appendChild(CommentContainer);

        var CommentInformation = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Information";
        CommentInformation.setAttributeNode(ClasseAttr);
        CommentContainer.appendChild(CommentInformation);

        var CommentAuthor = document.createElement("strong");
        CommentAuthor.innerHTML = aComment.sAuthor;//Author
        CommentInformation.appendChild(CommentAuthor);

        var CommentDate = document.createElement("span");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "date_comment";
        CommentDate.setAttributeNode(ClasseAttr);
        CommentDate.innerHTML = SetDateTreeComment(aComment.sFormatedDate);//Date
        CommentInformation.appendChild(CommentDate);


        var ParentComment = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Parent_Comment";
        ParentComment.setAttributeNode(ClasseAttr);
        CommentContainer.appendChild(ParentComment);
        ParentComment.innerHTML = aComment.sName; //Comment value

        //Comment Menu
        var CommentMenu = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Menu";
        CommentMenu.setAttributeNode(ClasseAttr);
        ParentNode.appendChild(CommentMenu);

        var CommentEdit = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Edit";
        CommentEdit.setAttributeNode(ClasseAttr);
        CommentMenu.appendChild(CommentEdit);

        var InputEdit = document.createElement("img");
        ClasseAttr = document.createAttribute("id");
        ClasseAttr.value = "EditChildComment" + rThis.randomID + "_" + aComment.ID;
        InputEdit.setAttributeNode(ClasseAttr);
        ////
        if ((aComment.idAuthor == aidObjectCurrentUser) || (aidObjectCurrentUser == "1")) {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/modify_comment.png";
            InputEdit.setAttributeNode(ClasseAttr);
            J(document).on('click', "#" + "EditChildComment" + rThis.randomID + "_" + aComment.ID, function () {
                // console.log(aComment.ID + " _ " + aComment.IDParent);
                rThis.ReplyPopUp(aComment.ID, aComment.ID_Parent);
            });
        } else {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/Modify_Comment_disabled.png";
            InputEdit.setAttributeNode(ClasseAttr);
        }
        CommentEdit.appendChild(InputEdit);

        var CommentDelete = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "Comment_Delete";
        CommentDelete.setAttributeNode(ClasseAttr);
        CommentMenu.appendChild(CommentDelete);

        var InputDelete = document.createElement("img");
        ClasseAttr = document.createAttribute("id");
        ClasseAttr.value = "DeleteComment_" + rThis.randomID + "_" + aComment.ID;
        InputDelete.setAttributeNode(ClasseAttr);
        if ((aComment.idAuthor == aidObjectCurrentUser) || (aidObjectCurrentUser == "1")) {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/delete_comment.png";
            InputDelete.setAttributeNode(ClasseAttr);
            J(document).on('click', "#" + "DeleteComment_" + rThis.randomID + "_" + aComment.ID, function () {
                rThis.DeleteCommentsPopup(aComment.ID, 1);
            });

        } else {
            ClasseAttr = document.createAttribute("src");
            ClasseAttr.value = "/temp_resources/models/TxCommunity/css/img/pictures_comments/Delete_Comment_disable.png";
            InputDelete.setAttributeNode(ClasseAttr);
        }
        CommentDelete.appendChild(InputDelete);

        return ParentNode.outerHTML;
    }
    function SetEditChildNode(AIdParentComment) {
        var ClasseAttr;
        var CommentAnswer = document.createElement("div");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "CommentAnswerButton";
        CommentAnswer.setAttributeNode(ClasseAttr);
        ClasseAttr = document.createAttribute("id");
        ClasseAttr.value = "AddChildComment" + rThis.randomID + "_" + AIdParentComment;
        CommentAnswer.setAttributeNode(ClasseAttr);
        J(document).on('click', "#" + "AddChildComment" + rThis.randomID + "_" + AIdParentComment, function () {
            rThis.ReplyPopUp(-1, AIdParentComment);
        });
        var ReplyPicture = document.createElement("img");
        ClasseAttr = document.createAttribute("src");
        ClasseAttr.value = "/resources/theme/img/iconsToolbar/add.png";
        ReplyPicture.setAttributeNode(ClasseAttr);
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "ReplyPicture";
        ReplyPicture.setAttributeNode(ClasseAttr);
        CommentAnswer.appendChild(ReplyPicture);

        var ReplyLink = document.createElement("span");
        ClasseAttr = document.createAttribute("class");
        ClasseAttr.value = "ReplyButton";
        ReplyLink.setAttributeNode(ClasseAttr);
        ReplyLink.innerHTML = "Reply";
        CommentAnswer.appendChild(ReplyLink);

        return CommentAnswer.outerHTML;
    }
    function SetDateTreeComment(aDate) {
        switch (aDate.split("|")[0]) {
            case "FullDate":
                return aDate.split("|")[1];
                break;
            case "Days":
                return aDate.split("|")[1] + " Day(s) ago";
                break;
            case "Hours":
                return aDate.split("|")[1] + " Hour(s) ago";
                break;
            case "Minutes":
                return aDate.split("|")[1] + " Minute(s) ago";
                break;
            default:
                return "Less than a minute ago";
        }
    }

    // return jTreeComment;
}

CTreeComment.prototype.toString = function txToString() {
    return "CTreeComment Object";
}
/* Toolbar methods */
CTreeComment.prototype.toolbarOnClick = function (aIdBtn) {
    switch (aIdBtn) {
        case "btnAddParentComment":
            this.CommentPopUp(-1);
            break;
    }
}

CTreeComment.prototype.closePopUp = function () {
    var rThis = this;
    rThis.ReloadTreeComment(rThis.idObject);
    rThis.CommentWdow.wdow.close()
}

CTreeComment.prototype.CommentPopUp = function (aIdComment) {
    //  console.log('CommentPopUp');
    var rThis = this;
    var settings = {};
    settings.sName = 'AddComment';
    settings.bDenyResize = true;
    settings.bHidePark = false;
    settings.bHideClose = false;
    settings.bModal = false;

    settings.iWidth = 685;
    settings.iHeight = 535;
    settings.sIcon = 'temp_resources/models/TxCommunity/css/img/pictures_comments/comment-popup.png';
    settings.sHeader = RS_New_Comment_Thread;

    rThis.randomID = Math.floor(Math.random() * (1000 + 1)) + 0;
    // Get html template page
    new J.ajax({
        url: _url("/temp_resources/models/TxCommunity/AddComment.html"),
        dataType: 'html',
        async: false,
        cache: false,
        success: function (aData) {
            sHtml = aData;
        }
    });
    settings.sHTMLAttached = sHtml;
    rThis.CommentWdow = new CWindow(settings);

    //var TinyMceEditor;
    var sComment = '';
    var sLanguage = '';
    var sIdsPeopleChecked = "";
    var sIdsCommuntiesChecked = "";
    var sOtCommunity = "";
    var request = {};
    var ajaxResponse = {};

    if (GetLanguage() === "fr") {
        sLanguage = "fr_FR";
    } else {
        sLanguage = "en_GB";
    }


    // Check if Textarea is empty, if so, disable submit button
    if (aIdComment == "-1") {
        document.getElementById("RS_Submit_Comment").disabled = true;
    }


    request.sDllFilePath = CTxCommunityDllRFilePath;
    request.sFunction = "OnGettingCommentProperties";
    request.idComment = aIdComment;


    ajaxResponse = txAjax(sPathFileajaxExecuteFunction, request);

    if (ajaxResponse.sStatus == "ok") {

        if (ajaxResponse.response.comment.bPublic !== true) {
            J("#Private").prop("checked", true);
        }

        if (ajaxResponse.response.comment.sName) {
            sComment = ajaxResponse.response.comment.sName;
        }
        sIdsPeopleChecked = ajaxResponse.response.comment.people.join();
        sIdsCommuntiesChecked = ajaxResponse.response.comment.communities.join();
        sOtCommunity = ajaxResponse.response.idObjectTypeCommunity;
    }


    //Init TinyMCE
    for (var i = tinymce.editors.length - 1; i > -1; i--) {
        var ed_id = tinymce.editors[i].id;
        tinyMCE.execCommand("mceRemoveEditor", true, ed_id);
    }
    tinymce.init({
        selector: "textarea.Comment_text",
        height: 150,
        width: 625,
        scrollbars: true,
        browser_spellcheck: true,
        setup: function (ed) {
            rThis.CommentWdow.TinyMceEditor = ed;
            rThis.CommentWdow.TinyMceEditor.on('init', function (e) {
                //console.log('init');
                rThis.CommentWdow.TinyMceEditor.setContent(sComment);
                rThis.checkTextAreaParent();
                rThis.CommentWdow.TinyMceEditor.focus();
            });
            rThis.CommentWdow.TinyMceEditor.on('keyup', function (e) {
                //console.log('key up');
                rThis.checkTextAreaParent();
            });
            rThis.CommentWdow.TinyMceEditor.on('PastePostProcess', function (e) {
                //console.log('PastePostProcess');
                rThis.checkTextAreaParent();
            });

        },
        language: sLanguage,
        resize: false,
        plugins: [
                "advlist  autolink lists charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table  directionality  template textcolor paste textcolor colorpicker textpattern TxLink  spellchecker"
        ],
        toolbar1: " bold italic underline  | alignleft aligncenter alignright alignjustify | forecolor",
        //toolbar1: " bold italic underline  | alignleft aligncenter alignright alignjustify |  fontselect fontsizeselect | forecolor backcolor | TxLink",
        menubar: false,
        toolbar_items_size: 'small',
        statusbar: false,
        //paste_data_images: true,
        paste_retain_style_properties: "all",
        convert_urls: false
    });

    //Init Labels
    document.getElementById("RS_Fieldset_CommentPopup").innerHTML = RS_Fieldset_CommentPopup;
    document.getElementById("RS_Fieldset_Diffusion").innerHTML = RS_Fieldset_Diffusion;
    document.getElementById("RS_Privacy").innerHTML = RS_Privacy;
    document.getElementById("RS_Privacy_Public").innerHTML = RS_Privacy_Public;
    document.getElementById("RS_Privacy_Private").innerHTML = RS_Privacy_Private;
    document.getElementById("RS_Submit_Comment").value = RS_Submit_Comment;
    document.getElementById("RS_Close_Comment").value = RS_Close_Comment;
    ChangePrivacy(J('input[name="Privacy"]:checked').val());


    var ClasseAttr = document.createAttribute("class");
    ClasseAttr.value = "cl_btn_action RS_Submit_Comment" + rThis.randomID;
    document.getElementById("RS_Submit_Comment").setAttributeNode(ClasseAttr);

    ClasseAttr = document.createAttribute("class");
    ClasseAttr.value = "cl_btn_action RS_Close_Comment" + rThis.randomID;
    document.getElementById("RS_Close_Comment").setAttributeNode(ClasseAttr);

    J(document).on('click', ".RS_Submit_Comment" + rThis.randomID, function () {
        //console.log('Submit WriteComment');
        rThis.WriteComment(rThis.idObject, aIdComment, 0);

    });

    J(document).on('click', ".RS_Close_Comment" + rThis.randomID, function () {
        rThis.closePopUp();
    });

    var PeopleTreeSettings = {
    };
    PeopleTreeSettings.sIdDivTree = 'People_concerned';
    PeopleTreeSettings.iHeight = 130;
    PeopleTreeSettings.iWidth = 300;
    PeopleTreeSettings.bFolderCheckable = false;
    PeopleTreeSettings.bReadOnly = false;
    PeopleTreeSettings.sIdsChecked = sIdsPeopleChecked; //  string id separated by ";".
    PeopleTreeSettings.sCheckType = "ctCheckboxes";
    PeopleTreeSettings.idOT = 1;

    PeopleTreeSettings.toolbarSettings = {
    };// see settings in CToolbar
    PeopleTreeSettings.toolbarSettings.sIdDivToolbar = "People_concerned_Toolbar";
    PeopleTreeSettings.toolbarSettings.btns = [
            {
                sId: btnDisplaySelection, iBtnType: tbtSimple, sHint: "View the selected objects", sImgEnabled: "tree.png", sImgDisabled: "treeDisabled.png", bAddSpacer: true
            }, /*, bDisabled: true*/
            {
                sId: btnDisplayTree, iBtnType: tbtSimple, sHint: "View the entire tree", sImgEnabled: "linear.png", sImgDisabled: "linearDisabled.png", bHide: true, bAddSpacer: true
            },
            {
                sId: btnSearchLabel, iBtnType: tbtText, sCaption: "Search:"
            },
            { sId: btnSearchInput, iBtnType: tbtInput, sHint: 'Press "Enter" to start searching' }
    ];
    PeopleTreeSettings.toolbarSettings.onClick = function (aId) {
        rThis.CommentWdow.PeopleTree.toolbarOnClick(aId)
    };
    PeopleTreeSettings.toolbarSettings.onEnter = function (aId, aValue) {
        rThis.CommentWdow.PeopleTree.toolbarOnEnter(aId, aValue)
    };
    rThis.CommentWdow.PeopleTree = new CTreeObject(PeopleTreeSettings);

    var GroupTreeSettings = {
    };
    GroupTreeSettings.sIdDivTree = 'Groups_concerned';
    GroupTreeSettings.iHeight = 130;
    GroupTreeSettings.iWidth = 300;
    GroupTreeSettings.idOT = sOtCommunity;
    GroupTreeSettings.bFolderCheckable = false;
    GroupTreeSettings.bReadOnly = false;
    GroupTreeSettings.sIdsChecked = sIdsCommuntiesChecked; //  string id separated by ";"

    GroupTreeSettings.sCheckType = "ctCheckboxes";

    GroupTreeSettings.toolbarSettings = {
    }; // see settings in CToolbar
    GroupTreeSettings.toolbarSettings.sIdDivToolbar = "Groups_concerned_Toolbar";
    GroupTreeSettings.toolbarSettings.btns = [
            {
                sId: btnDisplaySelection, iBtnType: tbtSimple, sHint: "View the selected objects", sImgEnabled: "tree.png", sImgDisabled: "treeDisabled.png", bAddSpacer: true
            }, /*, bDisabled: true*/
            {
                sId: btnDisplayTree, iBtnType: tbtSimple, sHint: "View the entire tree", sImgEnabled: "linear.png", sImgDisabled: "linearDisabled.png", bHide: true, bAddSpacer: true
            },
            {
                sId: btnSearchLabel, iBtnType: tbtText, sCaption: "Search:"
            },
            { sId: btnSearchInput, iBtnType: tbtInput, sHint: 'Press "Enter" to start searching' }
    ];
    GroupTreeSettings.toolbarSettings.onClick = function (aId) {
        rThis.CommentWdow.GroupTree.toolbarOnClick(aId)
    };
    GroupTreeSettings.toolbarSettings.onEnter = function (aId, aValue) {
        rThis.CommentWdow.GroupTree.toolbarOnEnter(aId, aValue)
    };
    rThis.CommentWdow.GroupTree = new CTreeObject(GroupTreeSettings);
}

CTreeComment.prototype.ReplyPopUp = function (aIdComment, aIdCommentParent) {
    var rThis = this;
    var settings = {};
    settings.sName = 'ReplyComment';
    settings.bDenyResize = true;
    settings.bHidePark = false;
    settings.bHideClose = false;
    settings.bModal = false;

    settings.iWidth = 685;
    settings.iHeight = 295;
    settings.sIcon = 'temp_resources/models/TxCommunity/css/img/pictures_comments/comment-popup.png';
    settings.sHeader = RS_Reply_Comment;

    rThis.randomID = Math.floor(Math.random() * (1000 + 1)) + 0;
    // Get html template page
    new J.ajax({
        url: _url("/temp_resources/models/TxCommunity/AddReply.html"),
        dataType: 'html',
        async: false,
        cache: false,
        success: function (aData) {
            sHtml = aData;
        }
    });
    settings.sHTMLAttached = sHtml;
    rThis.CommentWdow = new CWindow(settings);

    var sComment = '';
    var sLanguage = '';

    var request = {};
    var ajaxResponse = {};

    if (GetLanguage() === "fr") {
        sLanguage = "fr_FR";
    } else {
        sLanguage = "en_GB";
    }


    // Check if Textarea is empty, if so, disable submit button
    if (aIdComment == "-1") {
        document.getElementById("RS_Submit_Comment").disabled = true;
    }


    request.sDllFilePath = CTxCommunityDllRFilePath;
    request.sFunction = "OnGettingCommentProperties";
    request.idComment = aIdComment;


    ajaxResponse = txAjax(sPathFileajaxExecuteFunction, request);

    if (ajaxResponse.sStatus == "ok") {
        if (ajaxResponse.response.comment.sName) {
            sComment = ajaxResponse.response.comment.sName;
        }
    }

    //Init TinyMCE
    for (var i = tinymce.editors.length - 1 ; i > -1 ; i--) {
        var ed_id = tinymce.editors[i].id;
        tinyMCE.execCommand("mceRemoveEditor", true, ed_id);
    }
    tinymce.init({
        selector: "textarea.Comment_text",
        height: 150,
        width: 625,
        scrollbars: true,
        browser_spellcheck: true,
        setup: function (ed) {
            rThis.CommentWdow.TinyMceEditor = ed;
            rThis.CommentWdow.TinyMceEditor.on('init', function (e) {
                //console.log('init');
                rThis.CommentWdow.TinyMceEditor.setContent(sComment);
                rThis.checkTextAreaParent();
                rThis.CommentWdow.TinyMceEditor.focus();
            });
            rThis.CommentWdow.TinyMceEditor.on('keyup', function (e) {
                //console.log('key up');
                rThis.checkTextAreaParent();
            });
            rThis.CommentWdow.TinyMceEditor.on('PastePostProcess', function (e) {
                //console.log('PastePostProcess');
                rThis.checkTextAreaParent();
            });

        },
        language: sLanguage,
        resize: false,
        plugins: [
                "advlist  autolink lists charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table  directionality  template textcolor paste textcolor colorpicker textpattern TxLink  spellchecker"
        ],
        toolbar1: " bold italic underline",
        menubar: false,
        toolbar_items_size: 'small',
        statusbar: false,
        paste_retain_style_properties: "all",
        convert_urls: false
    });

    //Init Labels
    document.getElementById("RS_Fieldset_CommentPopup").innerHTML = RS_Fieldset_CommentPopup;
    document.getElementById("RS_Submit_Comment").value = RS_Submit_Comment;
    document.getElementById("RS_Close_Reply").value = RS_Close_Comment;

    var ClasseAttr = document.createAttribute("class");
    ClasseAttr.value = "cl_btn_action RS_Submit_Comment" + rThis.randomID;
    document.getElementById("RS_Submit_Comment").setAttributeNode(ClasseAttr);

    ClasseAttr = document.createAttribute("class");
    ClasseAttr.value = "cl_btn_action RS_Close_Reply" + rThis.randomID;
    document.getElementById("RS_Close_Reply").setAttributeNode(ClasseAttr);

    // console.log(rThis.idObject + " " + aIdComment + " " + aIdCommentParent);

    J(document).on('click', ".RS_Submit_Comment" + rThis.randomID, function () {
        rThis.WriteComment(rThis.idObject, aIdComment, aIdCommentParent);
    });
    J(document).on('click', ".RS_Close_Reply" + rThis.randomID, function () {
        rThis.closePopUp();
    });
}

CTreeComment.prototype.DeleteCommentsPopup = function (AID_Comment, bChild) {
    var rThis = this;
    var sMessage;
    if (bChild === 0) {
        sMessage = RS_Ask_Delete_Comment;
    } else {
        sMessage = RS_Ask_Delete_Child_Comment;
    }
    dhtmlx.confirm({
        text: sMessage,
        ok: RS_Answer_Yes_Delete_Comment,
        cancel: RS_Answer_No_Delete_Comment,
        callback: function (result) {
            if (result) {
                rThis.DeleteCurrentComment(AID_Comment);
            }
        }
    });
}
/////////////////////  Write/Delete COMMENT and Child COMMENT /////////////////////
CTreeComment.prototype.WriteComment = function (AIdObject, aIdComment, aIdCommentParent) {
    var rThis = this;

    var values = {};
    var index;
    var bPublic = true;
    var people = [];
    var communities = [];
    var arrId;
    var request = {};
    var ajaxResponse = {};


    var sComment = rThis.CommentWdow.TinyMceEditor.getContent();
    if (aIdCommentParent == 0) {
        bPublic = (J('input[name="Privacy"]:checked').val() === "true");
        if (rThis.CommentWdow.PeopleTree.getCheckedIds() !== "") {
            arrId = rThis.CommentWdow.PeopleTree.getCheckedIds().split(";");
            for (index = 0; index < arrId.length; index++) {
                people.push(arrId[index]);
            }
        }
        if (rThis.CommentWdow.GroupTree.getCheckedIds() !== "") {
            arrId = rThis.CommentWdow.GroupTree.getCheckedIds().split(";");
            for (index = 0; index < arrId.length; index++) {
                communities.push(arrId[index]);
            }
        }
    }

    request.sDllFilePath = CTxCommunityDllRFilePath;
    request.sFunction = "OnWritingComment";
    request.comment = { "idObject": AIdObject, "ID": aIdComment, "ID_Parent": aIdCommentParent.toString(), "sName": sComment, "bPublic": bPublic, "people": people, "communities": communities };

    ajaxResponse = txAjax(sPathFileajaxExecuteFunction, request);

    rThis.CommentWdow.wdow.close();
    rThis.ReloadTreeComment(rThis.idObject);
    if (aIdCommentParent != 0) {
        rThis.openItem(aIdCommentParent);
    }
}

CTreeComment.prototype.DeleteCurrentComment = function (aIdComment) {
    var rThis = this;
    var request = {};
    var ajaxResponse = {};

    request.sDllFilePath = CTxCommunityDllRFilePath;
    request.sFunction = "OnDeletingComment";
    request.idComment = aIdComment;

    ajaxResponse = txAjax(sPathFileajaxExecuteFunction, request, true);

    if (ajaxResponse.sStatus == "ok") {
        rThis.tree.deleteItem(aIdComment);
    }
}
/////////////////////  COMMENT POP UP Functions /////////////////////
CTreeComment.prototype.checkTextAreaParent = function () {
    var textCheck = this.CommentWdow.TinyMceEditor.getContent();
    if (textCheck != "") {
        if (J("#RS_Submit_Comment")) {
            J("#RS_Submit_Comment").prop("disabled", false);
        }
    } else {
        if (J("#RS_Submit_Comment")) {
            J("#RS_Submit_Comment").prop("disabled", true);
        }
    }
}
function ChangePrivacy(Achoice) {
    if (Achoice == 'true') {
        document.getElementById("RS_People_concerned").innerHTML = RS_People_concerned_Public;
        document.getElementById("RS_Groups_concerned").innerHTML = RS_Groups_concerned_Public;
    } else {
        document.getElementById("RS_People_concerned").innerHTML = RS_People_concerned_Private;
        document.getElementById("RS_Groups_concerned").innerHTML = RS_Groups_concerned_Private;
    }
}

function GetLanguage() {
    var sLang = "en";
    //new J.ajax({
    //    url: sPathFileTxCommunityAjax,
    //    async: false,
    //    dataType: "html",
    //    cache: false,
    //    data: {
    //        sFunctionName: "GetLanguage"
    //    },
    //    success: function (data) {
    //        sLang = data;
    //    }
    //});
    return sLang;
}
CTreeComment.prototype.collapseCellComment = function () {
    if (this._getParentCell().isCollapsed()) {
        this._expandParentCell();
    } else {
        this._collapseParentCell();
    }
}