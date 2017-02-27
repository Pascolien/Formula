--CG_Choice_Guide
CREATE NONCLUSTERED INDEX IX_CG_Object_Type ON CG_Choice_Guide (ID_S_Object_Type)

--CG_Question
CREATE NONCLUSTERED INDEX IX_Q_Choice_Guide ON CG_Question (ID_CG_Choice_Guide)

--CG_Question_Criterion
CREATE NONCLUSTERED INDEX IX_QC_CGsLoading ON CG_Question_Criterion (ID_MCS_Criterion,ID_CG_Question)
CREATE NONCLUSTERED INDEX IX_QC_Question ON CG_Question_Criterion (ID_CG_Question)

--D_Archived_File
--D_Archived_Graphic
CREATE NONCLUSTERED INDEX IX_AG_Data_Table ON D_Archived_Graphic (ID_D_Data_Table)

--D_Data_Boolean
CREATE NONCLUSTERED INDEX IX_DBool_Object ON D_Data_Boolean (ID_S_Object, ID_S_Attribute) INCLUDE (bValue)
CREATE NONCLUSTERED INDEX IX_DBool_Attribute ON D_Data_Boolean (ID_S_Attribute) INCLUDE (ID_S_Object, bValue)

--D_Data_Date
CREATE NONCLUSTERED INDEX IX_DDte_Object ON D_Data_Date (ID_S_Object, ID_S_Attribute) INCLUDE (fValue)
CREATE NONCLUSTERED INDEX IX_DDte_Attribute ON D_Data_Date (ID_S_Attribute) INCLUDE (ID_S_Object, fValue)

--D_Data_Decimal
CREATE NONCLUSTERED INDEX IX_DDec_Object ON D_Data_Decimal (ID_S_Object, ID_S_Attribute) INCLUDE (fMin, fMax, fMean, ID_S_Unit)
CREATE NONCLUSTERED INDEX IX_DDec_Attribute ON D_Data_Decimal (ID_S_Attribute) INCLUDE (ID_S_Object, fMin, fMax, fMean, ID_S_Unit)

--D_Data_File
CREATE NONCLUSTERED INDEX IX_DFle_Object ON D_Data_File (ID_S_Object, ID_S_Attribute) INCLUDE (sName, bView, ID_D_Archived_File)
CREATE NONCLUSTERED INDEX IX_DFle_Attribute ON D_Data_File (ID_S_Attribute) INCLUDE (ID_S_Object, sName, bView, ID_D_Archived_File)
CREATE NONCLUSTERED INDEX IX_DFle_Archived_File ON D_Data_File (ID_D_Archived_File)

--D_Data_String
CREATE NONCLUSTERED INDEX IX_DStr_Object ON D_Data_String (ID_S_Object, ID_S_Attribute) INCLUDE (sValue)
CREATE NONCLUSTERED INDEX IX_DStr_Attribute ON D_Data_String (ID_S_Attribute) INCLUDE (ID_S_Object,sValue)

--D_Data_Table
CREATE NONCLUSTERED INDEX IX_DTbl_Object ON D_Data_Table (ID_S_Object, ID_S_Attribute)
CREATE NONCLUSTERED INDEX IX_DTbl_Attribute ON D_Data_Table (ID_S_Attribute) INCLUDE (ID_S_Object)

--D_Data_Text
CREATE NONCLUSTERED INDEX IX_DTxt_Object ON D_Data_Text (ID_S_Object, ID_S_Attribute)
CREATE NONCLUSTERED INDEX IX_DTxt_Attribute ON D_Data_Text (ID_S_Attribute) INCLUDE (ID_S_Object)

--D_Data_URL
CREATE NONCLUSTERED INDEX IX_DUrl_Object ON D_Data_URL (ID_S_Object, ID_S_Attribute) INCLUDE (sValue, bView)
CREATE NONCLUSTERED INDEX IX_DUrl_Attribute ON D_Data_URL (ID_S_Attribute) INCLUDE (ID_S_Object,sValue, bView)

--D_Link
CREATE NONCLUSTERED INDEX IX_DLnk_Src ON D_Link (ID_S_Object_Source,ID_S_Object_Destination,ID_S_Link_Type)
CREATE NONCLUSTERED INDEX IX_DLnk_Dest ON D_Link (ID_S_Object_Destination,ID_S_Object_Source,ID_S_Link_Type)
CREATE NONCLUSTERED INDEX IX_DLnk_FullLnkReading ON D_Link (ID_S_Link_Type,ID_S_Object_Source,ID_S_Object_Destination)
CREATE NONCLUSTERED INDEX IX_DLnk_FullInvReading ON D_Link (ID_S_Link_Type,ID_S_Object_Destination,ID_S_Object_Source)

