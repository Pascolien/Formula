/*CG_Choice_Guide*/
CREATE INDEX IX_CG_Object_Type ON CG_Choice_Guide (ID_S_Object_Type)

/*CG_Question*/
CREATE INDEX IX_Q_Object_Information ON CG_Question (ID_S_Object_Information) 
CREATE INDEX IX_Q_Attribute_Information ON CG_Question (ID_S_Attribute_Information)
CREATE INDEX IX_Q_Choice_Guide ON CG_Question (ID_CG_Choice_Guide)
CREATE INDEX IX_Q_Question_Parent ON CG_Question (ID_CG_Question_Parent)

/*CG_Question_Criterion*/
CREATE INDEX IX_QC_CGsLoading ON CG_Question_Criterion (ID_MCS_Criterion,ID_CG_Question) 
CREATE INDEX IX_QC_Question ON CG_Question_Criterion (ID_CG_Question) 

/*D_Archived_File*/
/*D_Archived_Graphic*/
CREATE INDEX IX_AG_Data_Table ON D_Archived_Graphic (ID_D_Data_Table) 

/*D_Data_Boolean*/
CREATE INDEX IX_DBool_Object ON D_Data_Boolean (ID_S_Object, ID_S_Attribute, bValue) 
CREATE INDEX IX_DBool_Attribute ON D_Data_Boolean (ID_S_Attribute, ID_S_Object, bValue) 

/*D_Data_Date*/
CREATE INDEX IX_DDte_Object ON D_Data_Date (ID_S_Object, ID_S_Attribute, fValue)
CREATE INDEX IX_DDte_Attribute ON D_Data_Date (ID_S_Attribute,ID_S_Object, fValue) 

/*D_Data_Decimal*/
CREATE INDEX IX_DDec_Object ON D_Data_Decimal (ID_S_Object, ID_S_Attribute,fMin, fMax, fMean, ID_S_Unit)
CREATE INDEX IX_DDec_Attribute ON D_Data_Decimal (ID_S_Attribute,ID_S_Object, fMin, fMax, fMean, ID_S_Unit)
CREATE INDEX IX_DDec_Unit ON D_Data_Decimal (ID_S_Unit)

/*D_Data_File*/
CREATE INDEX IX_DFle_Object ON D_Data_File (ID_S_Object, ID_S_Attribute, sName, bView, ID_D_Archived_File) 
CREATE INDEX IX_DFle_Attribute ON D_Data_File (ID_S_Attribute, ID_S_Object, sName, bView, ID_D_Archived_File) 
CREATE INDEX IX_DFle_Archived_File ON D_Data_File (ID_D_Archived_File) 

/*D_Data_String*/
CREATE INDEX IX_DStr_Object ON D_Data_String (ID_S_Object, ID_S_Attribute, sValue) 
CREATE INDEX IX_DStr_Attribute ON D_Data_String (ID_S_Attribute, ID_S_Object,sValue) 

/*D_Data_Table*/
CREATE INDEX IX_DTbl_Object ON D_Data_Table (ID_S_Object, ID_S_Attribute) 
CREATE INDEX IX_DTbl_Attribute ON D_Data_Table (ID_S_Attribute,ID_S_Object) 

/*D_Data_Text*/
CREATE INDEX IX_DTxt_Object ON D_Data_Text (ID_S_Object, ID_S_Attribute) 
CREATE INDEX IX_DTxt_Attribute ON D_Data_Text (ID_S_Attribute,ID_S_Object) 

/*D_Data_URL*/ 
CREATE INDEX IX_DUrl_Object ON D_Data_URL (ID_S_Object, ID_S_Attribute,sValue, bView) 
CREATE INDEX IX_DUrl_Attribute ON D_Data_URL (ID_S_Attribute, ID_S_Object,sValue, bView) 

/*D_Link*/
CREATE INDEX IX_DLnk_Src ON D_Link (ID_S_Object_Source,ID_S_Object_Destination,ID_S_Link_Type) 
CREATE INDEX IX_DLnk_Dest ON D_Link (ID_S_Object_Destination,ID_S_Object_Source,ID_S_Link_Type) 
CREATE INDEX IX_DLnk_FullLnkReading ON D_Link (ID_S_Link_Type,ID_S_Object_Source,ID_S_Object_Destination) 
CREATE INDEX IX_DLnk_FullInvLnkReading ON D_Link (ID_S_Link_Type,ID_S_Object_Destination,ID_S_Object_Source) 

