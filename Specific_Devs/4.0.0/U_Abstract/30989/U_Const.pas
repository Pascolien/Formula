///<author>dev@bassetti.fr</author>
///<version>First version: 06/12/2007</version>
///<summary>Unit containing constants, listings common to all TEEXMA based projects.</summary>
unit U_Const;

interface

uses
  SysUtils;

type
  TAssociativity_Reading_Mode=(
    armLeft_Link,
    armRight_Link,
    armAll,
    armAll2);

  TDecimal_Value_Type=(
    dvtMin,
    dvtMean,
    dvtMax);

type
  EHandled=class(Exception);

resourcestring
  RS_Administration='Administration de TEEXMA';

const
  C_TEEXMA='TEEXMA';

  C_Demo_Version='Demo version - Do not distribute';

  {$REGION 'Error codes'}
  ///$000 means no error (constant found into U_Small_Lib).
  ///The range from $001 to $0FF is dedicated to:
  ///- U_Small_Lib: $001-$02F,
  ///- U_Big_Lib:   $030-$04F,
  ///- U_XML_Lib:   $050-$06F,
  ///- U_Query:     $070-$08F,
  ///- U_Object:    $090-$0AF.
  ///Error constants are named as follow: C_ERROR_%s with %s the name of the error class.

  {$REGION '[$100-$1FF] Connection, loaded objects'}
  C_ERROR_Connection                   = $100;
  C_ERROR_OT_User_Not_Found            = $101;
  C_ERROR_No_Login                     = $102;
  C_Error_Bind_Not_Correct             = $103;
  C_ERROR_No_Session_Opened            = $104;
  C_ERROR_Context_Variable_Not_Found   = $105;
  C_ERROR_LDAP                         = $106;
  C_ERROR_LDAP_Bind_Failed             = $107;
  C_ERROR_Account_Expired              = $109;
  C_ERROR_Password_Expired             = $10A;
  C_ERROR_Revision                     = $10B;
  C_ERROR_TEEXMA_EXML                  = $10C;
  C_ERROR_TEEXMA_EXML_Missing          = $10D;
  C_ERROR_TEEXMA_DB                    = $10E;
  C_ERROR_DB_Revision                  = $10F;
  C_ERROR_TEEXMA_Dir_Archived_Files_Not_Found    = $110;
  C_ERROR_Customer_Resources_Not_Found = $111;
  C_ERROR_TEEXMA_DB_Archived_Files     = $112;
  C_ERROR_Nb_MA_Loops                  = $113;
  C_ERROR_Licences_Ini                 = $114;
  C_ERROR_Licence_Ini_Missing          = $115;
  C_ERROR_Manual_Connection_Only       = $116;
  C_ERROR_No_Default_Login_Defined     = $117;
  C_ERROR_Manual_Connection_Prohibited = $118;
  C_WARNING_Password_Soon_Expiring     = $119;
  C_ERROR_Invalid_Context_Variable     = $11A;
  C_ERROR_Password_Not_Correctly_Confirmed = $11B;
  C_ERROR_Password_Policy_Not_Respected    = $11C;
  C_ERROR_Password_Not_Changed         = $11D;
  C_ERROR_LDAP_Server_Not_Found        = $11E;
  C_ERROR_LDAP_DNS_Domain_Not_Found    = $11F;
  C_ERROR_LDAP_Query                   = $120;
  C_ERROR_WF_Connection                         = $121;
  C_ERROR_WF_Process_Not_Existing               = $122;
  C_ERROR_WF_Wrong_Submit_Call                  = $123;
  C_ERROR_WF_Invalid_Attribute_Identifier       = $124;
  C_ERROR_WF_Attribute_Not_Belonging_To_OT      = $125;
  C_ERROR_WF_Attribute_Inherited_Not_Handled    = $126;
  C_ERROR_WF_Attribute_List_Not_Handled         = $127;
  C_ERROR_WF_Attribute_Associative_Not_Handled  = $128;
  C_ERROR_WF_Task_Submission                    = $129;
  C_ERROR_TEEXMA_Workflow_DB                    = $12A;
  C_ERROR_WF_Param_Is_Not_String                = $12B;
  C_ERROR_WF_Param_Is_Not_Boolean               = $12C;
  C_ERROR_WF_Param_Is_Not_Float                 = $12D;
  C_Error_No_LDAP_Connection_Defined            = $12E;
  C_ERROR_No_LDAP_Connected                     = $12F;
  C_ERROR_LDAP_Unhandled_Error                  = $130;
  C_ERROR_WF_Not_Compatible_With_SGBD           = $131;
  C_ERROR_Process_Not_Started                   = $132;
  C_ERROR_WF_Process_DataSetElement_Not_Found   = $133;
  C_ERROR_WF_Process_Kill_Object_Instances_Not_Found  = $134;
  C_ERROR_Connection_Reinitialized              = $135;
  C_ERROR_Connection_Lost                       = $136;
  C_ERROR_Blind_User                            = $137;
  C_ERROR_Incorrect_Extractions_Rights          = $138;
 {$ENDREGION}

  {$REGION '[$200-$2FF] Structure'}
  C_ERROR_Object_Empty_Name          = $201;
  C_ERROR_Object_Creation            = $202;
  C_ERROR_Object_Parent_Not_Found    = $203;
  C_ERROR_Object_Parent_Modified     = $204;
  C_ERROR_Object_Sibling_Not_Found   = $205;
  C_ERROR_Object_Not_Found           = $206;
  C_ERROR_Object_User                = $207;
  C_ERROR_Object_Name_Incorrect      = $208;
  C_ERROR_Object_Name_Already_Used   = $209;
  C_ERROR_Attribute_Not_Writable     = $210;
  C_ERROR_Object_Type_Not_Writable   = $211;
  C_ERROR_Object_Not_Writable        = $212;
  C_ERROR_Import_Object_OT_Mismatch  = $213;
  C_ERROR_Import_Object_OT_Undefined = $214;
  C_ERROR_Import_Object_Not_Written  = $215;

  C_ERROR_Tagged_Concept_Not_Found   = $217;
  C_ERROR_Objects_Not_Deletable      = $218;

  C_ERROR_Attribute_Is_Not_Table     = $21E;

  C_ERROR_Object_With_Actions        = $220;
  C_ERROR_Incorrect_Filter           = $221;
  {$ENDREGION}

  {$REGION '[$300-$3FF] Model Applications'}
  C_ERROR_MA                         = $300;

  C_ERROR_ExcelNotAccessible         = $302;
  C_ERROR_MA_Dll_Exception           = $303;
  C_ERROR_Wrong_Equivalence_Set_Type = $304;
  C_ERROR_MA_Could_Not_Execute       = $305;
  C_ERROR_Applied_Output_Treatment_Failed = $306;
  {$ENDREGION}

  {$REGION '[$400-$4FF] Data'}
  C_ERROR_DM_Error                         = $400;
  C_ERROR_DM_Already_Read                  = $401;
  C_ERROR_DM_Non_Link_Attribute            = $402;
  C_ERROR_DM_Inheritance_Not_Relevant      = $403;
  C_ERROR_DM_Wrong_Preselection            = $404;
  C_ERROR_DM_No_OT_Defined                 = $405;
  C_ERROR_DM_No_Object_Defined             = $406;

  C_ERROR_Archived_File_Already_Existing   = $408;
  C_ERROR_Updated_File_With_Wrong_Ext      = $409;
  C_ERROR_DM_Function_Not_Callable_For_Inherited_Attribute  = $40A;
  C_ERROR_File_Not_Archived                = $40B;
  C_ERROR_Table                            = $40C;
  C_ERROR_Series_Type_Unknown              = $40D;
  C_ERROR_Series_Types_Unordered           = $40E;
  C_ERROR_Too_Many_Series                  = $40F;
  C_ERROR_Alpha_Value_Found                = $410;
  C_ERROR_Series_Type_Not_Belonging_To_Table_Type           = $411;
  C_ERROR_Document_Type_Missing            = $412;
  C_ERROR_Archived_File_Not_Extractable    = $413;
  {$ENDREGION}

  {$REGION '[$600-$6FF] XML'}
  C_ERROR_XML_TxAPI                       = $600;
  C_ERROR_XML_TD_Not_Handled               = $601;
  C_ERROR_XML_Wrong_TD                     = $602;
  C_ERROR_XML_NO_NODE_FOUND                = $603;
  {$ENDREGION}

  {$REGION '[$700-$9FF] Frames, forms handled TID_Objects'}
  C_ERROR_Virtual_Tree = $700;
  C_ERROR_Coupled_Object =$701;
  {$ENDREGION}

  {$REGION '[$A00-$BFF] Application - DO NOT FILL HERE'}
  {$ENDREGION}

  {$REGION '[$C00-$CFF] Specific developments - DO NOT FILL'}

  {$ENDREGION}

  {$REGION '[$D00-$FFE] Development errors (EDEV)'}
  C_ERROR_Empty_Reference              = $D01;
  C_ERROR_Attribute_List               = $D02;
  C_ERROR_Attribute_Not_Found          = $D03;
  C_ERROR_OT_Type_Not_Handled          = $D04;
  C_ERROR_Delete_Function              = $D05;

  C_ERROR_Abstract_Equivalence         = $D07;
  C_ERROR_No_User_Connected            = $D08;
  C_ERROR_User_Already_Connected       = $D09;
  C_ERROR_User_Not_Existing            = $D0A;
  C_ERROR_Nb_MA_Loops_Negative         = $D0B;
  C_ERROR_TD_Not_Handled               = $D0C;
  C_ERROR_TT_Table_Already_Rented      = $D0D;
  C_ERROR_MA_Group_Visible_Attribute_Not_Link         = $D0E;
  C_ERROR_WF_Task_Is_Not_A_Message     = $D0F;
  C_ERROR_Equivalence_Not_Found        = $D10;

  C_ERROR_Attribute_Not_Numerical      = $D12;
  C_ERROR_Attribute_Not_Link           = $D13;
  C_ERROR_Attribute_Not_Boolean        = $D15;
  C_ERROR_Attribute_Not_String         = $D16;
  C_ERROR_Users_Group_Not_Existing     = $D17;
  C_ERROR_Right_Not_Existing           = $D18;
  C_ERROR_Object_Data_Not_Initialized  = $D1A;
  C_ERROR_MA_Group_Visible_No_Link_Attribute_Defined  = $D1B;
  C_ERROR_Method_To_Excel_Not_Callable = $D1C;
  C_ERROR_Delete_Objects_Many_OTs      = $D1D;
  C_ERROR_Users_Group_Not_Business     = $D1E;
  C_ERROR_Users_Group_Missing_Right_OT_For_Business   = $D1F;
  C_ERROR_Users_Group_Non_Link_Data_In_Business       = $D20;
  C_ERROR_Users_Group_Not_Found        = $D21;

  C_ERROR_Admin_Not_Unbindable         = $D23;
  C_Error_Wrong_Context                = $D24; 
  C_ERROR_TxAPI_Connection_Not_Initialized            = $D25;
  C_ERROR_Comparison_Attribute_Set_Type= $D26;
  C_ERROR_Wrong_Question_Type          = $D27;
  C_ERROR_TT_Table_Not_Found           = $D28;
  C_ERROR_TT_Table_Not_Freeable        = $D29;
  C_ERROR_TT_Table_Not_Cleared         = $D2A;
  C_ERROR_TT_Table_Not_Creatable       = $D2B;
  C_ERROR_Library_Not_Referenceable    = $D2C;
  C_Error_Library_Not_Versionable      = $D2D;
  C_ERROR_Library_New_Model_Initialize = $D2E;
  C_ERROR_Library_Document_Initialize  = $D2F;
  C_ERROR_Attribute_Not_File           = $D30;
  {$ENDREGION}

  {$REGION '[$E00-$EFF] Export, import, extraction'}
  C_ERROR_File_Config_Not_Correctly_Defined = $E00;
  C_ERROR_No_PDF_Printer_Installed = $E01;
  {$ENDREGION}

  {$REGION '[$F00-$FFF] File Type'}
  C_ERROR_File_Type_Has_Archived_Files = $F00;
  {$ENDREGION}


  {$ENDREGION}

  {$REGION 'Data Type'}
  C_TD_CS_LDAP              = -192;
  C_TD_CS                   = -191;
  C_TD_MCS_Result           = -186;
  C_TD_Mark_Criterion       = -185;
  C_TD_Mark_Obj             = -184;
  C_TD_Mark                 = -183;
  C_TD_Criterion            = -181;
  C_TD_NumericalCriterion   = -180;
  C_TD_TableCriterion       = -179;
  C_TD_TableSubCriterion1   = -178;
  C_TD_TableSubCriterion2   = -177;
  C_TD_TableInterpolationCriterion   = -176;
  C_TD_Bookmark             = -171;
  C_TD_Applied_IO           = -161;
  C_TD_IO                   = -151;
  C_TD_Right_RL             = -141;
  C_TD_Right_MA             = -140;
  C_TD_Right_Extraction     = -139;
  C_TD_Right_Exportation    = -138;
  C_TD_Right_CG             = -137;
  C_TD_Right_Attributes_Set = -136;
  C_TD_Right_Att            = -135;
  C_TD_Right_OT             = -133;
  C_TD_Right_Obj            = -132;
  C_TD_Right_Function       = -131;
  C_TD_LObject              = -130;
  C_TD_Users_Group_User     = -111;
  C_TD_Series_Type          = -101;
  C_TD_Information          = -92;
  C_TD_Tracking             = -91;
  C_TD_Answers               = -63;
  C_TD_Answer                = -62;
  C_TD_Exportation           = -57;
  C_TD_MD_Action             = -56;
  C_TD_MD_Log                = -55;
  C_TD_BV_Object             = -54;
  C_TD_Object_Data           = -52;
  C_TD_Locking               = -51;
  C_TD_Eq                    = -47;
  C_TD_iEq                   = -46;
  C_TD_sEq                   = -45;
  C_TD_Eq_Obj_Att            = -44;
  C_TD_Eq_Att_sID            = -43;
  C_TD_Eq_Att_ID             = -42;
  C_TD_Eq_Obj_sID            = -41;
  C_TD_Eq_Obj_ID             = -40;
  C_TD_Equivalence_Set       = -39;
  C_TD_SystemRL              = -38;
  C_TD_SolRExternalServer    = -37;
  C_TD_Translation_OT       = -33;
  C_TD_Translation          = -32;
  C_TD_Language             = -31;
  C_TD_Attribute_Set_Level  = -30;
  C_TD_Attribute_Set        = -29;
  C_TD_Question             = -20;
  C_TD_CG                   = -19;
  C_TD_RL                   = -18;
  C_TD_Extraction           = -17;
  C_TD_Model_Application    = -16;
  C_TD_Model                = -15;
  C_TD_File_Type            = -14;
  C_TD_Right                = -13;
  C_TD_Users_Group          = -12;
  C_TD_User                 = -11;
  C_TD_Table_Type           = -10;
  C_TD_Source               = -9;
  C_TD_Link_Type            = -8;
  C_TD_Unit                 = -6;
  C_TD_Conversion           = -5;
  C_TD_Att                  = -4;
  C_TD_Obj                  = -3;
  C_TD_Tab                  = -2;
  C_TD_OT                   = -1;

  C_TD_Data_Boolean         = 1;
  C_TD_DataFile             = 2;
  C_TD_Data_String          = 3;
  C_TD_DLnk_Enum            = 4;
  C_TD_Data_Decimal         = 5;
  C_TD_Data_Table           = 6;
  C_TD_File                 = 7;
  C_TD_Data_Date            = 8;
  C_TD_Data_Text            = 9;

  C_TD_Data_Link_Ass        = 11;
  C_TD_Data_Link            = 12;
  C_TD_Group                = 13;

  C_TD_DDec_Unique          = 50;
  C_TD_DDec_Range           = 51;
  C_TD_DDec_Range_Mean      = 52;
  C_TD_Data_Series          = 61;
  C_TD_Table_Value          = 62;
  C_TD_Archived_Graphic     = 63;
  C_TD_DDate                = 80;
  C_TD_DDate_Time           = 81;
  C_TD_Data_File            = 100;
  C_TD_Data_Email           = 110;
  C_TD_Data_URL             = 111;
  C_TD_DLnk_Direct          = 121;
  C_TD_DLnk_Inv             = 122;
  C_TD_DLnk_Bi              = 123;
  C_TD_Archived_File        = 1004;
  C_TD_Obj_Ass              = 1200;


  C_Arr_TD_DLnk : array[0..4] of integer = (C_TD_DLnk_Direct,C_TD_DLnk_Inv,C_TD_DLnk_Bi,C_TD_Data_Link,C_TD_DLnk_Enum);
  C_Arr_TD_Containers : array[0..1] of integer = (C_TD_Group,C_TD_Tab);
  C_Arr_TD_DNum :       array[0..6] of integer = (C_TD_DDec_Unique,C_TD_DDec_Range,C_TD_DDec_Range_Mean,C_TD_Data_Decimal,C_TD_Data_Date,C_TD_DDate,C_TD_DDate_Time);
  C_Arr_TD_DDec :       array[0..3] of integer = (C_TD_DDec_Unique,C_TD_DDec_Range,C_TD_DDec_Range_Mean,C_TD_Data_Decimal);
  C_Arr_TD_DStr:        array[0..3] of integer = (C_TD_Data_String,C_TD_Data_Text,C_TD_Data_URL,C_TD_Data_Email);
  C_Arr_TD_DDate:       array[0..2] of integer = (C_TD_Data_Date,C_TD_DDate,C_TD_DDate_Time);
  //C_Arr_TD_Translation: array[0..4] of integer=(C_TD_Translation_OT,C_TD_Translation_Att,C_TD_Translation_AS,C_TD_Translation_CG,C_TD_Translation_Question);
  {$ENDREGION}

  {$REGION 'Tags'}
  CTg_Obj_LDAPNewUsersFolder='txObjLDAPNewUsersFolder';

  CTg_Obj_Action_Mail_Immediate = 'txObj_Action_Mail_Immediate';
  CTg_Obj_Action_Mail_Daily = 'txObj_Action_Mail_Daily';
  CTg_Obj_Action_Mail_Weekly = 'txObj_Action_Mail_Weekly';
  CTg_Obj_Document_In_Preparation = 'txObj_Document_In_Preparation';
  CTg_Obj_Document_Validated = 'txObj_Document_Validated';
  CTg_Obj_Document_in_Revision = 'txObj_Document_in_Revision';
  CTg_Obj_Document_Archived = 'txObj_Document_Archived';
  CTg_Obj_Relationship_Kinship = 'txObj_Relationship_Kinship';
  CTg_Obj_Relationship_Subordination = 'txObj_Relationship_Subordination';
  CTg_Obj_Task_Type_Notification = 'txObj_Task_Type_Notification';
  CTg_Obj_Task_Type_Event = 'txObj_Task_Type_Event';
  CTg_Obj_Task_Type_Milestone = 'txObj_Task_Type_Milestone';
  CTg_Obj_Task_Type_Task = 'txObj_Task_Type_Task';
  CTg_Obj_Task_Folder_Notifications = 'txObj_Task_Folder_Notifications';
  CTg_Obj_Task_Folder_Events = 'txObj_Task_Folder_Events';
  CTg_Obj_Lib_Folder_Models = 'txObj_Lib_Folder_Models';
  CTg_Obj_DT_Model_With_File = 'txObj_DT_Model_With_File';
  CTg_Obj_DT_Model_Without_File = 'txObj_DT_Model_Without_File';
  CTg_Obj_DT_Document = 'txObj_DT_Document';

  CTg_OT_Task = 'txOT_Task';
  CTg_OT_Task_Notification_Type = 'txOT_Task_Notification_Type';
  CTg_OT_Task_Status = 'txOT_Task_Status';
  CTg_OT_Task_Action_Type = 'txOT_Task_Action_Type';
  CTg_OT_Task_Ass_Rec_Task = 'txOT_Task_Ass_Rec_Task';
  CTg_OT_Library = 'txOT_Library';
  CTg_OT_Library_Status = 'txOT_Library_Status';
  CTg_OT_Task_Task_Type = 'txOT_Task_Task_Type';
  CTg_OT_Task_Ass_Relationship = 'txOT_Task_Ass_Relationship';
  CTg_OT_Task_Relationship_Type = 'txOT_Task_Relationship_Type';
  CTg_OT_Project = 'txOT_Project';
  CTg_OT_Task_Ass_Charge = 'txOT_Task_Ass_Charge';
  CTg_OT_Library_Gestion_Type = 'txOT_Library_Gestion_Type';

  CTg_Att_Task_Author = 'txAtt_Task_Author';
  CTg_Att_Task_Notification_Type = 'txAtt_Task_Notification_Type';
  CTg_Att_Task_Recipients = 'txAtt_Task_Recipients';
  CTg_Att_Ass_Relationship_Parent_Task = 'txAtt_Ass_Relationship_Parent_Task';
  CTg_Att_Task_Status = 'txAtt_Task_Status';
  CTg_Att_Ass_Relationship_Child_Task = 'txAtt_Ass_Relationship_Child_Task';
  CTg_Att_Task_Number = 'txAtt_Task_Number';
  CTg_Att_Task_Duration = 'txAtt_Task_Duration';
  CTg_Att_Notification_Type_DeadLine = 'txAtt_Notification_Type_DeadLine';
  CTg_Att_Notification_Type_Action_Type = 'txAtt_Notification_Type_Action_Type';
  CTg_Att_Notification_Type_Frequency = 'txAtt_Notification_Type_Frequency';
  CTg_Att_Notification_Type_Mail_Content = 'txAtt_Notification_Type_Mail_Content';
  CTg_Att_Task_Description = 'txAtt_Task_Description';
  CTg_Att_Task_Date_Start = 'txAtt_Task_Date_Start';
  CTg_Att_Task_Date_End = 'txAtt_Task_Date_End';
  CTg_Att_Ass_Relationship_Relationship = 'txAtt_Ass_Relationship_Relationship';
  CTg_Att_Ass_Rec_Task_Date_Validation = 'txAtt_Ass_Rec_Task_Date_Validation';
  CTg_Att_Ass_Rec_Task_Validated = 'txAtt_Ass_Rec_Task_Validated';
  CTg_Att_Ass_Rec_Task_Date_Recall = 'txAtt_Ass_Rec_Task_Date_Recall';
  CTg_Att_Notification_Type_Duration = 'txAtt_Notification_Type_Duration';
  CTg_Att_Task_Color = 'txAtt_Task_Color';
  CTg_Att_User_Email = 'txAtt_User_Email';
  CTg_Att_Ass_Rec_Task_Task = 'txAtt_Ass_Rec_Task_Task';
  CTg_Att_Ass_Rec_Task_Rec = 'txAtt_Ass_Rec_Task_Rec';
  CTg_Att_Task_Object_Name = 'txAtt_Task_Object_Name';
  CTg_Att_Library_Version = 'txAtt_Library_Version';
  CTg_Att_Library_Number = 'txAtt_Library_Number';
  CTg_Att_Library_Title = 'txAtt_Library_Title';
  CTg_Att_Library_Date_Creation = 'txAtt_Library_Date_Creation';
  CTg_Att_Library_Date_Statut = 'txAtt_Library_Date_Statut';
  CTg_Att_Library_Biblio = 'txAtt_Library_Biblio';
  CTg_Att_Library_Previous_Version = 'txAtt_Library_Previous_Version';
  CTg_Att_Library_File_Ref = 'txAtt_Library_File_Ref';
  CTg_Att_Library_File_Modifiable = 'txAtt_Library_File_Modifiable';
  CTg_Att_Library_Files_Work = 'txAtt_Library_Files_Work';
  CTg_Att_Library_Status = 'txAtt_Library_Status';
  CTg_Att_Library_Author = 'txAtt_Library_Author';
  CTg_Att_Library_Short_Title = 'txAtt_Library_Short_Title';
  CTg_Att_Library_Doc_Type = 'txAtt_Library_Doc_Type';
  CTg_Att_Task_Parent_Tasks = 'txAtt_Task_Parent_Tasks';
  CTg_Att_Task_Children_Tasks = 'txAtt_Task_Children_Tasks';
  CTg_Att_Task_Task_Type = 'txAtt_Task_Task_Type';
  CTg_Att_Task_Project = 'txAtt_Task_Project';
  CTg_Att_Task_Progress = 'txAtt_Task_Progress';
  CTg_Att_Task_Imputation = 'txAtt_Task_Imputation';
  CTg_Att_Imputation_Task_Charged = 'txAtt_Imputation_Task_Charged';
  CTg_Att_Imputation_Hours_Allocated = 'txAtt_Imputation_Hours_Allocated';
  CTg_Att_Imputation_Hours_Charged = 'txAtt_Imputation_Hours_Charged';
  CTg_Att_Imputation_User_Charged = 'txAtt_Imputation_User_Charged';
  CTg_Att_Library_Model_Type = 'txAtt_Library_Model_Type';

  CTg_AS_Document_Creation = 'txAS_Document_Creation';
  CTg_AS_Library_StrGen = 'txAS_Library_StrGen';
  CTg_AS_Notification = 'txAS_Notification';
  CTg_AS_Model_Document_Creation = 'txAS_Model_Document_Creation';

  CTg_FT_Library_Ref = 'txFT_Library_Ref';
  CTg_FT_Library_Modifiable = 'txFT_Library_Modifiable';
  CTg_FT_Library_Work = 'txFT_Library_Work';

  CTg_TT_Scattered_Plot = 'txTT_Scattered_Plot';
  CTg_TT_Pie = 'txTT_Pie';
  CTg_TT_Bar = 'txTT_Bar';

  CTg_Mdl_TxStrGen = 'txMdl_StrGen';
  CTg_Mdl_Widget = 'txMdl_Widget';
  CTg_Mdl_WF_Launch = 'txMdl_WF_Launch';
  CTg_Mdl_WF_Cancel = 'txMdl_WF_Cancel';
  CTg_Mdl_WF_Valid = 'txMdl_WF_Valid';
  CTg_Mdl_WF_Notif_Calculation = 'txMdl_WF_Notif_Calculation';
  CTg_Mdl_Subs = 'txMdl_Subs';
  CTg_Mdl_ModifyObjectRights='txMdl_ModifyObjectRights';

