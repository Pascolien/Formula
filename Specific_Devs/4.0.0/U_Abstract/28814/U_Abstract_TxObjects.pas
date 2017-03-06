///<author>dev@bassetti.fr</author>
///<summary>Unit loading / unloading the dll named "TxObjects". This file is generated by TXUtils. Do not modify.</summary>
unit U_Abstract_TxObjects;
interface

uses
  SysUtils,classes, Windows,Contnrs, U_Small_Lib, MSXML2_TLB, U_Abstract;

type
  {$REGION 'U_Link_Associative_Objects'}
  TLink_Objects=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;

  ///<summary>Description function used by the models administration to retrieve the model's inputs and outputs.</summary>
  TFill_Description_Link_Associative_Objects=procedure(const ATxDir: string; const ADoc: IXMLDOMDocument); stdcall;

  TDoLinkAssociativeObjects=procedure(const AIdAttribute: Integer; const AIdObject: Integer; const AKeepExistingLinks: Boolean; const ASlLkdIdObject: TStringList); stdcall;

  TLink_Associative_Objects=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}

  {$REGION 'U_Sort_Object_Per_Alphabetical_Folder'}
  ///<summary>Description function used by the models administration to retrieve the model's inputs and outputs.</summary>
  TFill_Description_Sort_Object_Per_Alphabetical_Folder=procedure(const ATxDir: string; const ADoc: IXMLDOMDocument); stdcall;

  TSort_Object_Per_Alphabetical_Folder=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;

  ///<summary>Function moving a given Object into the folder starting with its first letter. The functions creates the folder if not existing.</summary>
  ///<returns>The function returns the identifier of the folder.</returns>
  TDoSort_Object_Per_Alphabetical_Folder=function(AIdObject: Integer; AIdABCFolder: Integer): Integer; stdcall;
  {$ENDREGION}

  {$REGION 'U_Sort_Objects_Per_Alphabetical_Folder'}
  ///<summary>Description function used by the models administration to retrieve the model's inputs and outputs.</summary>
  TFill_Description_Sort_Objects_Per_Alphabetical_Folder=procedure(const ATxDir: string; const ADoc: IXMLDOMDocument); stdcall;

  TSort_Objects_Per_Alphabetical_Folder=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;

  ///<summary>Function moving a given Object into the folder starting with its first letter. The functions creates the folder if not existing.</summary>
  ///<returns>The function returns the identifier of the folder.</returns>
  TDoSort_Objects_Per_Alphabetical_Folder=procedure(AIdObjectType: Integer; AIdFolderToSort: Integer; const ARecursive: Boolean; AIdABCFolder: Integer); stdcall;
  {$ENDREGION}

  {$REGION 'U_ObjectsManager'}
  TExistingLinkManagement=(
    elmReplace,
    elmAdd,
    elmCancel);

  TObjectCreationMode=(
    ocmUndefined,
    ocmCreation,
    ocmAdvCreation,
    ocmDuplication,
    ocmAdvDuplication);

  TObjectDuplicationSource=(
    odsUndefined,
    odsIdentifiers,
    odsTags,
    odsLkdObjects,
    odsSelectedObjects);

  TxObjectsAdvancedFunctions=class(TObject)
  public
    function InitializeCreationSettings(const AIdObjectType: Integer; const AIdObject: Integer; const ANbObjectsToAdd: Integer; const AUseCreation: Boolean; const AIdAdvCreation: Integer; const AIdAdvDuplication: Integer; const AObjectDuplicationSource: TObjectDuplicationSource; const AObjectsIDs: string; const AObjectsTags: string; const ALnkAttTags: string; const AAllowCreation: Boolean; out ACreationMode: TObjectCreationMode; out AIdAdvFunction: Integer; out AOlAttribute: TObjectList; out AOlObjectData: TObjectList): Boolean; virtual; stdcall; abstract;
    function ManageExistingLkdObjects(const AIdObject: Integer; const AIdAttribute: Integer; const AMode: TExistingLinkManagement; out ASlIdExistingLkdObject: TStringList; out AMessage: string): Boolean; virtual; stdcall; abstract;
    function JSONsToOlOjectData(const ANForms: Boolean; const ADataJsons: string; const AObjectsJSON: string): TObjectList; virtual; stdcall; abstract;
    procedure ManageDirectAndInverseLinkAttributes(const AIdLinkAtt: Integer; const AIdObject: Integer; const ASlIdLkdObject: TStringList; out AIdDestObjectType: Integer; out AIdFilteringObject: Integer; out AIdOppositeLnkAttribute: Integer; out ADataDirectLink: TD_Data_Link; const AOlDataToWrite: TObjectList; const AMode: TExistingLinkManagement); virtual; stdcall; abstract;
  end;

  TxObjectsFunctions=class(TObject)
  public
    ///<summary>Access to the advanced functions</summary>
    function Advanced: TxObjectsAdvancedFunctions; virtual; stdcall; abstract;
    function AddAndLinkObjects(const AIdObject: Integer; const AIdAttDirectLink: Integer; const AExistingLinksManagement: TExistingLinkManagement; const ACreationMode: TObjectCreationMode; const AIdAdvFunction: Integer; const AOlObjectData: TObjectList; out AMessage: string; out aSlIDObjCreated: TStringList): Boolean; virtual; stdcall; abstract;
    function AddObjects(const AIdObjectType: Integer; const AIdParent: Integer; const ACreationMode: TObjectCreationMode; const AIdAdvFunction: Integer; const AOlObjectData: TObjectList; out AMessage: string; out aSLIDObjCreated: TStringList): Boolean; virtual; stdcall; abstract;
    function AddASimpleObject(const AIdObjectType: Integer; const AIdParent: Integer; const AName: string): Integer; virtual; stdcall; abstract;
  end;

  ///<summary>Access to the objects management functions.</summary>
  T_Objects=function: TxObjectsFunctions; stdcall;
  {$ENDREGION}

  {$REGION 'U_WebAddAndLinkObjects'}
  ///<summary>Function executing the first step of Add_And_Link_Objects.</summary>
  ///<summary>The inputs are:</summary>
  ///<summary>-The TEEXMA directory.</summary>
  ///<summary>-The current object identifier.</summary>
  ///<summary>-The identifier of the link Attribute.</summary>
  ///<summary>-The behaviour in case of already existing links.</summary>
  ///<summary>-The effective number of objects to add and link.</summary>
  ///<summary>-An eventual advanced creation identifier.</summary>
  ///<returns>The functions returns</returns>
  ///<returns>-The function status (C_Web_Ok or an error message)</returns>
  ///<returns>-A success or failure status, depending on the management of the existing links.</returns>
  ///<returns>-A "business" message in case of no allowed action or a confirmation message.</returns>
  ///<returns>-A boolean indicating if "write" forms have to be displayed. If not, the objects have been added. No need to do anything more.</returns>
  ///<returns>- In case of write form, the list of the Attributes identifiers to display into this form.</returns>
  TWEBAddAndLinkObjectsStep1=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;

  ///<summary>Function executing the second step of Add_And_Link_Objects.</summary>
  TWEBAddAndLinkObjectsStep2=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}

  {$REGION 'U_AddCombinedObjects'}
  ///<summary>Description function used by the models administration to retrieve the model's inputs and outputs.</summary>
  TFill_Description_Add_Combined_Objects=procedure(const ATxDir: string; const ADoc: IXMLDOMDocument); stdcall;

  TAdd_Combined_Objects=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}

  {$REGION 'U_WinAddAndLinkObject'}
  ///<summary>Description function used by the models administration to retrieve the model's inputs and outputs.</summary>
  TFill_Description_Add_And_Link_Objects=procedure(const ATxDir: string; const ADoc: IXMLDOMDocument); stdcall;

  TAdd_And_Link_Objects=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}

  {$REGION 'U_WebAddObjects'}
  TWEBAddObjectsStep1=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;

  TWEBAddObjectsStep2=function(AArrInput: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}