/*D_Series*/ 
CREATE INDEX IX_DSeries_Data_Table ON D_Series (ID_D_Data_Table,sName, iOrder, ID_S_Series_Type) 
CREATE INDEX IX_DSeries_Series_Type ON D_Series (ID_S_Series_Type) 

/*D_Table_Value*/
CREATE INDEX IX_DTV_Series ON D_Table_Value (ID_D_Series,sValue, iOrder, ID_S_Object_Lkd,ID_S_Unit,iType) 

/*DB_Revision*/
CREATE INDEX IX_DBR_MaxRev ON DB_Revision (sDev,iDB_Revision) 

/*E_Bookmark*/
CREATE INDEX IX_Bk_Extraction ON E_Bookmark (ID_E_Extraction) 
CREATE INDEX IX_Bk_Extraction_Lkd ON E_Bookmark (ID_E_Extraction_Lkd) 
CREATE INDEX IX_Bk_Attribute ON E_Bookmark (ID_S_Attribute) 

/*E_Exportation*/
CREATE INDEX IX_Exp_Log ON E_Exportation (ID_MD_Log) 
CREATE INDEX IX_Exp_Object_Type ON E_Exportation (ID_S_Object_Type) 

/*E_Extraction*/
CREATE INDEX IX_Ext_Object_Type ON E_Extraction (ID_S_Object_Type) 
CREATE INDEX IX_Ext_Attribute_Report ON E_Extraction (ID_S_Attribute_Report) 
CREATE INDEX IX_Ext_Object_Model ON E_Extraction (ID_S_Object_Model) 

/*Eq_Equivalence_Set*/

/*Eq_S_Attribute_ID*/
CREATE INDEX IX_EqAID_Attribute ON Eq_S_Attribute_ID (ID_S_Attribute) 
CREATE INDEX IX_EqAID_Equivalence_Set ON Eq_S_Attribute_ID (ID_Eq_Equivalence_Set) 

/*Eq_S_Attribute_sID*/
CREATE INDEX IX_EqAsID_Attribute ON Eq_S_Attribute_sID (ID_S_Attribute) 
CREATE INDEX IX_EqAsID_Equivalence_Set ON Eq_S_Attribute_sID (ID_Eq_Equivalence_Set) 

/*Eq_S_Object_ID*/
CREATE INDEX IX_EqOID_Object ON Eq_S_Object_ID (ID_S_Object)
CREATE INDEX IX_EqOID_Equivalence_Set ON Eq_S_Object_ID (ID_Eq_Equivalence_Set) 

/*Eq_S_Object_S_Attribute*/
CREATE INDEX IX_EqOA_Object ON Eq_S_Object_S_Attribute (ID_S_Object)
CREATE INDEX IX_EqOA_Equivalence_Set ON Eq_S_Object_S_Attribute (ID_Eq_Equivalence_Set) 
CREATE INDEX IX_EqOA_Attribute ON Eq_S_Object_S_Attribute (ID_S_Attribute)

/*Eq_S_Object_sID*/
CREATE INDEX IX_EqOsID_Object ON Eq_S_Object_sID (ID_S_Object)
CREATE INDEX IX_EqOsID_Equivalence_Set ON Eq_S_Object_sID (ID_Eq_Equivalence_Set)

/*MA_Applied_IO*/
CREATE INDEX IX_AIO_Equivalence_Set ON MA_Applied_IO (ID_Eq_Equivalence_Set)
CREATE INDEX IX_AIO_IO ON MA_Applied_IO (ID_MA_IO)
CREATE INDEX IX_AIO_Model_Application ON MA_Applied_IO (ID_MA_Model_Application)

/*MA_IO*/
CREATE INDEX IX_IO_Model ON MA_IO (ID_MA_Model)

/*MA_Model*/
/*MA_Model_Application*/
CREATE INDEX IX_MA_Model ON MA_Model_Application (ID_MA_Model)
CREATE INDEX IX_MA_Model_Application_Parent ON MA_Model_Application (ID_MA_Model_Application_Parent)
CREATE INDEX IX_MA_Object_Type ON MA_Model_Application (ID_S_Object_Type)

/*MCS_Criterion*/
CREATE INDEX IX_Crit_Attribute ON MCS_Criterion (ID_S_Attribute)
CREATE INDEX IX_Crit_RL ON MCS_Criterion (ID_MCS_Requirement_List)

/*MCS_Preselection*/
CREATE INDEX IX_P_Object ON MCS_Preselection (ID_S_Object,ID_MCS_Criterion)
CREATE INDEX IX_P_Criterion ON MCS_Preselection (ID_MCS_Criterion,ID_S_Object)