//
//  C_Table_Obj = 'S_Object';
//  C_Table_OT = 'S_Object_Type';
//  C_Table_Att = 'S_Attribute';
//  C_Table_AS = 'S_Attribute_Set';
//  C_Table_FT = 'S_File_Type';
//  C_Table_TT = 'S_Table_Type';
//  C_Table_ST = 'S_Series_Type';
//  C_Table_Unit = 'S_Unit';
//  C_Table_MD = 'MD_Log';
//  C_Table_Mdl = 'MA_Model';
//  C_Table_MA = 'MA_Model_Application';
//  C_Table_EqS = 'Eq_Equivalence_Set';
//  C_Table_Export = 'E_Exportation';
//  C_Table_Extr = 'E_Extraction';
//  C_Table_MCS_Cri = 'MCS_Criterion';
//  C_Table_MCS_RL = 'MCS_Requirement_List';
//  C_Table_RM_UG = 'RM_Users_Group';
//
  {$ENDREGION}

  {$REGION 'XML Constants'}
  C_XML_Value_Separator='|';
  C_XML_Line_Separator=#13#10;

  {$REGION 'Header'}
  C_XML_sOT='sOT';
  C_XML_ID_User='ID_User';
  C_XML_sUser='sUser';

  {$ENDREGION}

  {$REGION 'Data objects'}
  C_XML_ID_Obj='ID_Obj';
  CKeyIdAtt='ID_Att';

  C_XML_DDate='DDate';
  C_XML_DBool='DBool';
  C_XML_DStr='DStr';
  C_XML_DFile='DFile';
  C_XML_DURL='DURL';
  C_XML_DTxt='DTxt';
  C_XML_DLnk='DLnk';
  C_XML_DLnk_Ass='DLnk_Ass';

  C_XML_fVal='fVal';
  C_XML_sVal='sVal';
  C_XML_bVal='bVal';
  C_XML_abVal='abVal';
  C_XML_bView='bView';
  C_XML_bUseRichText='bUseRichText';

  C_XML_DDec='DDec';
  C_XML_fMin='fMin';
  C_XML_fMax='fMax';
  C_XML_fMean='fMean';
  C_XML_ID_Unit='ID_Unit';
  C_XML_UnitName='sUnitName';
  C_XML_ID_Lkd_Object='ID_Lkd_Object';

  C_XML_DataFileFiles='Files';
  C_XML_File='File';

  C_XML_ID_Archived_File='ID_AF';
  C_XML_FileName='sFileName';

  C_XML_Archived_File='AF';
  C_XML_sDate='sDate';
  C_XML_Index_Global='iIndex_Global';
  C_XML_iIndex='iIndex';
  C_XML_iVersion='iVersion';
  C_XML_Left_Ext='sLeft_Ext';
  C_XML_Ext='sExt';

  C_XML_DTble='DTble';
  C_XML_ID_ST='ID_ST';
  C_XML_ST='sType';
  C_XML_Ser='Ser';

  C_XML_iOrder='iOrder';
  C_XML_ID_Series='ID_Ser';

  C_XML_User='User';
  C_XML_Users_Group='UG';
  C_XML_Users_Group_User='UGU';

  C_XML_Right_OT='ROT';
  C_XML_Right_Object='RObj';
  C_XML_Right_Attribute='RAtt';

  C_XML_Right= 'Right';

  C_XML_Information = 'Info';
  C_XML_Action = 'Action';

  C_XML_Unit_Name='sUnit';
  C_XML_Name_OT_Destination='sOT_Dest';
  C_XML_sObj='sObj';

  ///Source Object
  C_XML_Src = 'Src';
  C_XML_Obj_Src = 'ID_Obj_Src';
  C_XML_ID_Src='ID_Src';
  C_XML_Action_Type='iActionType';
  C_XML_ID_Obj_User='ID_ObjUsr';

  ///Files
  C_XML_Path_File='sPath_File';
  C_XML_RPath_File='sRPath_File';
  C_XML_URL_File = 'sURL_File';

  C_XML_Locking='Lock';
  C_XML_Tracking='Tracking';

  C_XML_LkdObjects='LkdObjects';
  C_XML_IDsLkdObjects='IDsLkdObjects';
  {$ENDREGION}

  C_XML_SolRDir='sSolRDir';
  C_XML_WinDir='sWinDir';
  C_XML_WebUrl='sWebUrl';

  {$REGION 'Connection Settings'}

  // Connection Settings
  C_XML_CS = 'Connection_Settings';
  C_XML_DB_Type='iDB_Type';
  C_XML_Path = 'sPath';
  C_XML_Port= 'iPort';
  C_XML_SQLServerAuthenticationType='iSQLServerAuthenticationType';

  // CS LDAP
  C_XML_CS_LDAP = 'CS_LDAP';
  C_XML_DNS_Domain='sDNS_Domain';
  C_XML_Field_Login='sField_Login';
  C_XML_Field_Name='sField_Name';
  C_XML_Field_Member_Of='sField_Member_Of';
  C_XML_Field_Email='sField_Email';
  C_XML_Active_Directory='bAD';
  C_XML_Url='sUrl';
  {$ENDREGION}

  {$REGION 'Multicriteria selection'}
  C_XML_RL = 'RL';
  C_XML_ID_OT = 'ID_OT';
  CKeyAggregation = 'sAggregation';
  CKeyCreationDate = 'fCreationDate';
  CKeyWeight = 'fWeight';
  CKeyRLType= 'sRLType';
  CKeyIdChoiceGuide='idChoiceGuide';
  CKeyUseParentRL='bUseParentRL';
  CKeyIdQuestion='idQuestion';
  CKeyOwnerRL='idOwnerRL';
  CKeyIdExportation='idExportation';
  CKeyCritType='sCritType';

  C_XML_MCS_Results =       'Results';
  C_XML_Mark_Criterion =    'Mark';
  C_XML_Mark_Obj =          'Mark_Obj';
  C_XML_Mark_State =        'iState';
  C_XML_fMin_Comparison =   'fComp_Min';
  C_XML_fMax_Comparison =   'fComp_Max';
  C_XML_State_Comparison =  'iState_Comp';

  //Deprecated
  C_XML_OCT = 'sOptimizationCriterionType';
  C_XML_Opt_Val = 'fOptimizationValue';
  C_XML_ID_Unit_Opt = 'idOptimizationUnit';
  C_XML_Selection = 'bSelection';

  CKeyCriterion = 'Criterion';
  CKeySubCriteria='SubCriteria';
  CKeyNumericalCriterion='NumericalCriterion';
  CKeyTableCriterion='TableCriterion';
  CKeyTableSubCriterion1='TableSubCriterion1';
  CKeyTableSubCriterion2='TableSubCriterion2';
  CKeyTableInterpolationCriterion='TableInterpolationCriterion';
  CKeyPreselectionCriterion='PreselectionCriterion';
  CKeySubRLs='SubRLs';
  CKeyIdRL = 'idRL';
  CKeyLinkCriterionType = 'sLinkCritType';
  CKeyBooleanCritType = 'sBooleanCritType';
  CKeyNumericalCriterionType = 'sNumericalCritType';
  CKeyLBCritType = 'sLBCritType';
  CKeyLBValue = 'fLBValue';
  CKeyLBFzness = 'fLBFzness';
  CKeyIdLBUnit = 'idLBUnit';
  CKeyUBCritType = 'sUBCritType';
  CKeyUBValue = 'fUBValue';
  CKeyUBFzness = 'fUBFzness';
  CKeyIdUBUnit = 'idUBUnit';
  CKeyIdXSeriesType = 'idXSeriesType';
  CKeyIdYSeriesType = 'idYSeriesType';
  CKeyXValue = 'fXValue';
  CKeySearchedValue = 'sSearchedValue';
  CKeyPreselectionType = 'sPreselectionType';
  CKeyEmptyDataTreatment = 'sEmptyDataTreatment';
  CKeyPreselection = 'sPreselection';
  CKeyIdsQuestions  = 'sQuestionsIds';
  CKeyRecursivityType='sRecursivityType';
  CKeyLBDateCritType='sLBDateCritType';
  CKeyUBDateCritType='sUBDateCritType';
  CKeyDataTreatment='sDataTreatment';
  CKeyForceCriterion = 'bForceCriterion';
  CKeyIdSeriesType='idSeriesType';
  CKeyTableCritType='sTableCritType';
  CKeyTableSubCritType='sTableSubCritType';
  CKeyValueIndex='iValueIndex';
  {$ENDREGION}

  {$REGION 'Structure'}
  ///Object Type.
  C_XML_OT='OT';
  CKeyType='iType';
  CKeysType='sType';
  C_XML_Visible='bVisible';
  C_XML_Distinct_Names='bDistinct_Names';
  C_XML_Processes='sProcesses';
  C_XML_Locking_Duration='fLocking_Duration';
  C_XML_Locking_Type='iLocking_Type';
  C_XML_DisplayResultsIntoTextSearch='bDisplayResultsIntoTextSearch';
  C_XML_Shift='iShift';

  ///Attributes.
  C_XML_Attribute='Att';
  C_XML_AttType='sType';
  C_XML_AttTypeLabel='sTypeLabel';
  C_XML_TD_Data='TD_Data';
  CKeyIdAtt_Inherited='ID_Att_Inherited';
  C_XML_Traceable='bTraceable';
  C_XML_Dynamic='bDynamic';
  C_XML_ID_Obj_Information='ID_Obj_Info';
  C_XML_ID_Link_Type='ID_LT';
  C_XML_ID_File_Type='ID_FT';
  C_XML_Float_Format='iFF';
  C_XML_Precision='iPrec';
  C_XML_Digits='iDgts';
  C_XML_Link_Display_Mode = 'iLnk_Display_Mode';
  C_XML_Lower_Bound='fLB';
  C_XML_LB_Inclusive='bLB_Inclusive';
  C_XML_Upper_Bound='fUB';
  C_XML_UB_Inclusive='bUB_Inclusive';
  C_XML_Display_In_Main_Unit='bDisp_In_MU';
  C_XML_Inherited='bInherited';
  C_XML_Display_Table='bDisp_Table';
  C_XML_Transpose='bTranspose';
  C_XML_Display_Series_Name='bDisp_SN';
  C_XML_Display_Indexes='bDisp_Indexes';
  C_XML_View_Type='iView_Type';
  C_XML_IDs_Unit='sIDs_Unit';
  C_XML_Color='sColor';
  C_XML_Underlined='bUnderlined';
  C_XML_SecondaryUnits='SecondaryUnits';
  C_XML_AttAssociativity='Associativity';
  C_XML_RightLinkAtt='RightLinkAtt';
  C_XML_AssociativeAttributes='AssociativeAttributes';
  C_XML_AttributeSet='AttributeSet';
  C_XML_InheritedAttributes = 'InheritedAttributes';

  ///Objects.
  C_XML_Obj='Obj';
  C_XML_AssObj='AssObj';
  C_XML_DataObj='DataObj';
  C_XML_ID_Obj_Owner='ID_Obj_Owner';
  C_XML_ID_Object_Left='ID_Obj_Left';
  C_XML_ID_Object_Right='ID_Obj_Right';

  ///Series type.
  C_XML_Series_Type='SeriesTypes';
  C_XML_bMultiple='bN';
  C_XML_ID_Table_Type = 'ID_TableType';
  C_XML_bNumerical='bNum';

  ///Table Type;
  C_XML_Table_Type='TableType';
  C_XML_iGrapher='iGrapher';
  C_XML_bMany_Objects_Handled='bMOH';
  C_XML_bSuperposed_Objects_Handled='bSOH';
  C_XML_bMean_Curve_Handled='bMCH';

  ///Units and conversions.
  C_XML_Unit='Unit';
  C_XML_Unit_Description='sDecription_Unit';

  C_XML_Conversion='Conv';
  C_XML_ID_Unit_Src='ID_Unit_Src';
  C_XML_ID_Unit_Dest='ID_Unit_Dest';
  C_XML_fA='fA';
  C_XML_fB='fB';

  ///File Type
  C_XML_File_Type='FileType';
  C_XML_Base_Name='sBase_Name';
  C_XML_Base_Name_Modifiable='bBase_Name_Modifiable';
  C_XML_Version='bVersion';
  C_XML_Date_File='bDate_File';
  C_XML_RDir='sRDir';
  C_XML_Read_Only='bRO';
  C_XML_Title_Index='sTitle_Index';
  C_XML_Alpha_Index='bAlpha_Index';
  C_XML_Title_Version='sTitle_Version';
  C_XML_Alpha_Version='bAlpha_Version';
  C_XML_Index_Modifiable='bIndex_Modifiable';
  C_XML_File_Index_Type='iFIT';

  ///Attribute Set
  C_XML_Attribute_Set='AS';
  C_XML_ID_Applied_IO='ID_Applied_IO';
  C_XML_ID_Data_Table='ID_Data_Table';


  ///Attribute Set Level
  C_XML_Attribute_Set_Level='ASL';
  C_XML_ID_AS='ID_AS';
  C_XML_Format_Date='sFormat_Date';
  C_XML_Col='iCol';
  C_XML_Trigger_MA = 'bTrigger_MA';
  C_XML_Default = 'bDefault';
  C_XML_Levels='Levels';

  //Link Type
  C_XML_Link_Type = 'LinkType';
  C_XML_Multiplicity = 'bMul';
  C_XML_Multiplicity_Inv = 'bMul_Inv';
  C_XML_ID_OT_Source = 'ID_OT_Source';
  C_XML_ID_OT_Destination = 'ID_OT_Dest';
  C_XML_Associativity = 'bAsso';
  C_XML_ID_Obj_Filtering = 'ID_Obj_Filter';
  C_XML_ID_Obj_Filtering_Inv = 'ID_Obj_Filter_Inv';
  C_XML_Transpose_Inv='bTranspose_Inv';
  C_XML_Filtering_Type='iFilter_Type';
  C_XML_Filtering_Type_Inv='iFilter_Type_Inv';
  C_XML_AS_Filtering='AS_Filtering';
  C_XML_AS_Filtering_Inv='AS_Filtering_Inv';
  C_XML_StrongFilter='bStrongFilter';
  C_XML_StrongFilterInv='bStrongFilterInv';

  //BV_Object
  C_XML_BV_Object = 'BV_Obj';
  CKeyIdAttribute_Set = 'ID_Attribute_Set';
  CKeyIdAttribute_Set_Level = 'ID_Attribute_Set_Level';
  C_XML_RejectedIds='RejectedIds';
  {$ENDREGION}

  {$REGION 'Log'}
  C_XML_Log = 'Log';
  C_XML_Log_Data_Modif='b_Log_D_Modif';
  C_XML_Log_Structure_Modif='bLog_S_Modif';
  C_XML_Log_Usage_Actions='bLog_Actions';
  C_XML_Active='bActive';
  C_XML_Log_Connections='bLog_Connections';

  C_XML_XltFilename='sXltFileName';
  C_XML_ID_Log='ID_Log';
  C_XML_Open='bOpen';
  C_XML_System='sSystem';
  C_XML_TD_Obj='TD_Obj';
  C_XML_Context='iContext';
  C_XML_Date='fDate';
  C_XML_Comments='sComments';
  C_XML_Owner = 'sOwner';
  C_XML_Object_Name='sObj_Name';
  C_XML_IP='sIP';
  {$ENDREGION}

  {$REGION 'Lists'}
  C_XML_List='List';
  C_XML_Criteria = 'Criteria';
  C_XML_Series='Series';
  C_XML_Data = 'Data';
  C_XML_Objs  = 'Objs';
  C_XML_Srcs = 'Srcs';
  C_XML_OTs  = 'OTs';
  C_XML_Units = 'Units';
  C_XML_Conversions='Convs';
  C_XML_Rights_OT='Rights_OT';
  C_XML_Rights_Object='Rights_Obj';
  C_XML_Rights_Attribute='Rights_Att';
  C_XML_Rights_Attribute_Set='Rights_Att_Set';
  C_XML_Rights_Choice_Guide='Rights_CG';
  C_XML_Rights_Exportation='Rights_Export';
  C_XML_Rights_Extraction='Rights_Extract';
  C_XML_Rights_Model_Application='Rights_MA';
  C_XML_Rights_Requirement_List='Rights_RL';
  C_XML_UGUs='UGUs';
  C_XML_Attributes='Atts';
  C_XML_UGs='UGs';
  C_XML_File_Types='FTs';
  C_XML_Table_Types='TTs';
  C_XML_Series_Types='STs';
  CKeyModels='Models';
  CKeyInputs='Inputs';
  CKeyOutputs='Outputs';
  CKeyModelApplications = 'MAs';
  CKeyAppliedInputs= 'AppliedInputs';
  CKeyAppliedOutputs= 'AppliedOutputs';
  C_XML_Link_Types          = 'LTs';
  C_XML_Choice_Guides       = 'CGs';
  C_XML_Questions='Questions';
  C_XML_Exportations        = 'Exportations';
  C_XML_Extractions         = 'Extractions';
  C_XML_Users               = 'Users';
  C_XML_Attributes_Sets      = 'ASs';
  C_XML_Users_Groups        = 'UGs';
  C_XML_Equivalences_Sets    = 'ESs';
  C_XML_Translation_OTs = 'Translation_OTs';
  C_XML_Translations = 'Translations';
  {$ENDREGION}

  {$REGION 'Exportations, extractions, aso.'}
  C_XML_Extraction = 'Extraction';
  C_XML_Bookmark = 'BK';
  C_XML_Exportation='Exportation';
  C_XML_Zip='bZip';
  C_XML_Dir='sDir';
  C_XML_Base_Filename='sBase_Filename';
  C_XML_Modifiable='bModifiable';
  C_XML_Include_Header='bInc_Header';
  C_XML_XML_Verbosity='iXML_Verbosity';
  C_XML_Include_Sources='bInc_Src';
  C_XML_Object_Preselection_Type='iOPT';
  C_XML_Include_Date='bInc_Date';

  C_XML_RPath_File_Config='sRPath_File_Config';
  C_XML_Path_File_Config='sPath_File_Config';

  C_XML_Separator_Column='sSep_Col';
  C_XML_Separator_Data='sSep_Data';
  C_XML_bDefault='bDefault';
  C_XML_ID_Action_Last_Treated='ID_Action_LT';

  C_XML_Extraction_Type = 'iExtType';
  C_XML_Bookmark_OT = 'sBK_OT';
  C_XML_Row_OT = 'iRow_OT';
  C_XML_Col_OT = 'iCol_OT';
  C_XML_Bookmark_Object = 'sBK_Obj';
  C_XML_Row_Object = 'iRow_Obj';
  C_XML_Col_Object = 'iCol_Obj';
  C_XML_Bookmark_Author = 'sBK_Author';
  C_XML_Row_Author = 'iRow_Author';
  C_XML_Col_Author = 'iCol_Author';
  C_XML_Bookmark_Date = 'sBK_Date';
  C_XML_Row_Date = 'iRow_Date';
  C_XML_Col_Date = 'iCol_Date';
  C_XML_Bookmark_RL = 'sBK_RL';
  C_XML_Row_RL = 'iRow_RL';
  C_XML_Col_RL = 'iCol_RL';
  C_XML_ID_S_Object_Model = 'ID_S_Obj_Model';
  C_XML_Fill_In_Column = 'bFillInCol';
  CKeyIdAttribute_Report = 'ID_Att_Report';
  C_XML_PDF_Conversion_Options = 'iPDF_Conv_Options';

  C_XML_ID_Extraction = 'ID_Extraction';
  C_XML_ID_Extraction_Lkd = 'ID_Extraction_Lkd';
  C_XML_Row = 'iRow';
  C_XML_Include_File_Content = 'bInclude_File_Content';
  C_XML_Link_Separator = 'iLink_Separator';

  {$ENDREGION}

  {$REGION 'Models for XML'}
  CKeyInput='Input';
  CKeyOutput='Output';
  {$ENDREGION}

  {$REGION 'Users'}
  C_XML_Password='sPwd';
  C_XML_Blocked='bBlocked';
  C_XML_Last_Connection_Date='fLC_Date';
  C_XML_Last_Change_Password_Date='fLCP_Date';
  C_XML_Account_Expiration_Date='fAE_Date';
  C_XML_Duration_Password_Validity='iDPV';
  C_XML_Login='sLogin';
  {$ENDREGION}

  {$REGION 'Users Group'}
  C_XML_fraStructure='bfraStructure';
  C_XML_fraRights='bfraRights';
  C_XML_fraImportation='bfraImportation';
  C_XML_fraMultibase='bfraMultibase';
  C_XML_fruExportation='bfruExportation';
  C_XML_fruExtraction='bfruExtraction';
  C_XML_fruMCS='bfruMCS';
  C_XML_fruText_Search='bfruText_Search';
  C_XML_fruModels='bfruModels';
  C_XML_fruData_Mining='bfruData_Mining';
  C_XML_Assign_To_New_Users='bAssign_To_New_Users';
  {$ENDREGION}

  {$REGION 'Users_Group_User'}
  C_XML_ID_Users_Group='ID_UG';
  {$ENDREGION}

  {$REGION 'Rights'}
  C_XML_iRight='iRight';
  C_XML_Right_New_Object='iRight_New_Obj';
  C_XML_Right_Lkd_Object='iRight_Lkd_Obj';
  C_XML_Right_DB = 'iRight_DB';
  {$ENDREGION}

  {$REGION 'Task'}
  C_XML_Period='fPeriod';
  C_XML_Date_Next_Execution='fDate_Next_Exec';
  CKeyEnabled='bEnabled';
  {$ENDREGION}

  {$REGION 'Language and Translations'}
  //Language
  C_XML_Language = 'Language';
  C_XML_Code='sCode';
  C_XML_Translate_Attribute_Sets='bAdvancedFunctions';
  C_XML_Translate_Choice_Guides='bChoicesGuides';
  C_XML_Translate_Units='bUnits';
  C_XML_Translate_Tables='bTablesTypes';
  C_XML_Translate_BusinessViews='bBusinessViews';
  C_XML_Translate_Exportations='bExportation';
  C_XML_Translate_Models_Applications='bModelsApplications';

  // Translation
  C_XML_Translation = 'Translation';
  C_XML_ID_Language = 'ID_Language';
  C_XML_sTranslation = 'sTranslation';
  C_XML_Original_Text = 'sOriginal_Text';

  // Translation_Object_Type
  C_XML_Translation_Object_Type='Translation_Object_Type';
  C_XML_Translate_Attributes='bTrans_Att';
  C_XML_Translate_Objects='bTrans_Obj';
  {$ENDREGION}

  //Models
  CKeyIOType='sIOType';
  CKeyIdModel='idModel';
  CKeyWorksheet='sWorksheet';
  CKeyCell='sCell';
  CKeyIONature='sIONature';

  CKeyModel='Model';
  CKeyFunctionName='sFunction_Name';
  CKeyModelType='sModelType';
  CKeyWait='bWait';
  CKeyInputsFilePath='sInputsFilePath';
  CKeyOutputsFilePath='sOutputsFilePath';
  CKeyKeepLoaded='bKeepLoaded';

  CKeyAppliedInput='AppliedInput';
  CKeyAppliedOutput='AppliedOutput';
  CKeyIdModelApplication='idModelApplication';
  CKeyIdIO='idIO';
  CkeyDefaultValue='sDefaultValue';
  CKeyAggregationFunction='sAggregationFunction';
  CKeyAppliedIOType='sAppliedIOType';
  CKeyTrigger='bTrigger';
  CKeySourceFilePath='sSourceFilePath';

  C_XML_Model_Application='MA';
  CKeyEvent='sEvent';
  CKeyDisplayMode='sDisplayMode';
  CKeyCompatibilityMode='sCompatibilityMode';
  CKeyIconRFilePath='sIconRFilePath';
  CKeyReadWriteMode='sReadWriteMode';
  CKeyAllowCascade='bAllowCascade';
  CKeyObjectTypeDependency='sObjectTypeDependency';
  CKeyObjectDependency='sObjectDependency';

  //Equivalences
  C_XML_Equivalence = 'Eq';
  C_XML_Equivalence_Set = 'ES';
  CKeyIdEquivalencesSet='idEquivalencesSet';
  C_XML_Equivalence_Set_Type = 'iEq_Set_Type';
  C_XML_ID_StrGen_Configuration='ID_StrGen_Configuration';
  C_XML_ID_Left = 'ID_Left';
  C_XML_iEquivalence = 'iEq';
  C_XML_ID_Right = 'ID_Right';
  C_XML_TD_Referenced = 'TDRef';
  C_XML_sEquivalence = 'sEq';
  C_XML_sID_Right = 'sID_Right';
  C_XML_Eq_Object_ID = 'EqObj';
  C_XML_Eq_Object_sID = 'EqObj_sID';
  C_XML_Eq_Attribute_ID = 'EqAtt';
  C_XML_Eq_Attribute_sID = 'EqAtt_sID';
  C_XML_Eq_Object_Attribute = 'EqObjAtt';
  C_XML_Eq_Object_Type = 'EqOT';
  C_XML_Eq_Unit = 'EqUnit';
  C_XML_Eq_File_Type = 'EqFT';
  C_XML_Eq_Table_Type = 'EqTT';
  C_XML_Eq_Series_Type = 'EqST';
  C_XML_Eq_Choice_Guide = 'EqCG';
  C_XML_Eq_Question = 'EqQuestion';
  C_XML_Eq_Exportation = 'EqExport';
  C_XML_Eq_Extraction = 'EqExtraction';
  C_XML_Eq_Bookmark = 'EqBK';
  C_XML_Eq_Attribute_Set = 'EqAS';
  C_XML_Eq_Model = 'EqModel';
  C_XML_Eq_IO = 'EqIO';
  C_XML_Eq_Model_Application = 'EqMA';
  C_XML_Eq_Applied_IO = 'EqAIO';
  C_XML_Eq_Task = 'EqTask';
  C_XML_Eq_Language = 'EqLanguage';

  //Functions Rights
  C_XML_Right_Attribute_Set='RAttSet';
  C_XML_Right_Choice_guide='RCG';
  C_XML_Right_Exportation='RExport';
  C_XML_Right_Extraction='RExtract';
  C_XML_Right_Model_Application='RMA';
  C_XML_Right_Requirement_List='RRL';

  //Choice_Guide, Questions
  C_XML_Choice_Guide='CG';
  C_XML_Question='Question';
  C_XML_Answer='Answer';
  C_XML_Answers='Answers';
  C_XML_Opened='bOpened';
  C_XML_Question_Type='QT';
  C_XML_Information_Type='IT';
  CKeyIdAtt_Information='ID_Att_Info';
  C_XML_Extraction_Bookmark='sExt_BK';

  //Locking
  C_XML_Expiracy_Date='fExpiracyDate';


  C_XML_Before='Before';
  C_XML_After='After';
  C_XML_AddedLinks='AddedLinks';
  C_XML_DeletedLinks='DeletedLinks';
  C_XML_TraceabilityOwner='Owner';
  C_XML_ModificationDate='fModificationDate';
  C_XML_Traceabilities='Traceabilities';

  C_Default_Root_Name='TEEXMA';

  {$ENDREGION}

  {$REGION 'JSON Constants'}
  C_JSON_Grapher = 'iGrapher';
  C_JSON_FilenameSettings = 'sFilenameSettings';
  C_JSON_bManyObjectsHandled = 'bManyObjectsHandled';
  C_JSON_bSuperposedObjectsHandled = 'bSuperposedObjectsHandled';
  C_JSON_bMeanCurveHandled = 'bMeanCurveHandled';
  C_JSON_SeriesType = 'SeriesType';
  C_JSON_arrObjectsRight = 'arrObjectsRight';
  C_JSON_Multiple = 'bMultiple';
  C_JSON_idTableType = 'idTableType';
  C_JSON_IdParentFiltering = 'idParentFiltering';
  C_JSON_idSerieType = 'idSerieType';
  C_JSON_Numerical = 'bNumerical';
  C_JSON_jUnit = 'jUnit';
  C_JSON_jSeries = 'jSeries';
  C_JSON_jSerieType = 'jSerieType';
  C_JSON_jValues = 'jValues';
  C_JSON_idOTRight = 'idOTRight';
  C_JSON_Source = 'Source';
  {$ENDREGION}

  C_Special_TE_Normal = 0;
  C_Special_OT_User = 11;
  C_Special_TE_Source = 21;
  C_Special_TE_Information = 31;
  C_Special_TE_Enumeration = 51;
  C_Special_TE_Portail = 61;
  C_Special_TE_Associatif = 81;

  C_Date_Password_Never_Expiring  =54789; ///01/01/2050

  C_Trash_ID_Object      = -1000;

  C_Data_Separator      = '|';
  C_Value_Separator     = '<v>';
  C_Line_Separator      = '<br>';

  //Numbers of pictures
  C_Nb_Old_Pictures=124;
  C_Nb_New_Pictures=177;

  //Paths.
  C_RDir_Web='Web\';
  C_RDir_Win='Win\';
    C_RPath_File_TEEXMA_EXE=C_RDir_Win+'TEEXMA.exe';
  C_RDir_Configuration='Configuration\';
    C_RPath_File_Licences_Ini=C_RDir_Configuration+'Licences.ini';
    C_RPath_File_TEEXMA_EXML=C_RDir_Configuration+'TEEXMA.exml';
    C_RPath_File_Context_Variables_EXML=C_RDir_Configuration+'Context_Variables.exml';
  C_RDir_Administration='Core\';
    C_RPath_File_TxUpgrade_EXE=C_RDir_Administration+'TxUpgrade.exe';
    C_RPath_File_Administration_EXE=C_RDir_Administration+'Administration.exe';
    C_RDir_Dlls=C_RDir_Administration+'Dlls\';
      C_RPath_File_TxAPI_DLL=C_RDir_Dlls+'TxAPI.dll';
      C_RPath_File_APIHTML_DLL=C_RDir_Dlls+'TxHtml.dll';
      C_RPath_File_Cipher_DLL=C_RDir_Dlls+'Cipher.dll';
      C_RPath_File_LDAP_DLL=C_RDir_Dlls+'LDAP.dll';
      C_RPath_File_TXForms_DLL=C_RDir_Dlls+'TxForms.dll';
      C_RPath_File_TxTextSearch_DLL= C_RDir_Dlls + 'TxTextSearch.dll';
      C_RPath_File_TxWebComponents_DLL=C_RDir_Dlls+'TxWebComponents.dll';
      C_RPath_File_TxWebForm_DLL=C_RDir_Dlls+'TxWebForm.dll';
      C_RPath_File_TxWebExportation_DLL=C_RDir_Dlls+'TxWebExportation.dll';
      C_RPath_File_TxObjects_DLL=C_RDir_Dlls+'TxObjects.dll';
      C_RPath_File_TxContextVariables_DLL=C_RDir_Dlls+'TxContextVariables.dll';
      C_RPath_File_TxModelApplication_DLL=C_RDir_Dlls+'TxModelApplication.dll';
      C_RPath_File_TxPlanning_DLL=C_RDir_Dlls+'TxPlanning.dll';
      C_RPath_File_TxLogin_DLL=C_RDir_Dlls+'TxLogin.dll';
      C_RPath_File_TxLog_DLL=C_RDir_Dlls+'TxLog.dll';
      C_RPath_File_TxTraceabilities_DLL=C_RDir_Dlls+'TxTraceabilities.dll';

    C_RDir_MSOffice=C_RDir_Administration+'Resources\MSOffice\';
      C_RDir_TxExtract_EXE=C_RDir_MSOffice+'TxExtract.exe';
      C_RDir_TxExport_EXE=C_RDir_MSOffice+'TxExport.exe';


  C_RDir_WF = 'WorkFlow\';

  C_RPath_File_TxRights_DLL='TxRights\TxRights.dll';
  C_RPath_File_TxStrGen_DLL='TxStrGen\TxStrGen.dll';

  {$REGION 'Keys'}
  C_Tag_Separator = '&';

  C_Key_Expert_Mode='bExpert_Mode';
  C_Key_Empty_Trash='bEmpty_Trash';
  C_Key_ID_OT='ID_OT';
  C_Key_ID_Object='ID_Obj';
  C_Key_ID_Attribute = 'ID_Att';
  C_Key_ID_Tab_Attribute = 'ID_Tab_Att';
  C_Key_Message='sMsg';
  C_Key_Automatic='bAutomatic';
  C_Key_Dir_Backup='sDir_Backup';
  C_Key_No_Log='No_Log';
  C_Key_Dir_Backup_AF='sDir_Backup_AF';

  C_Key_Login='sLogin';
  C_Key_LoginEnc='sLoginEnc';
  C_Key_Password='sPasswd';
  C_Key_PasswordEnc='sPasswdEnc';
  C_Key_NoSplash='bSkipSplashScreen';
  C_Key_Function='sFunction';
  C_Key_ID_Language='ID_Language';

  C_Key_Import_File_Path = 'sImport_File_Path';
  C_Key_Format_File_Path = 'sFormat_File_Path';
  C_Key_Dir_Log = 'sLog_Directory';
  C_Key_Create_Link = 'bCreate_Link';
  C_Key_Column_Kinship= 'iColumn_Kinship';
  C_Key_Column_Kinship2= 'sColumn_Kinship';
  C_Key_Tab_As_CSV_Operator = 'bTab_as_CSV_Operator';
  ///Path Conflict Management.
  C_Key_PCM='iPCM';
  ///Object Creation Management.
  C_Key_OCM='iOCM';
  C_Key_ID_Parent_Object='ID_Parent_Object';
  C_Key_Create_As_Folder='bCreate_As_Folder';
  C_Key_Ignore_Empty_Cells='bIgnore_Empty_Cells';
  C_Key_Add_Data='bAdd_Data';
  C_Key_Quick_Import='bQuick_Import';
  C_Key_LeftTop='sLeftTop';
  C_Key_RightBottom='sRightBottom';
  C_Key_Automatic_Selection='bAutomatic_Selection';
  C_Key_iWorksheet='iWorksheet';
  C_Key_sWorksheet='sWorksheet';

  C_Key_DataSource='sDataSource';
  C_Key_DB_Type='iDB_Type';
  C_Key_Catalog='sCatalog';
  C_Key_Handle_Update='bHandle_Update';
  C_Key_Handle_Creation='bHandle_Creation';
  ///Object Recognizing Type
  C_Key_ORT='iORT';
  C_Key_Size_Tuple='iSize_Tuple';
  C_Key_Query='SQuery';
  C_Key_Query_TEEXMA='sQuery_TEEXMA';

  C_Key_Object_Name='sObject_Name';
  C_Key_ID_Object_Renamed='ID_Object_Renamed';
  C_Key_Banner_Path='sBanner_Path';
  C_Key_HTML_Code = 'sHTML_Code';
  C_Key_Reload_Value ='bReload_Structure';

  C_Key_External_URL = 'sExt_URL';
  C_Key_IdArchivedFileToOpen = 'IdArchivedFileToOpen';
  C_Key_IdArchivedFileToSave = 'IdArchivedFileToSave';
  C_Key_ID_MA = 'ID_MA';
  C_Key_ID_Object_Source = 'ID_S';
  C_Key_ID_Information = 'ID_Info';
  C_Key_ID_Data_Table_To_Save = 'DataTableToExport';
  C_Key_ID_BV='ID_BV';
  C_Key_ID_CG='ID_CG';
  C_Key_ID_ACS = 'ID_ACS';

  C_Key_ID_Parent_Old='ID_Parent_Old';
  C_Key_ID_Parent='ID_Parent';
  C_Key_ID_Next_Sibling='ID_Next_Sibling';
  C_Key_Duration='fDuration';
  C_Key_Date='fDate';
  C_Key_Old_Name='sOld_Name';

  C_arr_Cmd_Functions: array[0..13] of string=('','s','ft','ug','units','users','extract','o','choice_guides','import','nomenclature','languages','table_types','log');
  {$ENDREGION}

  {$REGION 'Tag for Files Types'}
    C_Tag_TEB_File_Type_Ref = 1;
    C_Tag_TEB_File_Type_Modifiable = 2;
    C_Tag_TEB_File_Type_For_Work = 3;
  {$ENDREGION}

  {$REGION 'Exportation tags'}
  C_Tag_Export_Std_Excel=1;
  C_Tag_Export_Std_Word=2;
  C_Tag_Export_Std_XML=3;
  C_Tag_Export_Std_Txt=4;
  C_Tag_Export_Std_File=5;
  {$ENDREGION}

  {$REGION 'WEB'}
  C_Tag_Browse_URL_Win  = 'navigation.asp?';
  C_Tag_Browse_URL_WEB = 'navigation.asp?sender=form&';
  C_Chemin_Relatif_Web_Url_Temp='temp/';
  C_Chemin_Relatif_Web_Path_Temp='temp\';
  C_Chemin_Relatif_Web_Url_Customer_Resources='customer resources/';
  C_WEB_Separateur_Donnee='||';
  C_Tag_Browse_URL_Navigation = 'navigation.asp';
  C_Web_Ok = 'ok';
  C_Web_Ko = 'ko';
  C_Web_Null = '<null>';
  {$ENDREGION}

  C_Tag_Object_Name = '<#TEEXMA_OBJECT_NAME#>';
  C_Tag_Object_ID = '<#TEEXMA_OBJECT_ID#>';
  C_Tag_User_Name = '<#TEEXMA_USER_NAME#>';
  C_Tag_Attribute_ID = '<#TEEXMA_ATTRIBUTE_ID#>';
  C_Tag_Object_Creation_Date = '<#TEEXMA_OBJECT_CREATION_DATE#>';
  C_Tag_Tracked_Attributes_Last_Modification_Date = '<#TEEXMA_TRK_ATT_LAST_MOD_DATE#>';

  C_Log_TXAPI='TxAPI';
  C_Key_Cipher_For_Specific_Devs='TEEXMA Specific Dev-2013-dev@bassetti.fr';

  C_Key_Log_TxAPI='bLog_TxAPI';
  C_Key_Log_TxQueries='bLog_TxQueries';

