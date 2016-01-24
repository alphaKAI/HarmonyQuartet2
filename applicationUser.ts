/// <reference path="ts/lib/node.d.ts" />

/*
 The MIT License
 Copyright (C) 2015 alphaKAI
 */

export class ApplicationUser {
  private twitter: any;
  private twit:    any;
  private socket:  any;
  private io:      any;
  private id:      any;
  private adminID: string;
  private stopFlag: boolean = false;

  constructor(socket: any, io: any) {
    this.socket  = socket;
    this.io      = io;
    this.id      = socket.id;
    this.twitter = require("ntwitter");
  }

  public configure(consumerKeys: any): void {
    this.twit = new this.twitter(consumerKeys);
  }

  public stopUser(): void {
    this.stopFlag = true;
  }

  public userMain(): void {
    var cnt: number = 0;
    var _this = this;

    _this.twit.stream('user', function (stream) {
      if (_this.stopFlag) {
        return;
      }

      stream.on('data', function (data) {
        //console.log(data);
        if (cnt != 0) {
          console.log("Send new element");
          if (data["direct_message"] != undefined) {
            _this.emitToClient("dm", data);
          } else if (data["text"] != undefined) {
            if (data["text"].match(_this.adminID)) {
              console.log("adminID: " + _this.adminID);
              _this.emitToClient("reply", data);
            } else {
              _this.emitToClient("tweet", data);
            }
          }
        } else {
          cnt++;
        }
      });
    });

    _this.socket.on("command", function (data) {
      console.log("command request -> ", data);
      if (data["endPoint"] == "getAdminID") {
        console.log("getAdminID");
        _this.twit.get("/account/verify_credentials.json", {}, function (err, res) {
          //console.log(res);
          _this.adminID = res["screen_name"];
          _this.emitToClient("adminID", { "id": res["screen_name"] });
        });
      } else if (data["endPoint"] == "getSearchData") {
        _this.twit.get("/search/tweets.json", data["params"], function (err, res) {
          //console.log(res);
          _this.emitToClient("searchData", res);
        });
      } else if (data["endPoint"] == "getTimelines") {
        console.log("---getTimelines---");
        var requestCount = "20";

        _this.twit.get("/direct_messages.json", { "count": requestCount }, function (err, res) {
          var dmSendArray = [];
          for (var status in res) {
            dmSendArray[dmSendArray.length++] = res[status];
          }

          _this.twit.get("/direct_messages/sent.json", { "count": requestCount }, function (err, res) {
            for (var status in res) {
              dmSendArray[dmSendArray.length++] = res[status];
            }

            dmSendArray.sort(function (_a, _b) {
              var a = _this.createdAtToDate(_a),
                  b = _this.createdAtToDate(_b);

              if (a < b) {
                return -1;
              } else if (a > b) {
                return 1;
              } else {
                return 0;
              }
            });

            dmSendArray.forEach(function (status) {
              status["user"] = status["sender"];
              _this.emitToClient("dm", status);
            }, this);

            _this.emitToClient("closeCoverWithLogo", null);
          });
        });

        _this.twit.get("/statuses/mentions_timeline.json", { "count": requestCount }, function (err, res) {
          var sendArray:any[] = [];

          for (var status in res) {
            sendArray[sendArray.length++] = res[status];
          }

          sendArray.reverse();
          sendArray.forEach(status => _this.emitToClient("reply", status), this);
        });

        _this.twit.get("/statuses/home_timeline.json", { "count": requestCount }, function (err, res) {
          var sendArray:any[] = [];

          for (var status in res) {
            sendArray[sendArray.length++] = res[status];
          }

          sendArray.reverse();
          sendArray.forEach(status => _this.emitToClient("tweet", status), this);
        });
      } else if (data["endPoint"] == "getUserInfo") {
        var target = data["params"]["screen_name"];
        var returnJson = {};

        _this.twit.get("/users/show.json", { "screen_name": target }, function (err, res) {
          //console.log(res);
          returnJson["show"] = res;

          _this.twit.get("/statuses/user_timeline.json", { "screen_name": target }, function (err, res) {
            //console.log(res);
            returnJson["user_timeline"] = res;

            _this.twit.get("/friends/list.json", { "screen_name": target }, function (err, res) {
              //console.log(res);
              returnJson["friends"] = res["users"];

              _this.twit.get("/followers/list.json", { "screen_name": target }, function (err, res) {
                //console.log(res);
                returnJson["followers"] = res["users"];

                _this.twit.get("/friendships/lookup.json", { "screen_name": target }, function (err, res) {
                  //console.log(res);
                  returnJson["lookup"] = res[0]["connections"];

                  //console.log(returnJson);
                  _this.emitToClient("userInfo", returnJson);
                });
              });
            });
          });
        });
      }
    });

    _this.socket.on("POST", function (data) {
      console.log("endPoint: " + data.endPoint);
      _this.twit.post(data.endPoint, data.params, function (data) { });
    });

    _this.socket.on("GET", function (data) {
      console.log("endPoint: " + data.endPoint);
      _this.twit.get(data.endPoint, data.params, function (data) { });
    });
  }

  private emitToClient(method: string, data: any): void {
    this.io.to(this.id).json.emit(method, data);
  }

  private createdAtToDate(status: any): Date {
    var createdAt = status["created_at"].split(" ");
    var postDate = createdAt[1] + " "
      + createdAt[2] + ", "
      + createdAt[5] + " "
      + createdAt[3];

    return new Date(postDate);
  }
}