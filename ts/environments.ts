/// <reference path="dFiles/socketController.d.ts" />
/// <reference path="dFiles/tlController.d.ts" />
/// <reference path="dFiles/uiController.d.ts" />

/*
  The MIT License  
  Copyright (C) 2015 alphaKAI
*/

class Environments{
  public in_reply_to_status_id: string = null;
  public socket: SocketController      = null;
  public lastLengthFlag: boolean       = true;
  public tlStore: TLStore              = null;
  public uicontroller: uiController;
  public adminID:          string = null;
  public overLayOpen = false;
  public loading = false;
  constructor(){

  }
}