function Treat_TXStr(const S: string): string;

procedure Check_Key_For_TXStr(var AKey: Char);

///<summary>Function returning the TEEXMA color associated to a given mark between 0 and 1.</summary>
///<summary>The gradient is made of 3 points: 0: red ; 0.5: yellow ; 1: green.</summary>
///<param name="AMark">The mark</param>
///<param name="APastel">A pastel value between 0 and 1 that enables to "white" the colors.</param>
function MarkToColor(const AMark: double; const APastel: double): integer;

///<summary>Function returning true if a given data type is boolean.</summary>
function BooleanTD(const ATD: integer): boolean;

///<summary>Function returning true if a given data type is a numerical (date, decimal and possibly table).</summary>
function NumericalTD(const ATD: integer; AExclude_Tables: boolean=false): boolean;

///<summary>Function returning true if a given data type is a decimal.</summary>
function DecimalTD(const ATD: integer): boolean;

///<summary>Function returning true if a given data type is a date.</summary>
function DateTD(const ATD: integer): boolean;

///<summary>Function returning true if a given data type is a table.</summary>
function TableTD(const ATD: integer): boolean;

///<summary>Function returning true if a given data type is text (short or long text, e-mail, url and possibly files).</summary>
function TextTD(const ATD: integer; const AExclude_Files: boolean=false): boolean;