--D_Series
CREATE NONCLUSTERED INDEX IX_DSeries_Data_Table ON D_Series (ID_D_Data_Table) INCLUDE (sName, iOrder, ID_S_Series_Type)
CREATE NONCLUSTERED INDEX IX_DSeries_Series_Type ON D_Series (ID_S_Series_Type)

--D_Table_Value
CREATE NONCLUSTERED INDEX IX_DTV_Series ON D_Table_Value (ID_D_Series) INCLUDE (sValue, iOrder, ID_S_Object_Lkd,ID_S_Unit,iType)

--DB_Revision
CREATE NONCLUSTERED INDEX IX_DBR_MaxRev ON DB_Revision (sDev,iDB_Revision)

--E_Bookmark
CREATE NONCLUSTERED INDEX IX_Bk_Extraction ON E_Bookmark (ID_E_Extraction)
CREATE NONCLUSTERED INDEX IX_Bk_Attribute ON E_Bookmark (ID_S_Attribute)

--E_Exportation
CREATE NONCLUSTERED INDEX IX_Exp_Object_Type ON E_Exportation (ID_S_Object_Type)

--E_Extraction
CREATE NONCLUSTERED INDEX IX_Ext_Object_Type ON E_Extraction (ID_S_Object_Type)
CREATE NONCLUSTERED INDEX IX_Ext_Attribute_Report ON E_Extraction (ID_S_Attribute_Report)
CREATE NONCLUSTERED INDEX IX_Ext_Object_Model ON E_Extraction (ID_S_Object_Model)

--Eq_Equivalence_Set

--Eq_S_Attribute_ID
CREATE NONCLUSTERED INDEX IX_EqAID_Attribute ON Eq_S_Attribute_ID (ID_S_Attribute)
CREATE NONCLUSTERED INDEX IX_EqAID_Equivalence_Set ON Eq_S_Attribute_ID (ID_Eq_Equivalence_Set)

--Eq_S_Attribute_sID
CREATE NONCLUSTERED INDEX IX_EqAsID_Attribute ON Eq_S_Attribute_sID (ID_S_Attribute)
CREATE NONCLUSTERED INDEX IX_EqAsID_Equivalence_Set ON Eq_S_Attribute_sID (ID_Eq_Equivalence_Set)

--Eq_S_Object_ID
CREATE NONCLUSTERED INDEX IX_EqOID_Object ON Eq_S_Object_ID (ID_S_Object)
CREATE NONCLUSTERED INDEX IX_EqOID_Equivalence_Set ON Eq_S_Object_ID (ID_Eq_Equivalence_Set)

--Eq_S_Object_S_Attribute
CREATE NONCLUSTERED INDEX IX_EqOA_Object ON Eq_S_Object_S_Attribute (ID_S_Object)
CREATE NONCLUSTERED INDEX IX_EqOA_Equivalence_Set ON Eq_S_Object_S_Attribute (ID_Eq_Equivalence_Set)
CREATE NONCLUSTERED INDEX IX_EqOA_Attribute ON Eq_S_Object_S_Attribute (ID_S_Attribute)

--Eq_S_Object_sID
CREATE NONCLUSTERED INDEX IX_EqOsID_Object ON Eq_S_Object_sID (ID_S_Object)
CREATE NONCLUSTERED INDEX IX_EqOsID_Equivalence_Set ON Eq_S_Object_sID (ID_Eq_Equivalence_Set)

--MA_Applied_IO
CREATE NONCLUSTERED INDEX IX_AIO_IO ON MA_Applied_IO (ID_MA_IO)
CREATE NONCLUSTERED INDEX IX_AIO_Model_Application ON MA_Applied_IO (ID_MA_Model_Application)

--MA_IO
CREATE NONCLUSTERED INDEX IX_IO_Model ON MA_IO (ID_MA_Model)

--MA_Model
--MA_Model_Application
CREATE NONCLUSTERED INDEX IX_MA_Model ON MA_Model_Application (ID_MA_Model)
CREATE NONCLUSTERED INDEX IX_MA_Object_Type ON MA_Model_Application (ID_S_Object_Type)

--MCS_Criterion
CREATE NONCLUSTERED INDEX IX_Crit_Attribute ON MCS_Criterion (ID_S_Attribute)
CREATE NONCLUSTERED INDEX IX_Crit_RL ON MCS_Criterion (ID_MCS_Requirement_List)

--MCS_Preselection
CREATE NONCLUSTERED INDEX IX_P_Object ON MCS_Preselection (ID_S_Object,ID_MCS_Criterion)
CREATE NONCLUSTERED INDEX IX_P_Criterion ON MCS_Preselection (ID_MCS_Criterion,ID_S_Object)