/*MCS_Requirement_List*/
CREATE INDEX IX_RL_RLsLoading ON MCS_Requirement_List (iRequirement_List_Type)
CREATE INDEX IX_RL_Choice_Guide ON MCS_Requirement_List (ID_CG_Choice_Guide,ID_S_Object_Type)
CREATE INDEX IX_RL_Question ON MCS_Requirement_List (ID_CG_Question)
CREATE INDEX IX_RL_Object_Type ON MCS_Requirement_List (ID_S_Object_Type)
CREATE INDEX IX_RL_Requirement_List_Owner ON MCS_Requirement_List (ID_MCS_Requirement_List_Owner)
CREATE INDEX IX_RL_Exportation ON MCS_Requirement_List (ID_E_Exportation)

/*MD_Action*/
CREATE INDEX IX_Act_Log ON MD_Action (ID_MD_Log)
CREATE INDEX IX_Act_Object_Owner ON MD_Action (ID_S_Object_Owner)

/*MD_Locking*/
CREATE INDEX IX_Lock_Object ON MD_Locking (ID_S_Object)
CREATE INDEX IX_Lock_Object_User ON MD_Locking (ID_S_Object_User)

/*MD_Log*/
CREATE INDEX IX_Log_Log_Data_Modif ON MD_Log (bLog_Data_Modif,bActive)
CREATE INDEX IX_Log_Log_Structure_Modif ON MD_Log (bLog_Structure_Modif,bActive)
CREATE INDEX IX_Log_Log_Usage_Actions ON MD_Log (bLog_Usage_Actions,bActive)

/*MD_Source*/
CREATE INDEX IX_Src_Object ON MD_Source (ID_S_Object, ID_S_Attribute)
CREATE INDEX IX_Src_Attribute ON MD_Source (ID_S_Attribute)
CREATE INDEX IX_Src_Object_Source ON MD_Source (ID_S_Object_Source)

/*MD_Traceability*/
CREATE INDEX IX_T_Object ON MD_Traceability (ID_S_Object,fModification_Date,ID_S_Object_User)

/*RM_Attribute*/
CREATE INDEX IX_RA_AttributesLoading ON RM_Attribute (ID_RM_Users_Group,ID_S_Attribute,iRight)
CREATE INDEX IX_RA_Attribute ON RM_Attribute (ID_S_Attribute)

/*RM_Attribute_Set*/
CREATE INDEX IX_RAS_ASsLoading ON RM_Attribute_Set (ID_RM_Users_Group,ID_S_Attribute_Set,iRight)
CREATE INDEX IX_RA_Attribute_Set ON RM_Attribute_Set (ID_S_Attribute_Set)

/*RM_Choice_Guide*/
CREATE INDEX IX_RCG_ChoiceGuidesLoading ON RM_Choice_Guide (ID_RM_Users_Group,ID_CG_Choice_Guide,iRight)
CREATE INDEX IX_RA_Choice_Guide ON RM_Choice_Guide (ID_CG_Choice_Guide)

/*RM_Exportation*/
CREATE INDEX IX_RExp_ExportationsLoading ON RM_Exportation (ID_RM_Users_Group,ID_E_Exportation,iRight)
CREATE INDEX IX_RExp_Exportation ON RM_Exportation (ID_E_Exportation)

/*RM_Extraction*/
CREATE INDEX IX_RExt_ExtractionsLoading ON RM_Extraction (ID_RM_Users_Group,ID_E_Extraction,iRight)
CREATE INDEX IX_RExt_Extraction ON RM_Extraction (ID_E_Extraction)

/*RM_Function*/
CREATE INDEX IX_RMF_RightsLoading ON RM_Function (ID_RM_Users_Group,iRight)

/*RM_Model_Application*/
CREATE INDEX IX_RMA_MAsLoading ON RM_Model_Application (ID_MA_Model_Application,ID_RM_Users_Group,iRight)
CREATE INDEX IX_RMA_Users_Group ON RM_Model_Application (ID_RM_Users_Group)

/*RM_Object*/
CREATE INDEX IX_RO_ObjectsReading ON RM_Object (ID_S_Object,ID_RM_Users_Group,iRight)

/*RM_Object_Type*/
CREATE INDEX IX_ROT_Rights ON RM_Object_Type (ID_RM_Users_Group,ID_S_Object_Type,iRight)
CREATE INDEX IX_ROT_Object_Type ON RM_Object_Type (ID_S_Object_Type)

/*RM_Requirement_List*/
CREATE INDEX IX_RRL_RLsLoading ON RM_Requirement_List (ID_RM_Users_Group,ID_MCS_Requirement_List,iRight)
CREATE INDEX IX_RL_Requirement_List ON RM_Requirement_List (ID_MCS_Requirement_List)

