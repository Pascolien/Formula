unit U_TxFormulas;

interface

uses
  System.Classes, SysUtils, contnrs, DBXJSON,

  U_Const,
  U_Abstract,
  U_Small_Lib;


type
  TxResult = class
  private
    ID_Attribute : Integer;
    fValue: Extended;
    sUnit: String;
    iAction : TDB_Action;

    procedure Initialze;
  public
    // Constructor
    function Get_Value: Extended; virtual; stdcall; export;
    procedure Set_Value(AValue: Extended); virtual; stdcall; export;

    function Get_Unit: string; virtual; stdcall; export;
    procedure Set_Unit(AUnit: string); virtual; stdcall; export;

    function To_JSON: TJSONObject;
  end;

type
  TxVariable = class(TxResult)
  private
    sName: String;

    procedure Initialize;
  public
    Constructor Create; overload;
    Destructor Destroy;  overload;

    function Get_Name: string; virtual; stdcall; export;
    procedure Set_Name(AName: string); virtual; stdcall; export;

    function To_JSON: TJSONObject; virtual; stdcall; export;
    procedure LoadFromJSON(AJSONObject: TJSONObject);
  end;

Function Create_Variable(): TxVariable; Stdcall; export;

type TxFormulaStoreMode=(fsmAttributes, fsmObjectSettings);

type
  TxFormula = class
  private
    id: integer;
    sName: string;
    OL_Variable: TObjectList;
    sFormula: String;
    Obj_Result: TxResult;
    iStoreMode: TxFormulaStoreMode;

    procedure Initialize;
  public
    Constructor Create(); overload;
    constructor Create_From_TEEXMA(const ATxObject: TS_Object_Data);
    Destructor Destroy(); override;

    function Get_Variable(AName: String): TxVariable; virtual; stdcall; export;
    procedure Set_Variable(AVariable: TxVariable); virtual; stdcall; export;

    function Get_OL_Variable: TObjectList; virtual; stdcall; export;

    function Get_Formula: string; virtual; stdcall; export;
    function Get_Result: TxResult; virtual; stdcall; export;

    function Is_Variable(AVariable: TxVariable): boolean; virtual;stdcall; export;

    function To_JSONStr: String; virtual; stdcall; export;
  end;

function Create_Formula: TxFormula; stdcall; export;
function Get_Formula(AArr_Input: array of const): Tarr_Varrec; stdcall; export;
function Save_Formula(AArr_Input: array of const): Tarr_Varrec; stdcall; export;

const
  C_Tag_Formula='TxFormula';

var
  Obj_Formula: TxFormula;

implementation

uses
  U_TxJSON,
  U_MainFormulas,
  U_TxFormula_Ini;

var
  Id_Obj: Integer;

function Create_Formula: TxFormula;
begin
  result := TxFormula.Create;
end;

function Save_Formula(AArr_Input: array of const): Tarr_Varrec;
const
  C_No_Data_Changed ='aucune modification de valeur.';
var
  ObjJSONFormula : TJSONObject;
  id_Formula: Integer;
  rJSONArr_Variables: TJSONArray;
  fResult: Extended;
  i: Integer;
  rObjJSONVariable: TJSONObject;
  iAction: Integer;
  OL_Data: TObjectList;
  rData: TD_Data;
  ID_Att: Integer;
  fValue: Extended;
  bModified: Boolean;
