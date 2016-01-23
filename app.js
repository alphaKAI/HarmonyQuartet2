/// <reference path="ts/lib/node.d.ts" />
/*
 The MIT License
 Copyright (C) 2015 alphaKAI
 */
var ApplicationUser = (function () {
    function ApplicationUser(socket, io) {
        this.stopFlag = false;
        this.socket = socket;
        this.io = io;
        this.id = socket.id;
        this.twitter = require("ntwitter");
    }
    ApplicationUser.prototype.configure = function (consumerKeys) {
        this.twit = new this.twitter(consumerKeys);
    };
    ApplicationUser.prototype.OAuth = function () {
        var returnKeys = {};
        //FIXME: IMPLEMENT OAuth based authorization
        return returnKeys;
    };
    ApplicationUser.prototype.stopUser = function () {
        this.stopFlag = true;
    };
    ApplicationUser.prototype.userMain = function () {
        var cnt = 0;
        var _this = this;
        this.twit.stream('user', function (stream) {
            if (_this.stopFlag) {
                return;
            }
            stream.on('data', function (data) {
                //console.log(data);
                if (cnt != 0) {
                    console.log("Send new element");
                    if (data["direct_message"] != undefined) {
                        _this.emitToClient("dm", data);
                    }
                    else if (data["text"] != undefined) {
                        if (data["text"].match(_this.adminID)) {
                            console.log("adminID: " + _this.adminID);
                            _this.emitToClient("reply", data);
                        }
                        else {
                            _this.emitToClient("tweet", data);
                        }
                    }
                }
                else {
                    cnt++;
                }
            });
        });
        this.socket.on("command", function (data) {
            console.log("command request -> ", data);
            if (data["endPoint"] == "getAdminID") {
                console.log("getAdminID");
                _this.twit.get("/account/verify_credentials.json", {}, function (err, res) {
                    //console.log(res);
                    _this.adminID = res["screen_name"];
                    _this.emitToClient("adminID", { "id": res["screen_name"] });
                });
            }
            else if (data["endPoint"] == "getSearchData") {
                _this.twit.get("/search/tweets.json", data["params"], function (err, res) {
                    //console.log(res);
                    _this.emitToClient("searchData", res);
                });
            }
            else if (data["endPoint"] == "getTimelines") {
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
                            var a = _this.createdAtToDate(_a), b = _this.createdAtToDate(_b);
                            if (a < b) {
                                return -1;
                            }
                            else if (a > b) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        });
                        dmSendArray.forEach(function (status) {
                            status["user"] = status["sender"];
                            _this.emitToClient("dm", status);
                        }, this);
                    });
                });
                _this.twit.get("/statuses/mentions_timeline.json", { "count": requestCount }, function (err, res) {
                    var sendArray = [];
                    for (var status in res) {
                        sendArray[sendArray.length++] = res[status];
                    }
                    sendArray.reverse();
                    sendArray.forEach(function (status) {
                        _this.emitToClient("reply", status);
                    }, this);
                });
            }
            else if (data["endPoint"] == "getUserInfo") {
                var target = data["params"]["screen_name"];
                var returnJson = {};
                this.twit.get("/users/show.json", { "screen_name": target }, function (err, res) {
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
        this.socket.on("POST", function (data) {
            console.log("endPoint: " + data.endPoint);
            _this.twit.post(data.endPoint, data.params, function (data) { });
        });
        this.socket.on("GET", function (data) {
            console.log("endPoint: " + data.endPoint);
            _this.twit.get(data.endPoint, data.params, function (data) { });
        });
    };
    ApplicationUser.prototype.emitToClient = function (method, data) {
        this.io.to(this.id).json.emit(method, data);
    };
    ApplicationUser.prototype.createdAtToDate = function (status) {
        var createdAt = status["created_at"].split(" ");
        var postDate = createdAt[1] + " "
            + createdAt[2] + ", "
            + createdAt[5] + " "
            + createdAt[3];
        return new Date(postDate);
    };
    return ApplicationUser;
})();
var ApplicationServer = (function () {
    function ApplicationServer() {
        this.settingFile = "setting.json";
        this.app = require("express")();
        this.http = require("http").Server(this.app);
        this.io = require("socket.io")(this.http);
        this.fs = require("fs");
        this.serveStatic = require("serve-static");
        this.confu = require("confu");
        this.serverConfigure();
        this.serverMain();
    }
    ApplicationServer.prototype.serverConfigure = function () {
        this.app.use(this.serveStatic(__dirname));
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    };
    ApplicationServer.prototype.checkExist = function (filePath) {
        try {
            this.fs.statSync(filePath);
        }
        catch (err) {
            if (err.code == 'ENOENT') {
                return false;
            }
        }
        return true;
    };
    ApplicationServer.prototype.serverMain = function () {
        var users = {};
        var _this = this;
        this.io.on('connection', function (socket) {
            var user = new ApplicationUser(socket, _this.io);
            users[String(socket.id)] = user;
            socket.on("dissconnect", function () {
                users[String(socket.id)].stopUser();
                users[String(socket.id)] = null;
            });
            var consumerKeys = {};
            if (_this.checkExist(_this.settingFile)) {
                consumerKeys = _this.confu("setting.json");
            }
            else {
                consumerKeys = user.OAuth();
            }
            user.configure(consumerKeys);
            user.userMain();
        });
        this.http.listen(3000, function () {
            console.log("listening on *:3000");
        });
    };
    return ApplicationServer;
})();
var appServer = new ApplicationServer();