/*RM_User*/
--CREATE INDEX IX_U_BindLoginAndPassword ON RM_User (sLogin,sPassword,bBlocked)

/*RM_Users_Group*/
/*RM_Users_Group_User*/
CREATE INDEX IX_UGU_ApplyRights ON RM_Users_Group_User (ID_RM_User,ID_RM_Users_Group)

/*S_Attribute*/
CREATE INDEX IX_A_Attribute_Inheritage ON S_Attribute (ID_S_Attribute_Inherited)
CREATE INDEX IX_A_File_Type ON S_Attribute (ID_S_File_Type)
CREATE INDEX IX_A_Link_Type ON S_Attribute (ID_S_Link_Type)
CREATE INDEX IX_A_Object_Information ON S_Attribute (ID_S_Object_Information)
CREATE INDEX IX_A_Object_Type ON S_Attribute (ID_S_Object_Type)
CREATE INDEX IX_A_Table_Type ON S_Attribute (ID_S_Table_Type)
CREATE INDEX IX_A_Unit ON S_Attribute (ID_S_Unit)

/*S_Attribute_Set*/
CREATE INDEX IX_AS_Type ON S_Attribute_Set (iType)
CREATE INDEX IX_AS_Applied_IO ON S_Attribute_Set (ID_MA_Applied_IO)
CREATE INDEX IX_AS_Exportation ON S_Attribute_Set (ID_E_Exportation)
CREATE INDEX IX_AS_Object_Type ON S_Attribute_Set (ID_S_Object_Type)
CREATE INDEX IX_AS_Users_Group ON S_Attribute_Set (ID_RM_Users_Group)

/*S_Attribute_Set_Level*/
CREATE INDEX IX_ASL_AS_Level_Parent ON S_Attribute_Set_Level (ID_AS_Level_Parent)
CREATE INDEX IX_ASL_Attribute_Set ON S_Attribute_Set_Level (ID_S_Attribute_Set)
CREATE INDEX IX_ASL_LoadingASL ON S_Attribute_Set_Level (ID_S_Attribute, ID_S_Attribute_Set)

/*S_Attribute_Unit*/
CREATE INDEX IX_SAT_AttributesLoading ON S_Attribute_Unit (ID_S_Attribute,ID_S_Unit)
CREATE INDEX IX_SAT_Unit ON S_Attribute_Unit (ID_S_Unit)

/*S_Conversion*/
CREATE INDEX IX_Conv_Unit_Source ON S_Conversion (ID_S_Unit_Src)
CREATE INDEX IX_Conv_Unit_Dest ON S_Conversion (ID_S_Unit_Dest)

/*S_File_Type*/
/*S_Link_Type*/
CREATE INDEX IX_FT_Object_Filtering ON S_Link_Type (ID_S_Object_Filtering)
CREATE INDEX IX_FT_Object_Filtering_Inv ON S_Link_Type (ID_S_Object_Filtering_Inv)
CREATE INDEX IX_FT_Object_Type_Source ON S_Link_Type (ID_S_Object_Type_Source)
CREATE INDEX IX_FT_Object_Type_Destination ON S_Link_Type (ID_S_Object_Type_Destination)

/*S_Object*/
CREATE INDEX IX_O_ReadObjectsInTree ON S_Object (ID_S_Object_Parent,ID_S_Object_Type,iOrder,ID_S_Object,bFolder)
CREATE INDEX IX_O_FullOT ON S_Object (ID_S_Object_Type,bFolder)

/*CREATE INDEX IX_O_GetRootMaxOrder ON S_Object (ID_S_Object_Type,iOrder)*/
/*CREATE INDEX IX_O_GetLeafMaxOrder ON S_Object (ID_S_Object_Parent,iOrder)*/

/*S_Object_Type*/

/*S_Series_Type*/
CREATE INDEX IX_ST_Unit ON S_Series_Type (ID_S_Unit)
CREATE INDEX IX_ST_Table_Type ON S_Series_Type (ID_S_Table_Type)

/*S_Table_Type*/

/*S_Unit*/
/*T_Language*/

/*T_Object_Type_Translation*/
CREATE INDEX IX_OTT_Object_Type ON T_Object_Type_Translation (ID_S_Object_Type)
CREATE INDEX IX_OTT_Language ON T_Object_Type_Translation (ID_T_Language)

/*T_Translation*/
CREATE INDEX IX_T_Language ON T_Translation (ID_T_Language)