///<summary>Function returning true if a given data type is a link (direct, inverse, bidirectionnal and possibly enumerations).</summary>
function LinkTD(const ATD: integer; const AExclude_Enumerations: boolean=false): boolean;

///<summary>Function returning true if a given data type is a file.</summary>
function FileTD(const ATD: integer): boolean;

///<summary>Function returning true if a given data type is a container.</summary>
function ContainerTD(const ATD: integer): boolean;

///<summary>Function returning true if a given Object Type type is a standard type.</summary>
function StandardOT(const AType: integer): boolean;

///<summary>Function returning true if a given Object Type type is an enumeration type.</summary>
function EnumerationOT(const AType: integer): boolean;

///<summary>Function returning true if a given Object Type type is an associative type.</summary>
function AssociativeOT(const AType: integer): boolean;

///<summary>Function returning true if a given Object Type type is a sourceinfo type.</summary>
function SourceInfoOT(const AType: integer): boolean;

implementation

uses
  StrUtils,

  U_Small_Lib;

function MarkToColor(const AMark: double; const APastel: double): integer;
begin
  if AMark<0.5 then
    result := Pastel_Color(Mix_Colors(C_Red,C_Yellow,1.0-2*AMark),APastel)
  else
    result := Pastel_Color(Mix_Colors(C_Yellow,C_Green,2.0*(1.0-AMark)),APastel);