var
  {$REGION 'U_Link_Associative_Objects'}
  Link_Objects: TLink_Objects;
  Fill_Description_Link_Associative_Objects: TFill_Description_Link_Associative_Objects;
  DoLinkAssociativeObjects: TDoLinkAssociativeObjects;
  Link_Associative_Objects: TLink_Associative_Objects;
  {$ENDREGION}

  {$REGION 'U_Sort_Object_Per_Alphabetical_Folder'}
  Fill_Description_Sort_Object_Per_Alphabetical_Folder: TFill_Description_Sort_Object_Per_Alphabetical_Folder;
  Sort_Object_Per_Alphabetical_Folder: TSort_Object_Per_Alphabetical_Folder;
  DoSort_Object_Per_Alphabetical_Folder: TDoSort_Object_Per_Alphabetical_Folder;
  {$ENDREGION}

  {$REGION 'U_Sort_Objects_Per_Alphabetical_Folder'}
  Fill_Description_Sort_Objects_Per_Alphabetical_Folder: TFill_Description_Sort_Objects_Per_Alphabetical_Folder;
  Sort_Objects_Per_Alphabetical_Folder: TSort_Objects_Per_Alphabetical_Folder;
  DoSort_Objects_Per_Alphabetical_Folder: TDoSort_Objects_Per_Alphabetical_Folder;
  {$ENDREGION}

  {$REGION 'U_ObjectsManager'}
  _Objects: T_Objects;
  {$ENDREGION}

  {$REGION 'U_WebAddAndLinkObjects'}
  WEBAddAndLinkObjectsStep1: TWEBAddAndLinkObjectsStep1;
  WEBAddAndLinkObjectsStep2: TWEBAddAndLinkObjectsStep2;
  {$ENDREGION}

  {$REGION 'U_AddCombinedObjects'}
  Fill_Description_Add_Combined_Objects: TFill_Description_Add_Combined_Objects;
  Add_Combined_Objects: TAdd_Combined_Objects;
  {$ENDREGION}

  {$REGION 'U_WinAddAndLinkObject'}
  Fill_Description_Add_And_Link_Objects: TFill_Description_Add_And_Link_Objects;
  Add_And_Link_Objects: TAdd_And_Link_Objects;
  {$ENDREGION}

  {$REGION 'U_WebAddObjects'}
  WEBAddObjectsStep1: TWEBAddObjectsStep1;
  WEBAddObjectsStep2: TWEBAddObjectsStep2;
  {$ENDREGION}


