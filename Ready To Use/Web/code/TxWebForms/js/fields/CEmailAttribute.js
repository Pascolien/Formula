function CEmailAttribute(aSettings) {
    this.field = aSettings.field;
    this.htmlDiv = aSettings.htmlDiv;
    this.bList = this.field.sType == "Email {}";
    this.sDataValue = "";
    this.bSendMail = J(this.htmlDiv).attr('SendEmail') || !aSettings.bWriteMode;

    var self = this,
        sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId()),
        data = isEmpty(this.field.Data) ? null : this.field.Data;

    this.sId = 'email' + sIdDivParent;

    if (isAssigned(data))
        this.sDataValue = data.sVal.replace(/<br>/g, " ");

    aSettings.sInput = aSettings.bWriteMode ? this.bList ? '<textarea id="' + this.sId + '"></textarea>' : '<input type="text" class="clInput" id="' + this.sId + '"/>' : '<label id="' + this.sId + '">' + data.sVal + '</label> ';

    aSettings.sDataValue = this.sDataValue;
    CAttributeField.call(this, aSettings);
}

CEmailAttribute.prototype = createObject(CAttributeField.prototype);
CEmailAttribute.prototype.constructor = CEmailAttribute;

CEmailAttribute.prototype.toString = function () {
    return "CEmailAttribute";
}

CEmailAttribute.prototype.initField = function () {
    var self = this;

    this.inp = J("#" + this.sId);
    //add button send mail
    if (this.bSendMail) {
        this.iParentDivWidth -= 25;
        J(this.htmlDiv).append('<a id="mailto' + this.sId + '"><img src="'+_url("/resources/theme/img/btn_form/16x16_send_email.png")+'" style="vertical-align:sub; padding:1px;"/></a>');
        J('#mailto' + this.sId).click(function () {
            var sContacts = "";
            if (self.bWriteMode)
                sContacts = self.inp.val();
            else
                sContacts = self.inp.html();

            sContacts = sContacts.replace(/\n/g, " ");
            sContacts = sContacts.replace(/<br>/g, " ");
            J(this).attr("href", "mailto:" + sContacts);
        });
        J('#mailto' + this.sId).hover(function () {
            J(this).css("cursor", "pointer");
            J(this).css("border", "1px grey solid");
            J(this).css("border-radius", "2px");
            J(this).css("box-shadow", "0px 1px 0px #aaa");
        }, function () {
            J(this).css("border", "none");
            J(this).css("box-shadow", "none");
        });
    }

    if (!this.bWriteMode)
        return;

    if (this.bList) {
        J("#" + this.sId).keyup(function () {
            self.adjustAreaHeight(this.value);
        });
        this.adjustAreaHeight(this.sDataValue);
    }

    if (this.bReadOnly) {
        J("#" + this.sId).attr("disabled", 'disabled');
        return;
    }
    var regMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}[.][a-zA-Z0-9]{2,4}$/;

    this.inp.css("width", qc(this.iParentDivWidth, "px"));

    if (this.bList) {
        this.inp.keyup(function () {
            var sMails = self.inp.val().replace(/\n/g, " ");
            sMails = sMails.replace(/ /g, " ");
            var mails = sMails.split(" "),
                mailIndexes = [],
                sValue = "";

            mails.forEach(function (aMail, i) {
                if (isEmpty(aMail))
                    mailIndexes.push(i);
            });

            for (var i = mailIndexes.length - 1 ; i > -1 ; i--) {
                mails.splice(mailIndexes[i], 1);
            }
            sMails = mails.join(" ");

            if (isEmpty(sMails)) {
                self.inp.css("border", "");
            } else {
                mails.find(function (aValue) {
                    sValue = "";
                    if (aValue != '') {
                        if (regMail.exec(aValue) == null) {
                            self.inp.css("border", "2px solid red");
                            sValue = null;
                            return true;
                        } else {
                            self.inp.css("border", "2px solid green");
                            sValue = sMails;
                        }
                    } else {
                        sValue = sMails;
                    }
                });
            }
            self.updateField(sValue);
        });
    } else {
		var checkValue = function () {
           if (self.inp.val() != '') {
                var sValue = self.inp.val();

                if (regMail.exec(sValue) == null) {
                    self.inp.css("border", "2px solid red");
                    self.updateField();
                } else {
                    self.inp.css("border", "2px solid green");
                    self.updateField(sValue);
                }
            } else {
                self.inp.css("border", "");
                self.updateField("");
            }
        }
        this.inp.keyup(function () {
            checkValue();
        });
        this.inp.change(function () {
            checkValue();
        });
    }
    this.inp.val(this.sDataValue);
}

CEmailAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);
    if (this.bUpdate) {
        data.sVal = data.sVal.replace(" ", "<br>")
    }

    return data;
}

CEmailAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly) {
        if (aLocked)
            J("#" + this.sId).attr("disabled", "disabled");
        else
            J("#" + this.sId).removeAttr("disabled");
    }
}