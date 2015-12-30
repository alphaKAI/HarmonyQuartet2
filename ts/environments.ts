/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

import {SocketController} from "./SocketController";
import {TLStore} from "./tlController";
import {UIController} from "./uiController";

export class Environments {
  public in_reply_to_status_id: string = null;
  public socket: SocketController      = null;
  public lastLengthFlag: boolean       = true;
  public tlStore: TLStore              = null;
  public uicontroller: UIController;
  public adminID: string = null;
  public overLayOpen     = false;
  public loading         = false;

  constructor() {}
}
