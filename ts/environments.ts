/*
  The MIT License
  Copyright (C) 2015-2016 alphaKAI
*/

import {SocketController} from "./socket/socketController";
import {TimeLineUI} from "./ui/timelineui";

export class Environments {
  public in_reply_to_status_id: string  = null;
  public socket:                SocketController;
  public timeLineUI:         TimeLineUI;
  public adminID:               string  = null;
  
  constructor() {}
}
