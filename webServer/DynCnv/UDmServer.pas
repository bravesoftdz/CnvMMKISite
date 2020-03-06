unit UDmServer;

interface

uses
  System.SysUtils, System.Classes, uDWDatamodule, uDWAbout, uRESTDWServerEvents,
  uDWJSONObject, uDWConsts, System.JSON;

type
  TDMServer = class(TServerMethodDataModule)
    api: TDWServerEvents;
    procedure apiEventsverReplyEventByType(var Params: TDWParams;
      var Result: string; const RequestType: TRequestType;
      var StatusCode: Integer; RequestHeader: TStringList);
    procedure apiEventsdyncnvReplyEventByType(var Params: TDWParams;
      var Result: string; const RequestType: TRequestType;
      var StatusCode: Integer; RequestHeader: TStringList);
    procedure apiEventsdynmnlzReplyEventByType(var Params: TDWParams;
      var Result: string; const RequestType: TRequestType;
      var StatusCode: Integer; RequestHeader: TStringList);
    procedure apiEventshimReplyEventByType(var Params: TDWParams;
      var Result: string; const RequestType: TRequestType;
      var StatusCode: Integer; RequestHeader: TStringList);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  DMServer: TDMServer;

implementation

{%CLASSGROUP 'Vcl.Controls.TControl'}

uses Main, UDbClasses;

{$R *.dfm}

procedure TDMServer.apiEventsdyncnvReplyEventByType(var Params: TDWParams;
  var Result: string; const RequestType: TRequestType; var StatusCode: Integer;
  RequestHeader: TStringList);
begin
  inherited;
  FMain.AddLogToMemo(RequestHeader);
  Result := DM.JsonCnv.GetData.ToString;
end;

procedure TDMServer.apiEventsdynmnlzReplyEventByType(var Params: TDWParams;
  var Result: string; const RequestType: TRequestType; var StatusCode: Integer;
  RequestHeader: TStringList);
begin
  inherited;
  FMain.AddLogToMemo(RequestHeader);
  Result := DM.JsonMnlz.GetData.ToString;
end;

procedure TDMServer.apiEventshimReplyEventByType(var Params: TDWParams;
  var Result: string; const RequestType: TRequestType; var StatusCode: Integer;
  RequestHeader: TStringList);
var
  tp: string;
begin
  inherited;
  FMain.AddLogToMemo(RequestHeader);
  Dm.qHim.ParamByName('days').AsString:=  Params.ItemsString['days'].AsString;
  Dm.qHim.ParamByName('rowstart').AsString:=  Params.ItemsString['rowstart'].AsString;
  Dm.qHim.ParamByName('rowend').AsString:=  Params.ItemsString['rowend'].AsString;
  tp:= Params.ItemsString['type'].AsString.ToLower;
  if tp='all' then
  Dm.qHim.SQL[5]:='' else
  Dm.qHim.SQL[5]:='and lower(tipproby)='''+tp+'''';

  Result := DM.JsonHim.GetData.ToString;
end;

procedure TDMServer.apiEventsverReplyEventByType(var Params: TDWParams;
  var Result: string; const RequestType: TRequestType; var StatusCode: Integer;
  RequestHeader: TStringList);
begin
  inherited;
  FMain.AddLogToMemo(RequestHeader);
  Result := '{"������": "' + FMain.GetVersionDate + '"}';
end;

end.