end;


function Treat_TXStr(const S: string): string;
begin
  result := ReplaceStr(S,C_Data_Separator,'');
  result := ReplaceStr(result,C_Value_Separator,'');
  result := ReplaceStr(result,C_Line_Separator,#13#10);

  result := Trim(result);
end;

procedure Check_Key_For_TXStr(var AKey: Char);
begin
  if AKey=C_Data_Separator then
    AKey := #0;
end;

function BooleanTD(const ATD: integer): boolean;
begin
  result := (ATD=C_TD_Data_Boolean);
end;

function NumericalTD(const ATD: integer; AExclude_Tables: boolean): boolean;
begin
  result := (IntIndex(C_Arr_TD_DNum,ATD)>-1);
  if not result and not AExclude_Tables then
    result := TableTD(ATD);
end;

function DecimalTD(const ATD: integer): boolean;
begin
  result := (IntIndex(C_Arr_TD_DDec,ATD)>-1);
end;

function DateTD(const ATD: integer): boolean;
begin
  result := (IntIndex(C_Arr_TD_DDate,ATD)>-1);
end;

function TableTD(const ATD: integer): boolean;
begin
  result := (ATD=C_TD_Data_Table);
end;

function TextTD(const ATD: integer; const AExclude_Files: boolean): boolean;
begin
  result := (IntIndex(C_Arr_TD_DStr,ATD)>-1);
  if not result and not AExclude_Files then
    result := FileTD(ATD);
end;

function FileTD(const ATD: integer): boolean;
begin
  result := (ATD=C_TD_Data_File);
end;

function LinkTD(const ATD: integer; const AExclude_Enumerations: boolean=false): boolean;
begin
  result := (IntIndex(C_Arr_TD_DLnk,ATD)>-1);
  if result and AExclude_Enumerations then
    result := (ATD<>C_TD_DLnk_Enum);
end;

function ContainerTD(const ATD: integer): boolean;
begin
  result := (IntIndex(C_Arr_TD_Containers,ATD)>-1);
end;

function StandardOT(const AType: integer): boolean;
begin
  result := (IntIndex([C_Special_TE_Normal,C_Special_OT_User,C_Special_TE_Portail],AType)>-1);
end;

function EnumerationOT(const AType: integer): boolean;
begin
  result := (IntIndex([C_Special_TE_Enumeration,C_Special_OT_User,C_Special_TE_Portail],AType)>-1);
end;

function AssociativeOT(const AType: integer): boolean;
begin
  result := (IntIndex([C_Special_TE_Associatif,C_Special_OT_User,C_Special_TE_Portail],AType)>-1);
end;

function SourceInfoOT(const AType: integer): boolean;
begin
  result := (IntIndex([C_Special_TE_Source,C_Special_OT_User,C_Special_TE_Portail],AType)>-1) or(IntIndex([C_Special_TE_Information,C_Special_OT_User,C_Special_TE_Portail],AType)>-1);
end;


end.
