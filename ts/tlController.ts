/// <reference path="lib/jquery.d.ts" />

/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

import {Environments} from "./environments";
import {TweetElement} from "./tweetElement";

export class TL {
  private tlLength:   number;
  private selected:   number;
  private selectable: boolean = false;
  private tlName:     string;
  private waitFlag:   boolean;
  public  tweets:     { [key: number]: TweetElement } = {};
  private ENV:        Environments;

  constructor(arg: string, env: Environments) {
    this.ENV    = env;
    this.tlName = arg;
    this.updateLength();
  }

  updateLength(): void {
    this.tlLength = $("#" + this.tlName + " .tweetElement").length;
  }

  clickActionButton(jqThis: JQuery): void {
    this.waitFlag = true;
    jqThis.toggleClass("active");
  }

  toggleSelect(n: number): void {
    if (n != this.selected) {
      $("#" + this.tlName + "_" + String(this.selected)).removeClass("selected");
      $("#" + this.tlName + "_" + String(n)).addClass("selected");

      this.selected   = n;
      this.selectable = true;
      
      this.ENV.focus = this.tlName + "_" + String(this.selected); 
    } else if (n == this.selected) {
      this.clearSelects();
      this.selectable = false;
    }
  }

  clearSelects(): void {
    $("#" + this.tlName + "_" + String(this.selected)).removeClass("selected");
    this.selectable = false;
    this.selected   = null;
    this.ENV.in_reply_to_status_id = null;
  }

  clickReaction(jqThis: JQuery): void {
    if (!this.waitFlag) {
      this.selectable = true;
      this.toggleSelect(parseInt(jqThis.attr("id").split("_")[1]));
    } else {
      this.waitFlag = false;
    }
  }

  keyDownReaction(keyCode: number): void {
    if (this.selectable && this.ENV.focus.split("_")[0] == this.tlName) {
      switch (keyCode) {
        case 38://Up key
          if (this.selected != this.tlLength - 1) {
            this.toggleSelect(this.selected + 1);
          }
          break;
        case 40://Down key
          if (this.selected != 0) {
            this.toggleSelect(this.selected - 1);
          }
          break;
        case 13://Enter key
          this.ENV.in_reply_to_status_id = this.tweets[this.selected].id_str;
          this.setIDAndFocusTextArea();
        case 27://Escape key
          //close overlay display if overlay display is being opened
          if (this.ENV.overLayOpen) {
            this.ENV.dialog.closeDialog();
          } else if (this.selectable) {
            this.clearSelects();
          }
          break;
      }
    }
  }

  setIDAndFocusTextArea(id: any = null): void {
    $("#textInputArea").focus();

    if (id == null) {
      $("#textInputArea").val((this.tlName == "dm" ? "D " : "") + "@" + this.tweets[Number(this.selected)].user["screen_name"] + " ");
    } else {
      $("#textInputArea").val((this.tlName == "dm" ? "D " : "") + "@" + this.tweets[Number(id)].user["screen_name"] + " ");
    }
  }

  priparseTwitterDate(created: string): string{
    var created_at = created.split(" ");
    var post_date  = created_at[1] + " "
                   + created_at[2] + ", "
                   + created_at[5] + " "
                   + created_at[3];

    var date = new Date(post_date);
    date.setHours(date.getHours() + 9);
    var year = date.getFullYear();
    var mon  = date.getMonth() + 1;
    var day  = date.getDate();
    var hour = date.getHours();
    var min  = date.getMinutes();
    
    return [year, mon, day].join("/") + " " + [hour, min].join(":");
  }
   