begin
  SetLength(result, 2);
  bModified := false  ;
  OL_Data := nil;
  try
    try
      ObjJSONFormula := TJSONObject.ParseJSONValue(VarRecToStr(AArr_Input[1])) as TJSONObject;
      id_Formula := StrToInt(ObjJSONFormula.GetValue('id_formula').Value);
      rJSONArr_Variables := ObjJSONFormula.GetValue('variables') as TJSONArray;

      {$REGION 'Write Variables'}
      for i := 0 to rJSONArr_Variables.Size - 1 do
      begin
        rObjJSONVariable := rJSONArr_Variables.Get(i) as TJSONObject;
        iAction := StrToInt(rObjJSONVariable.GetValue('iAction').Value);
        if TDB_Action(iAction) = dbaModif then
        begin
          bModified := true;
          if not assigned(OL_Data) then
            Ol_Data := TObjectList.Create;

          ID_Att := StrToInt(rObjJSONVariable.GetValue('idAttribute').Value);
          fValue := StrTOFloat(rObjJSONVariable.GetValue('value').Value);
          rData := Create_Data_Decimal;
          rData.Set_ID_Object(id_Formula);
          rData.Set_ID_Attribute(ID_Att);
          TD_Data_Decimal(rData).Set_Min(fValue);
          rData.Set_Action(dbaModif);

          OL_Data.Add(rData);
        end;
      end;
      {$ENDREGION}

      if bModified = false then
        raise Exception.Create(C_No_Data_Changed);

      {$REGION 'Write Result'}
      fResult := StrToFloat(ObjJSONFormula.GetValue('result').Value);
      rData := Create_Data_Decimal;
      rData.Set_ID_Object(id_Formula);
      rData.Set_ID_Attribute(inifile.Get_iValue('Result','ID_Att_fResult'));
      TD_Data_Decimal(rData).Set_Min(fResult);
      rData.Set_Action(dbaModif);

      OL_Data.Add(rData);
      {$ENDREGION}

      Write_Data(OL_Data);

      Set_VarRec(result[0], C_Web_Ok);
      Set_VarRec(result[1], C_Web_Ok);
    Except on E:Exception do
      begin
        Set_VarRec(result[0], C_Web_Ko);
        Set_VarRec(result[1], E.Message);
      end;
    end;
  finally
    FreeAndNilExt(OL_Data);
    ObjJSONFormula.Free;
  end;
end;

function Get_Formula(AArr_Input: array of const): Tarr_Varrec;
var
  TxObj_Formula: TS_Object_Data;
  sFormula: string;
  TxJSONObject: TJSONObject;
  jPair: TJSONPair;
  jValue: TJSONValue;
  ID_AS_Formula: Integer;
  rArr_Variables: TJSONArray;
  i: Integer;
  rJSONVariable: TJSONObject;
  rVariable: TxVariable;
  ID_Att_Inifile: Integer;

