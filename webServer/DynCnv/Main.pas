unit Main;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants,
  System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, uDWAbout, uRESTDWBase, Vcl.StdCtrls,
  uRESTDWServerEvents, Vcl.ExtCtrls;

type
  TFMain = class(TForm)
    RESTServicePooler1: TRESTServicePooler;
    btnActivate: TButton;
    Memo1: TMemo;
    EditPort: TEdit;
    Panel1: TPanel;
    procedure btnActivateClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    procedure StartStopServer(AStart: Boolean);
    { Private declarations }
  public
    { Public declarations }
    function GetVersionDate:string ;
    procedure AddLogToMemo(RequestHeader: TStringList);

  end;

var
  FMain: TFMain;

implementation

uses uDmServer, System.StrUtils, UDbClasses;

{$R *.dfm}

function TFMain.GetVersionDate:string ;
var
  verDt: TDateTime;
begin
  Result:=ifthen(FileAge(ParamStr(0), verDt), '���.' + FormatDateTime('DD.MM.YYYY', verDt), '');
end;

procedure TFMain.btnActivateClick(Sender: TObject);
begin
  if RESTServicePooler1.Active then
  begin
    btnActivate.Caption := 'open';
    StartStopServer(false);
  end
  else
  begin
    btnActivate.Caption :=  'close';
    RESTServicePooler1.ServicePort:=Strtoint(EditPort.Text);
    StartStopServer(true);
  end;

end;

procedure TFMain.FormCreate(Sender: TObject);
begin
Caption:='��������� �� �������� ���� ���.'+GetVersionDate;
  RESTServicePooler1.ServerMethodClass := TDMServer;
  StartStopServer(true);
  btnActivate.Caption := 'close';
  Memo1.Lines.Clear;
end;

procedure TFMain.StartStopServer(AStart: Boolean);
begin
  RESTServicePooler1.Active := AStart;
end;

procedure TFMain.AddLogToMemo(RequestHeader: TStringList);
begin
  FMain.Memo1.Lines.Add(FormatDateTime('dd.mm.yyyy hh:nn:ss', Now) + '-----Begin Request-----------');
  FMain.Memo1.Lines.Add(RequestHeader.Text);
end;

end.
