 unit U_MainFormulas;

interface

uses
  WinProcs,
  U_Version,
  U_Abstract,
  U_Small_Lib;


function Initialize_Dll(AArr_Parameter: array of const): TArr_VarRec;

function DoInitialize_Dll(ATxDir: string): integer;


implementation

uses
  SysUtils, Classes,
  Math,
  jvgnugettext,
  U_Log,
  U_Const,

  U_TxFormula_INI;

var
  bInitialized: boolean;
  lLog: TLog;


function Initialize_Dll(AArr_Parameter: array of const): TArr_VarRec;
begin
  try
    DoInitialize_Dll(VarRecToStr(AArr_Parameter[0]));

    SetLength(result, 4);
    Set_VarRec(result[0], C_Web_Ok);
    Set_VarRec(result[1], IntToStr(Get_Active_User_ID_Object));
    Set_VarRec(result[2], Get_Active_User_Name);
    Set_VarRec(result[3], Format('%d.%d.%d', [C_Major, C_Minor, C_Release]));
  except
    on E: Exception do
    begin
      Set_VarRec(result[0], C_Web_Null);
      Set_VarRec(result[1], E.Message);
    end;
  end;
end;

function DoInitialize_Dll(ATxDir: string): integer;
const
  CFuncName = 'DoInitializeTxFormulas';
var
  ArrInput: TArr_VarRec;
  sLogDir: string;
  sTXDir: string;
  //s: String;

begin
  sLogDir := ATxDir + 'Logs\' + DllName + '\';
  if FileExists(sLogDir + 'Log.please') then
  begin
    lLog := TLog_CSV.Create(sLogDir);
    U_Log.Add_Log(lLog, []);
  end;

  result := 0;

  sTXDir := ATxDir;

  try
    try
      // Add here the commands that must be called only once (at startup).
      lgBegin(CFuncName, [ATxDir]);

      if not bInitialized then
      begin
        Load_TxAPI(sTXDir + C_RPath_File_TxAPI_DLL);

        SetLength(ArrInput, 4);
        Set_VarRec(ArrInput[0], sTXDir);
        Set_VarRec(ArrInput[1], C_Web_Null);
        Set_VarRec(ArrInput[2], C_Web_Null);
        Set_VarRec(ArrInput[3], C_Web_Null);

        lgAdd_Comment(DllPath);

        bInitialized := true;

        lgEnd([result]);
      end;
    except
      on E: Exception do
      begin
        lgExcept(CFuncName, E);
      end;
    end;
  finally

  end;
end;



end.