  insertElement(element: TweetElement): void {
    element.text = element.text.replace("\n", "<br>");
    element.text = element.text.replace(/(https?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>");
    element.text = element.text.replace(/(@\w+)/gi, "<span class='userPageOpenToggle' data-user_screen_name='$1' onclick=javascript:openUserPage('$1')>$1</span>");

    var dateObj = new Date;
    var divElement = '<div class="item tweetElement" id= "' + this.tlName + "_" + String(this.tlLength) + '" data-tlName="' + this.tlName + '">'
                   +  '<div class="content">'
                   +    '<div class="header userName userInfo" data-tlName="' + this.tlName + '" data-id="' + String(this.tlLength) + '" >'
                   +      '<img src="' + element.profile_image_url_https + '" alt="icon" class="ui avatar image">'
                   +        element.user["name"] + "(@" + element.user["screen_name"] + ")"
                   +    '</div>'
                   +    element.text
                   +  '</div>'
                   +  '<div class="twitterDate">'
                   +  this.parseTwitterDate(element.created_at)
                   +  '</div>'
                   +  '<div class="twitterToggles" >';
   
    if (this.tlName != "dm") {
      // FIXME: Filter of protected account is not working. 
      if (this.ENV.adminID != element.user["screen_name"] && element._protected != true) {
        divElement += '<button class="ui inverted red icon button actionButton actionRetweet ';
        if (element.retweeted == true) {
          divElement += "active";
        }
        divElement += '" data-tlName="' + this.tlName + '" data-id="' + String(this.tlLength) + '" data-tlName="' + this.tlName + '"> <i class="icon retweet" > </i></button>';
      }
      divElement += '<button class="ui inverted orange icon button actionButton actionFavorite ';
      
      if (element.favorited == true) {
        divElement += "active";
      }
      divElement += '" data-tlName="' + this.tlName + '" data-id="' + String(this.tlLength) + '" data-tlName="' + this.tlName + '"> <i class="icon star"    > </i></button>';
    }
    divElement += '<button class="ui inverted blue icon button actionButton actionReply" data-tlName="' + this.tlName + '" data-id="' + String(this.tlLength) + '" data-tlName="' + this.tlName + '"> <i class="icon reply"   > </i></button>';
    if (this.ENV.adminID == element.user["screen_name"]) {
      divElement += '<button class="ui inverted green icon button actionButton actionDestroy" data-tlName="' + this.tlName + '" data-id="' + String(this.tlLength) + '" data-tlName="' + this.tlName + '"> <i class="icon trash" > </i></button>';
    }
    divElement += '</div>'
                + '</div>';

    this.tweets[this.tlLength] = element;

    var scrollPosition = $("#" + this.tlName + " .timeline").scrollTop();

    $("#" + this.tlName + " .timeline").prepend(divElement);

    /*
      TLをスクロールしていた場合に、表示位置を固定する
      If TL is scrolled that fix y-coordinate.
    */
    if (scrollPosition != 0) {
      var x = document.getElementById(this.tlName + "_" + String(this.tlLength)).clientHeight;
      var margin = 2;
      $("#" + this.tlName + " .timeline").scrollTop(scrollPosition + x + margin * 2 - 4 + 3);
    } else {
      $("#" + this.tlName + " .timeline").scrollTop(0);
    }

    this.updateLength();
  }

  deleteElement(id: number): void {
    $("#" + this.tlName + "_" + String(id)).css("display", "none");
  }

  deleteAllElement(): void {
    for (var i = 0; i < this.tlLength; i++) {
      this.deleteElement(i);
    }
  }
  
  twitterToggleClick(method: string, id: string): void {
    if (method == "Retweet") {
      if (this.tweets[Number(id)].retweeted == false) {
        this.ENV.socket.send("POST", "/statuses/retweet/" + this.tweets[Number(id)].id_str + ".json", { "id": this.tweets[Number(id)].id_str });
        this.tweets[Number(id)].retweeted = true;
      } else if (this.tweets[Number(id)].retweeted == true) {
        this.ENV.socket.send("POST", "/statuses/destroy/" + this.tweets[Number(id)].id_str + ".json", { "id": this.tweets[Number(id)].id_str });
        this.deleteElement(Number(id));
        this.tweets[Number(id)].retweeted = false;
      }
    } else if (method == "Favorite") {
      if (this.tweets[Number(id)].favorited == false) {
        this.ENV.socket.send("POST", "/favorites/create.json", { "id": this.tweets[Number(id)].id_str });
        this.tweets[Number(id)].favorited = true;
      } else if (this.tweets[Number(id)].favorited == true) {
        this.ENV.socket.send("POST", "/favorites/destroy.json", { "id": this.tweets[Number(id)].id_str });
        this.tweets[Number(id)].favorited = false;
      }
    } else if (method == "Reply") {
      this.setIDAndFocusTextArea(Number(id));
      this.ENV.in_reply_to_status_id = this.tweets[Number(id)].in_reply_to_status_id;
    } else if (method == "Destroy") {
      if (this.tlName != "dm") {
        this.ENV.socket.send("POST", "/statuses/destroy/" + this.tweets[Number(id)].id_str + ".json", { "id": this.tweets[Number(id)].id_str });
      } else if (this.tlName == "dm") {
        this.ENV.socket.send("POST", "/direct_messages/destroy.json", { "id": this.tweets[Number(id)].id_str });
      }

      this.deleteElement(Number(id));
    }
  }
}

export class TLStore {
  private tls:       { [key: string]: TL };
  private currentTL: string = "home";
  private ENV:       Environments;

  constructor(env: Environments) {
    this.ENV = env;
    this.tls = {};

    this.registerEventHandler();
  }

  registerEventHandler(): void {
    var _this = this;

    $(document).on("keydown", function (event: JQueryEventObject) {
      _this.tls[_this.currentTL].keyDownReaction(event.keyCode);
    });

    $(document).on("click", "div.item", function (event: JQueryEventObject) {
      _this.currentTL = $(this).attr("data-tlName");
      _this.tls[_this.currentTL].clickReaction($(this));
    });

    $(document).on("click", ".actionButton", function (event: JQueryEventObject) {
      _this.currentTL = $(this).attr("data-tlName");
      _this.tls[_this.currentTL].clickActionButton($(this));
    });
  }

  add(tlName: string): void {
    this.tls[tlName] = new TL(tlName, this.ENV);
  }

  deleteAllElement(tlName: string): void {
    this.tls[tlName].deleteAllElement();
  }

  insertElement(tlName: string, element: TweetElement): void {
    this.tls[tlName].insertElement(element);
  }

  twitterToggleClick(method: string, tlName: string, id: string): void {
    this.tls[tlName].twitterToggleClick(method, id);
  }

  setIDAndFocusTextArea(tlName: string, id: any = null): void {
    if (id == null) {
      this.tls[tlName].setIDAndFocusTextArea();
    } else {
      this.tls[tlName].setIDAndFocusTextArea(id);
    }
  }

  clickUserIcon(tlName: string, id: string): void {
    this.ENV.socket.getUserData(this.tls[tlName].tweets[Number(id)].user["screen_name"]);
  }

  getTlsName(): string[] {
    var keys: string[] = [];
    for (var key in this.tls) {
      keys[keys.length++] = key;
    }

    return keys;
  }
}