--MCS_Requirement_List
CREATE NONCLUSTERED INDEX IX_RL_RLsLoading ON MCS_Requirement_List (iRequirement_List_Type)
CREATE NONCLUSTERED INDEX IX_RL_Choice_Guide ON MCS_Requirement_List (ID_CG_Choice_Guide,ID_S_Object_Type)
CREATE NONCLUSTERED INDEX IX_RL_Question ON MCS_Requirement_List (ID_CG_Question)
CREATE NONCLUSTERED INDEX IX_RL_Object_Type ON MCS_Requirement_List (ID_S_Object_Type)
CREATE NONCLUSTERED INDEX IX_RL_Requirement_List_Owner ON MCS_Requirement_List (ID_MCS_Requirement_List_Owner)
CREATE NONCLUSTERED INDEX IX_RL_Exportation ON MCS_Requirement_List (ID_E_Exportation)

--MD_Action
CREATE NONCLUSTERED INDEX IX_Act_Log ON MD_Action (ID_MD_Log)

--MD_Locking
CREATE NONCLUSTERED INDEX IX_Lock_Object ON MD_Locking (ID_S_Object)

--MD_Log
CREATE NONCLUSTERED INDEX IX_Log_Log_Data_Modif ON MD_Log (bLog_Data_Modif,bActive)
CREATE NONCLUSTERED INDEX IX_Log_Log_Structure_Modif ON MD_Log (bLog_Structure_Modif,bActive)
CREATE NONCLUSTERED INDEX IX_Log_Log_Usage_Actions ON MD_Log (bLog_Usage_Actions,bActive)

--MD_Source
CREATE NONCLUSTERED INDEX IX_Src_Object ON MD_Source (ID_S_Object, ID_S_Attribute) INCLUDE (ID_S_Object_Source)
CREATE NONCLUSTERED INDEX IX_Src_Attribute ON MD_Source (ID_S_Attribute)

--MD_TRACEABILITY							 
CREATE NONCLUSTERED INDEX IX_T_Object ON MD_TRACEABILITY (ID_S_Object) INCLUDE(fModification_Date,ID_S_Object_User)

--RM_Attribute
CREATE UNIQUE NONCLUSTERED INDEX IX_RA_AttributesLoading ON RM_Attribute (ID_RM_Users_Group,ID_S_Attribute,iRight)
CREATE NONCLUSTERED INDEX IX_RA_Attribute ON RM_Attribute (ID_S_Attribute)

--RM_Attribute_Set
CREATE UNIQUE NONCLUSTERED INDEX IX_RAS_ASsLoading ON RM_Attribute_Set (ID_RM_Users_Group,ID_S_Attribute_Set,iRight)
CREATE NONCLUSTERED INDEX IX_RA_Attribute_Set ON RM_Attribute_Set (ID_S_Attribute_Set)

--RM_Choice_Guide
CREATE UNIQUE NONCLUSTERED INDEX IX_RCG_ChoiceGuidesLoading ON RM_Choice_Guide (ID_RM_Users_Group,ID_CG_Choice_Guide,iRight)
CREATE NONCLUSTERED INDEX IX_RA_Choice_Guide ON RM_Choice_Guide (ID_CG_Choice_Guide)

--RM_Exportation
CREATE UNIQUE NONCLUSTERED INDEX IX_RExp_ExportationsLoading ON RM_Exportation (ID_RM_Users_Group,ID_E_Exportation,iRight)
CREATE NONCLUSTERED INDEX IX_RExp_Exportation ON RM_Exportation (ID_E_Exportation)

--RM_Extraction
CREATE UNIQUE NONCLUSTERED INDEX IX_RExt_ExtractionsLoading ON RM_Extraction (ID_RM_Users_Group,ID_E_Extraction,iRight)
CREATE NONCLUSTERED INDEX IX_RExt_Extraction ON RM_Extraction (ID_E_Extraction)

--RM_Function
CREATE NONCLUSTERED INDEX IX_RMF_RightsLoading ON RM_Function (ID_RM_Users_Group,iRight)

--RM_Model_Application
CREATE UNIQUE NONCLUSTERED INDEX IX_RMA_MAsLoading ON RM_Model_Application (ID_MA_Model_Application,ID_RM_Users_Group,iRight)
CREATE NONCLUSTERED INDEX IX_RMA_Users_Group ON RM_Model_Application (ID_RM_Users_Group)

--RM_Object
CREATE UNIQUE NONCLUSTERED INDEX IX_RO_ObjectsReading ON RM_Object (ID_S_Object,ID_RM_Users_Group) INCLUDE (iRight)

--RM_Object_Type
CREATE UNIQUE NONCLUSTERED INDEX IX_ROT_Rights ON RM_Object_Type (ID_RM_Users_Group,ID_S_Object_Type,iRight)
CREATE NONCLUSTERED INDEX IX_ROT_Object_Type ON RM_Object_Type (ID_S_Object_Type)

