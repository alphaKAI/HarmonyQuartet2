/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

export class TweetElement {
  kind:                    string;
  text:                    string;
  in_reply_to_status_id:   string;
  profile_image_url_https: string;
  id_str:                  string;
  event:                   string;
  _protected:              boolean;
  user:                    { [key: string]: string; } = {};
  source:                  { [key: string]: string; } = {};
  target:                  { [key: string]: string; } = {};
  target_object:           { [key: string]: string; } = {};
  originalJson:            JSON;
  favorited:               boolean;
  retweeted:               boolean;
  created_at:              string;

  constructor(json: JSON) {
    this.originalJson = json;

    this.user["name"]          = "";
    this.user["screen_name"]   = "";
    this.user["id_str"]        = "";
    this.source                = this.user;
    this.target                = this.user;
    this.target_object         = this.user;
    this.target_object["text"] = "";
    this.favorited             = false;
    this.retweeted             = false;

    this.created_at = this.getJsonData(json, "created_at"); 
    if ("event" in json) {
      this.kind  = "event";
      this.event = this.getJsonData(json, "event");
      
      if (this.event != "follow") {
        this.id_str = this.getJsonData(json["target_object"], "id_str");
      }

      if (json["source"] != undefined) {
        for (var key in this.source) {
          this.source[key] = key in json["source"] ? json["source"][key] : "null";
        }
      }

      if (json["target"] != undefined) {
        for (var key in this.target) {
          this.target[key] = key in json["target"] ? json["target"][key] : "null";
        }
      }

      if (json["target_object"] != undefined) {
        for (var key in this.target_object) {
          this.target_object[key] = json["target_object"][key] != undefined ? json["target_object"][key] : "null";
        }
      }

      this.profile_image_url_https = json["source"]["profile_image_url_https"];
    } else if ("direct_message" in json) {
      json        = json["direct_message"]
      this.kind   = "dm";
      this.id_str = this.getJsonData(json, "id_str");

      if (json["sender"] != undefined) {
        for (var key in this.user) {
          this.user[key] = json["sender"][key] != undefined ? json["sender"][key] : "null";
        }
      }

      this.in_reply_to_status_id = this.getJsonData(json, "id_str");
      this.text = json["text"];
      
      if (json["sender"] != undefined) {
        this._protected = json["sender"]["protected"] == "true" ? true : false;
      }
        
      this.profile_image_url_https = json["sender"]["profile_image_url_https"];
    } else if ("text" in json) {
      this.kind   = "status";
      this.id_str = this.getJsonData(json, "id_str");

      if (json["user"] != undefined) {
        for (var key in this.user) {
          this.user[key] = json["user"][key] != undefined ? json["user"][key] : "null";
        }
      }

      this.in_reply_to_status_id = this.getJsonData(json, "id_str");
      this.text = json["text"];
      
      // ��������
      this._protected = json["protected"];
        
      this.profile_image_url_https = json["user"]["profile_image_url_https"];

      this.retweeted = json["retweeted"];
      this.favorited = json["favorited"];
      
    }

    //RT, FAV and more....
  }

  getOriginalJson(): JSON {
    return this.originalJson;
  }

  getJsonData(parsedJson: any, key: string): string {
    return parsedJson[key].replace(new RegExp("\"", "g"), "");
  }
}