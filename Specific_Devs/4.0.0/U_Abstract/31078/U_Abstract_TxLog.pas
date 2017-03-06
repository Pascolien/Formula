///<author>dev@bassetti.fr</author>
///<summary>Unit loading / unloading the dll named "TxLog". This file is generated by TXUtils. Do not modify.</summary>
unit U_Abstract_TxLog;
interface

uses
  SysUtils,Windows,Contnrs,Classes,U_Small_Lib, U_Class, U_Abstract;

type
  {$REGION 'U_TxLog'}
  TIsTxLogActive=function(AArrParameter: array of TVarRec): TArr_VarRec; stdcall;

  TResetLog=function(AArrParameter: array of TVarRec): TArr_VarRec; stdcall;

  TCaptureLog=function(AArrParameter: array of TVarRec): TArr_VarRec; stdcall;
  {$ENDREGION}

  {$REGION 'U_TxLogManager'}
  TTxLogManager=class(TObject)
  public
    function IsActive: Boolean; virtual; stdcall; abstract;
    procedure Reset; virtual; stdcall; abstract;
    function Capture(const AUsecase: string; const AZip: Boolean): string; virtual; stdcall; abstract;
  end;

  T_TxLog=function: TTxLogManager; stdcall;
  {$ENDREGION}



var
  {$REGION 'U_TxLog'}
  IsTxLogActive: TIsTxLogActive;
  ResetLog: TResetLog;
  CaptureLog: TCaptureLog;
  {$ENDREGION}

  {$REGION 'U_TxLogManager'}
  _TxLog: T_TxLog;
  {$ENDREGION}


///<summary>Procedure loading the dll named "TxLog".</summary>
///<param name="AFilePath">The absolute path to the dll.</param>
procedure Load_TxLog(AFilePath: string);

///<summary>Procedure unloading the dll named "TxLog".</summary>
procedure Unload_TxLog;

///<summary>Function returning true if the dll "TxLog" was loaded.</summary>
function Get_Dll_TxLog_Loaded: boolean;

implementation

var
  hDll: THandle;

procedure Load_TxLog(AFilePath: string);
resourcestring
  RS_Error_Invalide_File='Le fichier %s n''est pas valide.';
begin
  if hDll <> 0 then
    exit;

  Check_FileExists(AFilePath);

  hDll := Load_Dll(AFilePath);

  {$REGION 'U_TxLog'}
  @IsTxLogActive := Get_Dll_Function_Adress(hDll,'IsTxLogActive',AFilePath);
  @ResetLog := Get_Dll_Function_Adress(hDll,'ResetLog',AFilePath);
  @CaptureLog := Get_Dll_Function_Adress(hDll,'CaptureLog',AFilePath);
  {$ENDREGION}

  {$REGION 'U_TxLogManager'}
  @_TxLog := Get_Dll_Function_Adress(hDll,'_TxLog',AFilePath);
  {$ENDREGION}


end;

procedure Unload_TxLog;
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

function Get_Dll_TxLog_Loaded: boolean;
begin
  result := (hDll>0)
end;

initialization
  hDll := 0;

finalization
  Unload_TxLog;

end.