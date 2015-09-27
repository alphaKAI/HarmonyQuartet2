/// <reference path="lib/jquery.d.ts" />
/// <reference path="dFiles/environments.d.ts" />
/// <reference path="dFiles/TweetElement.d.ts" />

/*
  The MIT License  
  Copyright (C) 2015 alphaKAI
*/

class TL{
  private tlLength: number;
  private selected: number;
  private selectable: boolean;
  private tlName: string;
  private waitFlag: boolean;
  public tweets: { [key: number]: TweetElement; } = {};
  private ENV: Environments;

  constructor(arg: string, env: Environments) {
    this.ENV = env;

    this.tlName = arg;
    this.updatetlLength();
  }

  updatetlLength(){
    this.tlLength = $("#" + this.tlName + " .tweetElement").length;
  }

  clickActionButton(jqThis: JQuery){
    this.waitFlag = true;
    jqThis.toggleClass("active");
  }

  toggleSelect(n: number){
    if(n != this.selected){
      $("#" + this.tlName + String(this.selected)).removeClass("selected");
      $("#" + this.tlName + String(n)).addClass("selected");
      this.selected = n;
    } else if(n == this.selected){
      this.clearSelects();
    }
  }

  clearSelects(){
    $("#" + this.tlName + String(this.selected)).removeClass("selected");
    this.selectable = false;
    this.selected = null;
    this.ENV.in_reply_to_status_id = null;
  }

  clickReaction(jqThis: JQuery){
    if(!this.waitFlag){
      this.selectable = true;
      this.toggleSelect(parseInt(jqThis.attr("id").split(this.tlName)[1]));
    } else {
      this.waitFlag = false;
    }
  }

  keyDownReaction(keyCode: number){
    if(this.selectable){
      switch(keyCode){
        case 38://Up key
          if (this.selected != this.tlLength - 1) {
            this.toggleSelect(this.selected + 1);
          }
        break;
        case 40://Down key
          if (this.selected != 0) {
            this.toggleSelect(this.selected - 1);
          }
        case 13://Enter key
          this.ENV.in_reply_to_status_id = this.tweets[this.selected].id_str;
          this.setIDAndFocusTextArea();
        break;
        case 27://Escape key
          //close overlay display if overlay display is being opened
          if (this.ENV.overLayOpen) {
            /* 要修正: ロード中にエスケープを押すと、オーバーレイ画面でエスケープを押してもオーバーレイが解除できなくなる */
            alert(this.ENV.loading);//debug
            this.ENV.uicontroller.hideOverlay();
            
          } else if(this.selectable) {
            this.clearSelects();
          }
      }
    }
  }

  setIDAndFocusTextArea(id = null){
    $("#textInputArea").focus();
    if(id == null)
      $("#textInputArea").val((this.tlName == "dm" ? "D " : "") + "@" + this.tweets[Number(this.selected)].user["screen_name"] + " ");
    else
      $("#textInputArea").val((this.tlName == "dm" ? "D " : "") + "@" + this.tweets[Number(id)].user["screen_name"] + " ");
  }

