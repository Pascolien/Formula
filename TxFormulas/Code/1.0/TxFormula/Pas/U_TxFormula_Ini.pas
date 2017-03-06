///<author>dev@bassetti.fr</author>
///<summary>This unit allows to read and write the file "TxFormula.ini". It also allows to access to the variables and check their relevancy. This unit is fully generated from the inifile. Do not modify!</summary>
Unit U_TxFormula_INI;

interface

uses
  Inifiles, Classes, sysUtils,
  U_Abstract;

Type
  TxFormula_IniFile= Class(TIniFile)
    Constructor Create(aPathFileName: String);
    function Get_Variables : TStringList;
    function Get_sValue(aSection: string; AName: string): string;
    function Get_iValue(aSection: string; AName: string): integer;
    function Get_Section_Values(Asection_Name: string) : TStringList;
  private

End;

const
  C_Section_TxFormula='TxFormula';
  C_Section_TxVariable='Variables';
  C_Section_Formula='Formula';
  C_Section_Result='Result';

  C_Name_ID_AS_Formula='ID_AS_Formula';
  C_Name_ID_Att_Lnk_Formula='ID_Att_Lnk_Formula';
  C_Name_ID_Att_sIniFile='ID_Att_Ini_File';
  C_Name_ID_Att_Formula='ID_Att_sFormula';
  C_Name_ID_Att_fResult='ID_Att_fResult';
var
  inifile: TxFormula_IniFile;

implementation
{ TxFormula_IniFile }

COnstructor TxFormula_IniFile.Create(aPathFileName: String);
begin
   inherited Create(Get_Dir_CR_Models+'TxFormulas\'+ aPathFileName);
end;

function TxFormula_IniFile.Get_iValue(aSection: string; AName: string): integer;
begin
  result := ReadInteger(aSection, AName, -1);
end;

function TxFormula_IniFile.Get_Section_Values(Asection_Name: string): TStringList;
var
  SLNames_Values: TStringList;
  i: Integer;
begin
  result := TStringlist.Create;
  SLNames_Values := TStringList.Create;
  try
    ReadSectionValues(Asection_Name, SLNames_Values);

    for i := 0 to SLNames_Values.Count - 1 do
      result.Add(SLNames_Values.ValueFromIndex[i]);
  finally
    FreeAndNil(SLNames_Values);
  end;
end;

function TxFormula_IniFile.Get_sValue(aSection: string; AName: string): string;
begin
  result := ReadString(aSection, ANAme, '');
end;

function TxFormula_IniFile.Get_Variables: TStringList;
begin
  result := Get_Section_Values(C_Section_TxVariable);
end;

end.
