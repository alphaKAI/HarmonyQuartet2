/// <reference path="lib/jquery.d.ts" />

/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

import {Environments} from "./environments";

export class TwitterController {
  private ENV: Environments;

  constructor(env: Environments) {
    this.ENV = env;
    this.registerEventHandler();
  }

  registerEventHandler() {
    var _this = this;
    
    $("#tweetButton").on("click", function() {
      if ($("#textInputArea").val().length > 0) {

        if (_this.ENV.in_reply_to_status_id != null) {
          _this.update($("#textInputArea").val(), _this.ENV.in_reply_to_status_id);
          _this.ENV.in_reply_to_status_id = null;
        } else {
          _this.update($("#textInputArea").val());
        }
        
        $("#textInputArea").val("");
      }
    });
  }

  update(text: string, in_reply_status_id: string = null) {
    var parameters: { [key: string]: string } = {};
    parameters["status"] = text;

    if (in_reply_status_id != null) {
      parameters["in_reply_to_status_id"] = in_reply_status_id;
    }

    this.ENV.socket.send("POST", "/statuses/update.json", parameters);
  }
}