begin
  Setlength(result, 2);
  TxObj_Formula := nil;
  TxJSONObject := nil;

  DoInitialize_Dll(VarrecToStr(AArr_Input[0]));
  iStoreMode := TxFormulaStoreMode(StrToInt(VarRecToStr(AArrAArr_Input[5])
  Obj_Formula := nil;

  if iStoreMode = fsmObjectSettings then
  begin
    Obj_Formula := TxObj_Formula.Create;
    sJSON_Formula := _AS
  end;


  //récuperation des id de l attribut set et de la carac de l ini file
  id_Obj := StrToInt(VarrecToStr(AArr_Input[1]));
  ID_AS_Formula := StrToInt(VarrecToStr(AArr_Input[2]));
  ID_Att_Inifile := StrToInt(VarrecToStr(AArr_Input[3]));

  if assigned(Obj_Formula) then
    FreeAndNil(Obj_Formula);

  //creation de l'objet formule en récuperant l identifiant du lien, et l id de l objet
  TxObj_Formula := Create_Object_Data_From_Attribute_Set(ID_AS_Formula, Id_Obj, true);
  try
    try
      //recuperation du chemin du fihier ini et de l objet formule
      inifile := TxFormula_IniFile.Create(TxObj_Formula.Get_Data_sValue(ID_Att_Inifile, true));
      Obj_Formula := TxFormula.Create_From_TEEXMA(TxObj_Formula);

      Set_VarRec(result[0], 'ok');
      Set_VarRec(result[1], Obj_Formula.TO_JSONStr);

    except
      on e: exception do
      begin
        Set_VarRec(result[0], 'ko');
        Set_VarRec(result[1], e.message);
      end;
    end;
  finally
  // destruction / liberation de TxObj_Formula
    FreeAndNil(TxObj_Formula)
  end;
end;

function TxFormula.Get_Formula: string;
begin
  result := sFormula;
end;

function TxFormula.Get_OL_Variable: TObjectList;
begin
  result := OL_Variable;
end;

function TxFormula.Get_Result: TxResult;
begin
  result := Obj_Result;
end;

function TxFormula.Get_Variable(AName: String): TxVariable;
Var
  ID_Attribut: Integer;
  rAttribut: TS_Attribute;
  ID_Unit: Integer;
  ID_Object: Integer;
  rObject: TS_Object;
  AJSONObject: TJSONObject;
  MyVar: TObject;
  sName: string;

begin
  result := nil;

  if (ID_Object > 1) then
  begin
    rObject := nil;
    if (ID_Attribut > 0) then
    begin
      rAttribut := nil;
      rAttribut := Get_Attribute(ID_Attribut);
      if assigned(rAttribut) then
      begin
        sName := rAttribut.Get_Name;
        ID_Unit := rAttribut.Get_ID_Unit;
      end;
    end;
  end;
end;

{ TxFormula }

constructor TxFormula.Create;
begin
  inherited;
  Initialize;
end;

constructor TxFormula.Create_From_TEEXMA(const ATxObject: TS_Object_Data);
var
  rTxObj_Formula: TS_Object_Data;
  i: Integer;
  SL_ID_Att_Variable: TStringList;
  rAttribute: TS_Attribute;
  ID_Att: Integer;
  rData: TD_Data;
  rVariable: TxVariable;
begin
  initialize;
  id := ATxObject.Get_ID;
  sName := ATxObject.Get_Name;
  {$REGION 'Variables'}
  SL_ID_Att_Variable := nil;
  SL_ID_Att_Variable := inifile.Get_Variables;

  for i := 0 to SL_ID_Att_Variable.Count - 1 do
  begin
    ID_Att := StrToInt(SL_ID_Att_Variable[i]);
    rAttribute := nil;
    rAttribute := Get_Attribute(ID_Att);
    if Assigned(rAttribute) then
    begin
      rData := nil;
      rData := TD_Data(ATxObject.Get_Data(ID_Att, true));
      if Assigned(rData) then
      begin
        rVariable := TxVariable.Create;
        rVariable.ID_Attribute := ID_Att;
        rVariable.Set_Name(rAttribute.Get_Name);
        rVariable.Set_Value(TD_Data_Decimal(rData).Get_Min);
        //tant qu il y a des variables get name et ajouter au tableau
        if rAttribute.Get_ID_Unit > 0 then
          rVariable.Set_Unit(Get_Unit(rAttribute.Get_ID_Unit).Get_Name);

        Get_OL_Variable.Add(rVariable);
      end;
    end;
  end;
  {$ENDREGION}

  {$REGION 'Formula'}
  //Linked Formula object

  ID_Att := inifile.Get_iValue(C_Section_TxFormula, C_Name_ID_Att_Lnk_Formula);

  rTxObj_Formula := ATxObject.Get_Data_Object_Lkd(ID_Att, true);

  //Formula Value
  ID_Att := inifile.Get_iValue(C_Section_Formula, C_Name_ID_Att_Formula);
  if Assigned(rTxObj_Formula) then
    sFormula := rTxObj_Formula.Get_Data_sValue(ID_Att, true);
  {$ENDREGION}

  {$REGION 'Result'}
  ID_Att := inifile.Get_iValue(C_Section_Result, C_Name_ID_Att_fResult);
  rAttribute := nil;
  rAttribute := Get_Attribute(ID_Att);
  if Assigned(rAttribute) then
  begin
    sName := rAttribute.Get_Name;
    Obj_Result.ID_Attribute := ID_Att;
    Obj_Result.Set_Unit(Get_Unit(rAttribute.Get_ID_Unit).Get_Name);
   end
   else
    raise Exception.Create('erreur de chargement');
  {$ENDREGION}

end;

destructor TxFormula.Destroy;
begin
  Freeext(OL_Variable);
  inherited;
end;

procedure TxFormula.Initialize;
begin
  id := 0;
  OL_Variable := TObjectList.Create;
  Obj_Result := TxResult.Create;
end;

function TxFormula.Is_Variable(AVariable: TxVariable): boolean;
var
  i: Integer;
  rVariable: TxVariable;
begin
  result := false;
  for i := 0 to OL_Variable.Count - 1 do
  begin
    rVariable := TxVariable(OL_Variable[i]);
    if rVariable.Get_Name = AVariable.Get_Name then
    begin
      result := true;
      Exit;
    end;
  end;
end;

procedure TxFormula.Set_Variable(AVariable: TxVariable);
begin
  if Is_Variable(AVariable) = false then
    OL_Variable.Add(AVariable);
end;

function TxFormula.To_JSONStr: String;
var
  Obj_JSON: TJSONObject;
  i: Integer;
  rJSONArr_Variable: TJSONArray;
  rJSON_Variable: TJSONObject;
  rObj_JSONObj_Result: TJSONObject;
begin
  result := '';
  Obj_JSON := TJSONObject.Create;
  Append_JSONPair_Number(Obj_JSON, 'id_formula', ID);
  Obj_JSON.AddPair('name', sName);
  rJSONArr_Variable := TJSONArray.Create;
  try
    for i := 0 to OL_Variable.Count - 1 do
    begin
      rJSON_Variable := TxVariable(OL_Variable[i]).To_JSON;
      rJSONArr_Variable.AddElement(rJSON_Variable);
    end;

    Obj_JSON.AddPair('variables', rJSONArr_Variable);

    Obj_JSON.AddPair('formula', Get_Formula);

    rObj_JSONObj_Result := Get_Result.To_JSON;

    Obj_JSON.AddPair('result', rObj_JSONObj_Result);

    result := Obj_JSON.ToString;
  finally
    FreeAndNil(Obj_JSON);
  end;

end;

{ TxVariable }

Function Create_Variable(): TxVariable;
begin
  result := TxVariable.Create;
end;

constructor TxVariable.Create;
begin
  inherited;
  Initialize;
end;

destructor TxVariable.Destroy;
begin
  // Free memory
  inherited;
end;

function TxVariable.Get_Name: string;
begin
  result := sName;
end;

procedure TxVariable.Initialize;
begin
  sName := '';
end;

procedure TxVariable.LoadFromJSON(AJSONObject: TJSONObject);
begin
  if AJSONObject.Get('idAttribute') <> nil then
    ID_Attribute := StrToInt(TJSONNumber(AJSONObject.GetValue('idAttribute')).Value);

  if AJSONObject.Get('name') <> nil then
    sName := AJSONObject.GetValue('name').Value;

  if AJSONObject.Get('value') <> nil then
    fValue := StrToFloat(TJSONNumber(AJSONObject.GetValue('value')).Value);

  if AJSONObject.Get('unit') <> nil then
    sUnit := AJSONObject.GetValue('unit').Value;
end;



procedure TxVariable.Set_Name(AName: string);
begin
  sName := AName;
end;

function TxVariable.To_JSON: TJSONObject;
begin
  result := inherited To_JSON;
  Append_JSONPair_String(result, 'name', Get_Name);
end;

{ TxResult }

procedure TxResult.Set_Unit(AUnit: string);
begin
  sUnit := AUnit;
end;

procedure TxResult.Set_Value(AValue: Extended);
begin
  fValue := AValue;
end;

function TxResult.Get_Unit: string;
begin
  result := sUnit;
end;

function TxResult.Get_Value: Extended;
begin
  result := fValue;
end;

procedure TxResult.Initialze;
begin
  fValue := 0;
  sUnit := '';
  iAction := dbaNone;
end;

function TxResult.To_JSON: TJSONObject;
begin
  result := TJSONObject.Create;
  Append_JSONPair_Number(result, 'idAttribute', ID_Attribute);
  Append_JSONPair_Number(result, 'value', Get_Value);
  Append_JSONPair_String(result, 'unit', Get_Unit);
  Append_JSONPair_Number(result, 'action', Integer(iAction));
end;

end.
