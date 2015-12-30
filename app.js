/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var serveStatic = require('serve-static');
var confu = require("confu");

app.use(serveStatic(__dirname));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var twitter      = require("ntwitter");
var consumerKeys = confu("setting.json");
var twit         = new twitter(consumerKeys);
var clients      = [];

function newClient(newid) {
  clients.length++;
  clients[clients.length - 1] = newid;
}

function deleteClient(id){
  var newArray = [];
  
  for (var i = 0; i < clients.length; i++) {
    if (id != clients[i]) {
      newArray.length++;
      newArray[i] = clients[i];
    }
  }
  
  clients = newArray;
}

function emitToClients(method, data, toID) {
  for (var i = 0; i < clients.length; i++) {
    if (clients[i] == toID) {
      io.to(clients[i]).json.emit(method, data);
    }
  }
}

io.on('connection', function(socket) {
  console.log("New Connection");
  var session_id = socket.id;
  var cnt        = 0;
  var adminID;

  newClient(session_id);

  twit.stream('user', function(stream) {
    stream.on('data', function(data) {
      //console.log(data);
      if (cnt != 0) {
        console.log("Send new element");
        if (data["direct_message"] != undefined) {
          emitToClients("dm", data, session_id);
          //io.emit("dm", data);
        } else if (data["text"] != undefined) {
          if (data["text"].match(adminID)){
            console.log("adminID: " + adminID);
            emitToClients("reply", data, session_id);
          } else {
            emitToClients("tweet", data, session_id);
          }
          //io.emit("tweet", data);
        }
      } else {
        cnt++;
      }
    });
  });

  socket.on("command", function(data) {
    console.log("command request -> ", data);
    if (data["endPoint"] == "getAdminID") {
      console.log("getAdminID");
      twit.get("/account/verify_credentials.json", {}, function(err, res) {
        console.log(res);
        adminID = res["screen_name"];
        emitToClients("adminID", { "id":res["screen_name"] }, session_id);
      });
    } else if (data["endPoint"] == "getSearchData") {
      twit.get("/search/tweets.json", data["params"], function(err, res) {
        console.log(res);
        emitToClients("searchData", res, session_id);
      });
    } else if (data["endPoint"] == "getTimelines") {
      console.log("---getTimelines---");
      var requestCount = "20";
      twit.get("/direct_messages.json", { "count":requestCount }, function(err, res) {
        var sendArray = [];
        
        for (var status in res) {
          sendArray[sendArray.length++] = res[status];
        }
        
        sendArray.reverse();
        
        sendArray.forEach(function(status) {
            status["user"] = status["sender"];
            emitToClients("dm", status, session_id);
          }, this);
      });

      twit.get("/statuses/mentions_timeline.json", { "count":requestCount }, function(err, res) {
        var sendArray = [];
        
        for (var status in res) {
          sendArray[sendArray.length++] = res[status];
        }
        
        sendArray.reverse();
        
        sendArray.forEach(function(status) {
            emitToClients("reply", status, session_id);
          }, this);
      });

    } else if (data["endPoint"] == "getUserInfo") {
      var target = data["params"]["screen_name"];
      var returnJson = {};

      twit.get("/users/show.json", { "screen_name": target }, function(err, res) {
        console.log(res);
        returnJson["show"] = res;

        twit.get("/statuses/user_timeline.json", { "screen_name": target }, function(err, res) {
          console.log(res);
          returnJson["user_timeline"] = res;

          twit.get("/friends/list.json", { "screen_name": target }, function(err, res) {
            console.log(res);
            returnJson["friends"] = res["users"];

            twit.get("/followers/list.json", { "screen_name": target }, function(err, res) {
              console.log(res);
              returnJson["followers"] = res["users"];

              twit.get("/friendships/lookup.json", { "screen_name": target }, function(err, res) {
                console.log(res);
                returnJson["lookup"] = res[0]["connections"];

                console.log(returnJson);
                emitToClients("userInfo", returnJson, session_id);
              });
            });
          });
        });
      });

    }
  });

  socket.on("POST", function(data) {
    console.log("endPoint: " + data.endPoint);
    twit.post(data.endPoint, data.params, function(data){});
  });

  socket.on("GET", function(data) {
    console.log("endPoint: " + data.endPoint);
    twit.get(data.endPoint, data.params, function(data){});
  });

  socket.on("disconnect", function (data) {
    console.log(session_id);
    deleteClient(session_id);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
