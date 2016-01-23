/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

import {SocketController} from "./SocketController";
import {TLStore} from "./tlController";
import {UIController} from "./uiController";
import {Dialog} from "./dialog";

export class Environments {
  public in_reply_to_status_id: string  = null;
  public socket:                SocketController;
  public lastLengthFlag:        boolean = true;
  public tlStore:               TLStore;
  public uicontroller:          UIController;
  public dialog:                Dialog;
  public adminID:               string  = null;
  public overLayOpen:           boolean = false;
  public loading:               boolean = false;

  constructor() {}
}