  insertElement(element: TweetElement){
    element.text = element.text.replace("\n", "<br>");
    element.text = element.text.replace(/(https?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>");

    var divElement =  '<div class="item tweetElement" id= "' + this.tlName + String(this.tlLength) + '" >'
                    +   '<div class="content">'
                    +     '<div class="header userName" onclick=\'javascript:clickUserIcon("' + this.tlName + '", "' + String(this.tlLength) + '")\'>'
                    +       '<img src="' + element.profile_image_url_https + '" alt="icon" class="ui avatar image">'
                    +       element.user["name"] + "(@" + element.user["screen_name"] + ")"
                    +     '</div>'
                    +     element.text
                    +   '</div>'
                    +   '<div class="twitterToggles" >'
                    +     '<button class="ui inverted red    icon button actionButton" onClick=\'javascript:clickRetweet("'  + this.tlName  + '", "' + String(this.tlLength) + '")\'> <i class="icon retweet" > </i></button>'
                    +     '<button class="ui inverted yellow icon button actionButton" onClick=\'javascript:clickFavorite("' + this.tlName  + '", "' + String(this.tlLength) + '")\'> <i class="icon star"    > </i></button>'
                    +     '<button class="ui inverted blue   icon button actionButton" onClick=\'javascript:clickReply("'    + this.tlName  + '", "' + String(this.tlLength) + '")\'> <i class="icon reply"   > </i></button>'
                    +   '</div>'
                    + '</div>';
    
    this.tweets[this.tlLength] = element;
    
    var scrollPosition = $("#" + this.tlName + " .timeline").scrollTop();

    $("#" + this.tlName + " .timeline").prepend(divElement);

    /*
      TLをスクロールしていた場合に、表示位置を固定する
      ただし、なぜか1pxぐらいずれてスクロールが発生してしまうので修正が必要。        
    */
    if (scrollPosition != 0) {
      var x = document.getElementById(this.tlName + String(this.tlLength)).clientHeight;
      var margin = 2;
      $("#" + this.tlName + " .timeline").scrollTop(scrollPosition + x + margin * 2 - 4);
    } else {
      $("#" + this.tlName + " .timeline").scrollTop(0);
    }
    
    this.updatetlLength();
  }

  deleteElement(id: number){
    $("#" + this.tlName + String(id)).css("display", "none");
  }

  deleteAllElement(){
    for (var i = 0; i < this.tlLength; i++)
      this.deleteElement(i);
  }

  twitterToggleClick(method: string, id: string){
    if(method == "Retweet"){
      this.ENV.socket.send("POST", "/statuses/retweet/" + this.tweets[Number(id)].id_str + ".json", { "id": this.tweets[Number(id)].id_str });
    } else if(method == "Favorite"){
      //Todo : Self tweet favorite
      if (this.tweets[Number(id)].favorited == false) {
        this.ENV.socket.send("POST", "/favorites/create.json", { "id": this.tweets[Number(id)].id_str });
        this.tweets[Number(id)].favorited = true;
      } else if (this.tweets[Number(id)].favorited == true) {
        this.ENV.socket.send("POST", "/favorites/destroy.json", { "id": this.tweets[Number(id)].id_str });
        this.tweets[Number(id)].favorited = false;
      }
    } else if(method == "Reply"){
      this.setIDAndFocusTextArea(Number(id));
      this.ENV.in_reply_to_status_id = this.tweets[Number(id)].in_reply_to_status_id;
    }
  }
}


class TLStore{
  private tls: {[key: string]: TL};
  private currentTL: string = "home";
  private ENV: Environments;

  constructor(env: Environments) {
    this.ENV = env;
    this.tls = {};

    this.registerEventHandler();
  }

  registerEventHandler(){
    var _this = this;
    $(document).on("keydown", function(e) {
      _this.tls[_this.currentTL].keyDownReaction(e.keyCode);
    });

    $(document).on('click', 'div.item', function(event) {
      _this.currentTL = $(this).parent().parent().attr("id");
      _this.tls[_this.currentTL].clickReaction($(this));
    });

    $(document).on('click', '.actionButton', function(event) {
      _this.currentTL = $(this).parent().parent().parent().parent().attr("id");
      _this.tls[_this.currentTL].clickActionButton($(this));
    });
  }

  add(tlName: string){
    this.tls[tlName] = new TL(tlName, this.ENV);
  }

  deleteAllElement(tlName: string){
    this.tls[tlName].deleteAllElement();
  }

  insertElement(tlName: string, element: TweetElement){
    this.tls[tlName].insertElement(element);
  }
  
  twitterToggleClick(method: string, tlName: string, id: string) {
    this.tls[tlName].twitterToggleClick(method, id);
  }

  setIDAndFocusTextArea(tlName: string, id = null){
    if (id == null)
      this.tls[tlName].setIDAndFocusTextArea();
    else
      this.tls[tlName].setIDAndFocusTextArea(id);
  }

  clickUserIcon(tlName: string, id: string){
    var _id = Number(id);
    var screen_name = this.tls[tlName].tweets[_id].user["screen_name"];
    this.ENV.socket.getUserData(screen_name);
  }
}