///<summary>Procedure loading the dll named "TxObjects".
///<param name="APath_File_DLL">The absolute path to the dll.</param>
procedure Load_TxObjects(APath_File_DLL: string);

///<summary>Procedure unloading the dll named "TxObjects".</summary>
procedure Unload_TxObjects;

///<summary>Function returning true if the dll "TxObjects" was loaded.</summary>
function Get_Dll_TxObjects_Loaded: boolean;

implementation

var
  hDll: THandle;

procedure Load_TxObjects(APath_File_DLL: string);
resourcestring
  RS_Error_Invalide_File='Le fichier %s n''est pas valide.';
begin
  if hDll <> 0 then
    exit;

  Check_FileExists(APath_File_DLL);

  hDll := Load_Dll(APath_File_DLL);

  {$REGION 'U_Link_Associative_Objects'}
  @Link_Objects := Get_Dll_Function_Adress(hDll,'Link_Objects',APath_File_DLL);
  @Fill_Description_Link_Associative_Objects := Get_Dll_Function_Adress(hDll,'Fill_Description_Link_Associative_Objects',APath_File_DLL);
  @DoLinkAssociativeObjects := Get_Dll_Function_Adress(hDll,'DoLinkAssociativeObjects',APath_File_DLL);
  @Link_Associative_Objects := Get_Dll_Function_Adress(hDll,'Link_Associative_Objects',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_Sort_Object_Per_Alphabetical_Folder'}
  @Fill_Description_Sort_Object_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'Fill_Description_Sort_Object_Per_Alphabetical_Folder',APath_File_DLL);
  @Sort_Object_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'Sort_Object_Per_Alphabetical_Folder',APath_File_DLL);
  @DoSort_Object_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'DoSort_Object_Per_Alphabetical_Folder',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_Sort_Objects_Per_Alphabetical_Folder'}
  @Fill_Description_Sort_Objects_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'Fill_Description_Sort_Objects_Per_Alphabetical_Folder',APath_File_DLL);
  @Sort_Objects_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'Sort_Objects_Per_Alphabetical_Folder',APath_File_DLL);
  @DoSort_Objects_Per_Alphabetical_Folder := Get_Dll_Function_Adress(hDll,'DoSort_Objects_Per_Alphabetical_Folder',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_ObjectsManager'}
  @_Objects := Get_Dll_Function_Adress(hDll,'_Objects',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_WebAddAndLinkObjects'}
  @WEBAddAndLinkObjectsStep1 := Get_Dll_Function_Adress(hDll,'WEBAddAndLinkObjectsStep1',APath_File_DLL);
  @WEBAddAndLinkObjectsStep2 := Get_Dll_Function_Adress(hDll,'WEBAddAndLinkObjectsStep2',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_AddCombinedObjects'}
  @Fill_Description_Add_Combined_Objects := Get_Dll_Function_Adress(hDll,'Fill_Description_Add_Combined_Objects',APath_File_DLL);
  @Add_Combined_Objects := Get_Dll_Function_Adress(hDll,'Add_Combined_Objects',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_WinAddAndLinkObject'}
  @Fill_Description_Add_And_Link_Objects := Get_Dll_Function_Adress(hDll,'Fill_Description_Add_And_Link_Objects',APath_File_DLL);
  @Add_And_Link_Objects := Get_Dll_Function_Adress(hDll,'Add_And_Link_Objects',APath_File_DLL);
  {$ENDREGION}

  {$REGION 'U_WebAddObjects'}
  @WEBAddObjectsStep1 := Get_Dll_Function_Adress(hDll,'WEBAddObjectsStep1',APath_File_DLL);
  @WEBAddObjectsStep2 := Get_Dll_Function_Adress(hDll,'WEBAddObjectsStep2',APath_File_DLL);
  {$ENDREGION}


end;

procedure Unload_TxObjects;
begin
  if hDll <> 0 then
  begin
    try
      FreeLibrary(hDll);
      hDll := 0;
    except
    end;
  end;
end;

function Get_Dll_TxObjects_Loaded: boolean;
begin
  result := (hDll>0)
end;

initialization
  hDll := 0;

finalization
  Unload_TxObjects;

end.