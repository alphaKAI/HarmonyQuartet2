/// <reference path="ts/lib/node.d.ts" />

/*
 The MIT License
 Copyright (C) 2015-2016 alphaKAI
 */
import {ApplicationUser} from "./applicationUser";

class ApplicationServer {
  private app:         any;
  private http:        any;
  private io:          any;
  private fs:          any;
  private serveStatic: any;
  private confu:       any;
  private session:     any;
  private settingFile: string = "setting.json";
  private passport:    any;
  private cookieParser:any;

  constructor() {
    this.app   = require("express")();
    this.session = require('express-session'); // 追加
    this.http  = require("http").Server(this.app);
    this.io    = require("socket.io")(this.http);
    this.fs    = require("fs");
    this.cookieParser = require('cookie-parser');
    this.serveStatic = require("serve-static");
    this.confu = require("confu");
    this.passport = require('passport');

    if (!this.checkExist(this.settingFile)) {
      throw new Error("Dose not exist setting.json.");
    } else if(!this.consumerKeyDefined()) {
      throw new Error("Did not define consumerKey or consumerSecret");
    }

    this.serverConfigure();

    this.http.listen(3000, function() {
      console.log("listening on *:3000");
    });
  }

  private serverConfigure(): void {
    this.routingConfigure();
    this.passportConfigure();
  }

  private routingConfigure(){
    var _this = this;

    this.app.use(this.cookieParser());
    this.app.use(this.session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 1000
      }
    }));

    this.app.use(this.serveStatic(__dirname));
    this.app.get("/", function (req, res) {
      if (_this.accessTokenKeyDefined()) {
        res.sendFile(__dirname + "/main.html");
        _this.serverMain();
      } else {
        res.redirect("/login");
      }
    });

    this.app.get("/login", function (req, res) {
      res.sendFile(__dirname + "/login.html");
    });
  }

  private passportConfigure(){
    var _this = this;
    var consumerKeys = this.confu(this.settingFile);
    var passportConfig = {
      twitter: {
        consumerKey: consumerKeys.consumer_key,
        consumerSecret: consumerKeys.consumer_secret,
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      }
    };
    var TwitterStrategy = require('passport-twitter').Strategy;

    this.passport.serializeUser(function(user, done) {
      return done(null, user);
    });

    this.passport.deserializeUser(function(obj, done) {
      return done(null, obj);
    });

    this.passport.use(new TwitterStrategy(passportConfig.twitter, function(token, tokenSecret, profile, done) {
      var str = '{'
        + '"consumer_key":' + '"' + consumerKeys.consumer_key + '",'
        + '"consumer_secret":' + '"' + consumerKeys.consumer_secret + '",'
        + '"access_token_key":' + '"' + token + '",'
        + '"access_token_secret":' + '"' + tokenSecret + '"}';
      _this.fs.writeFileSync(_this.settingFile, str);
      return process.nextTick(function() {
        return done(null, profile);
      });
    }));

    this.app.use(this.passport.initialize());
    this.app.use(this.passport.session());

    this.app.get('/auth/twitter', this.passport.authenticate('twitter'));
    this.app.get('/auth/twitter/callback', this.passport.authenticate('twitter', {
      successRedirect: '/success',
      failureRedirect: '/failure'
    }));

    this.app.get("/success", function(req, res) {
      res.redirect("/");
    });

    this.app.get("/failure", function (req, res) {
      res.redirect("/login");
    });
  }

  private consumerKeyDefined(): boolean {
    var tmp = this.confu(this.settingFile);
    if (tmp.consumer_key == undefined || tmp.consumer_secret == undefined) {
      return false;
    }
    return true;
  }

  private accessTokenKeyDefined(): boolean {
    var tmp = this.confu(this.settingFile);
    if (tmp.access_token_key == undefined || tmp.access_token_secret == undefined) {
      return false;
    }
    return true;
  }

  private checkExist(filePath: string): boolean{
    try {
      this.fs.statSync(filePath);
    } catch(err) {
      if(err.code == "ENOENT") {
        return false;
      }
    }

    return true;
  }

  private serverMain(): void {
    var users: any = {};
    var _this = this;

    this.io.on("connection", function (socket) {
      var user: ApplicationUser = new ApplicationUser(socket, _this.io);
      users[String(socket.id)] = user;

      socket.on("dissconnect", function() {
        users[String(socket.id)].stopUser();
        users[String(socket.id)] = null;
      });

      var consumerKeys = _this.confu(_this.settingFile);

      user.configure(consumerKeys);
      user.userMain();
    });
  }
}

var appServer: ApplicationServer = new ApplicationServer();