--RM_Requirement_List
CREATE UNIQUE NONCLUSTERED INDEX IX_RRL_RLsLoading ON RM_Requirement_List (ID_RM_Users_Group,ID_MCS_Requirement_List,iRight)
CREATE NONCLUSTERED INDEX IX_RL_Requirement_List ON RM_Requirement_List (ID_MCS_Requirement_List)

--RM_User
CREATE NONCLUSTERED INDEX IX_U_BindLoginAndPassword ON RM_User (sLogin,sPassword,bBlocked)

--RM_Users_Group
--RM_Users_Group_User
CREATE NONCLUSTERED INDEX IX_UGU_ApplyRights ON RM_Users_Group_User (ID_RM_User,ID_RM_Users_Group)
CREATE NONCLUSTERED INDEX IX_UGU_Users_Group ON RM_Users_Group_User (ID_RM_Users_Group)

--S_Attribute
CREATE NONCLUSTERED INDEX IX_A_Object_Type ON S_Attribute (ID_S_Object_Type)

--S_Attribute_Set
CREATE NONCLUSTERED INDEX IX_AS_Type ON S_Attribute_Set (iType)
CREATE NONCLUSTERED INDEX IX_AS_Applied_IO ON S_Attribute_Set (ID_MA_Applied_IO)
CREATE NONCLUSTERED INDEX IX_AS_Exportation ON S_Attribute_Set (ID_E_Exportation)
CREATE NONCLUSTERED INDEX IX_AS_Object_Type ON S_Attribute_Set (ID_S_Object_Type)
CREATE NONCLUSTERED INDEX IX_AS_Users_Group ON S_Attribute_Set (ID_RM_Users_Group)

--S_Attribute_Set_Level
CREATE NONCLUSTERED INDEX IX_ASL_AS_Level_Parent ON S_Attribute_Set_Level (ID_AS_Level_Parent)
CREATE NONCLUSTERED INDEX IX_ASL_Attribute_Set ON S_Attribute_Set_Level (ID_S_Attribute_Set)
CREATE NONCLUSTERED INDEX IX_ASL_LoadingASL ON S_Attribute_Set_Level (ID_S_Attribute, ID_S_Attribute_Set)

--S_Attribute_Unit
CREATE NONCLUSTERED INDEX IX_SAT_AttributesLoading ON S_Attribute_Unit (ID_S_Attribute,ID_S_Unit)
CREATE NONCLUSTERED INDEX IX_SAT_Unit ON S_Attribute_Unit (ID_S_Unit)

--S_Conversion
CREATE NONCLUSTERED INDEX IX_Conv_Unit_Source ON S_Conversion (ID_S_Unit_Src)
CREATE NONCLUSTERED INDEX IX_Conv_Unit_Dest ON S_Conversion (ID_S_Unit_Dest)

--S_File_Type

--S_Link_Type
CREATE NONCLUSTERED INDEX IX_FT_Object_Type_Source ON S_Link_Type (ID_S_Object_Type_Source)
CREATE NONCLUSTERED INDEX IX_FT_Object_Type_Destination ON S_Link_Type (ID_S_Object_Type_Destination)

--S_Object
CREATE NONCLUSTERED INDEX IX_O_ReadObjectsInTree ON S_Object (ID_S_Object_Parent) INCLUDE (ID_S_Object_Type,iOrder,bFolder,sName,bParent,ID_S_Object_Owner,fDate_Creation,sTags)
CREATE NONCLUSTERED INDEX IX_O_FullOTOrRootObjects ON S_Object (ID_S_Object_Type, ID_S_Object_Parent) INCLUDE (iOrder, bFolder,sName,bParent,ID_S_Object_Owner,fDate_Creation,sTags)
--CREATE NONCLUSTERED INDEX IX_O_GetRootMaxOrder ON S_Object (ID_S_Object_Type,iOrder)
--CREATE NONCLUSTERED INDEX IX_O_GetLeafMaxOrder ON S_Object (ID_S_Object_Parent,iOrder)

--S_Object_Type

--S_Series_Type
CREATE NONCLUSTERED INDEX IX_ST_Table_Type ON S_Series_Type (ID_S_Table_Type)

--S_Unit
--T_Language

--T_Object_Type_Translation
CREATE NONCLUSTERED INDEX IX_OTT_Object_Type ON T_Object_Type_Translation (ID_S_Object_Type)
CREATE NONCLUSTERED INDEX IX_OTT_Language ON T_Object_Type_Translation (ID_T_Language)

--T_Translation
CREATE NONCLUSTERED INDEX IX_T_Language ON T_Translation (ID_T_Language)