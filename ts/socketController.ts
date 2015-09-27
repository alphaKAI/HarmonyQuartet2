/// <reference path="dFiles/environments.d.ts" />
/// <reference path="lib/node.d.ts" />
/// <reference path="lib/socket.io.d.ts" />

/*
  The MIT License  
  Copyright (C) 2015 alphaKAI
*/

class SocketController{
  private ENV: Environments;
  private socket: io;

  constructor(env: Environments){
    this.ENV = env;
    this.socket = io();
    var _this = this;

    this.send("command", "getAdminID");

    this.socket.on('adminID', function(msg){
      _this.ENV.adminID = msg["id"];
    });

    this.socket.on('tweet', function(msg) {
      _this.ENV.tlStore.insertElement("home", new TweetElement(msg));
    });

    this.socket.on('reply', function(msg) { 
      _this.ENV.tlStore.insertElement("home", new TweetElement(msg));
      _this.ENV.tlStore.insertElement("reply", new TweetElement(msg));
    });

    this.socket.on('dm', function(msg) {
      _this.ENV.tlStore.insertElement("dm", new TweetElement(msg));
    });

    this.socket.on('userInfo', function(msg){
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

}