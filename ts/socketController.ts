/// <reference path="lib/socket.io.d.ts" />

/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

import {Environments} from "./environments";
import {TweetElement} from "./tweetElement";

export class SocketController{
  private ENV: Environments;
  private socket: any;

  constructor(env: Environments){
    this.ENV = env;
    this.socket = io();
    var _this = this;

    this.send("command", "getAdminID");
    this.send("command", "getTimelines");

    this.socket.on('adminID', function(msg:any){
      _this.ENV.adminID = msg["id"];
    });

    this.socket.on('tweet', function(msg:any){
      _this.ENV.tlStore.insertElement("home", new TweetElement(msg));
    });

    this.socket.on('reply', function(msg:any){
      _this.ENV.tlStore.insertElement("home", new TweetElement(msg));
      _this.ENV.tlStore.insertElement("reply", new TweetElement(msg));
    });

    this.socket.on('dm', function(msg:any){
      _this.ENV.tlStore.insertElement("dm", new TweetElement(msg));
    });

    this.socket.on('searchData', function(msg:any){
      _this.ENV.uicontroller.showSearchResult(msg);
    });

    this.socket.on('userInfo', function(msg:any){
      if (_this.ENV.loading) {
        _this.ENV.uicontroller.stopLoading();
      }
      _this.ENV.uicontroller.showUserPage(msg);
    });
  }

  send(method: string, endPoint: string, params: {[key: string]: string} = {}){
    this.socket.emit(method, {"endPoint" : endPoint,
                              "params" : params});
  }

  getUserData(screen_name: string) {
    this.ENV.socket.send("command", "getUserInfo", { "screen_name": screen_name });
  }

  getSearchData(query: string, otherOptions: {[key: string]: string} = {}){
    if (otherOptions == {})
      this.ENV.socket.send("command", "getSearchData", { "q": query });
    else {
      otherOptions["q"] = query;
      this.ENV.socket.send("command", "getSearchData", otherOptions)
    }
  }
}
