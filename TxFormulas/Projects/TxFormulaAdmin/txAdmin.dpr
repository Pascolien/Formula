program txAdmin;

uses
  Vcl.Forms,
  TxFormulas_Admin in 'pas\TxFormulas_Admin.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm3, Form3);
  Application.Run;
end.
