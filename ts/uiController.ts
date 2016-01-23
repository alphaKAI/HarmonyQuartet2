/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/semantic-ui.d.ts" />

/*
  The MIT License
  Copyright (C) 2015 alphaKAI
*/

/*
  Todo:
    OverLayの表示領域に階層システムを実装
    A->B->Cとクリックした時に戻ったり進んだり出来るようにする
    (HTMLを保持して切り替えればいいだけ)
    
  Todo:
    会話スレッドの表示を出来るようにする(オーバーレイでいいかな)
*/

import {Environments} from "./environments";
import {TweetElement} from "./tweetElement";

export class UIController {
  private normalColor:       string = "blue";
  private warnColor:         string = "red";
  private displays:          any[]  = [];
  private activeDisplayName: string;
  private ENV:               Environments;

  constructor(env: Environments) {
    this.ENV   = env;
    var _this = this;

    //Register events
    //Initialize
    $(function() {
      $(".TLcolumn").css("height", String($(window).height() - 39 - 60) + "px");
      $(".timeline").css("height", String($(window).height() - 39 - 110) + "px");
    });

    //resize handler
    $(window).resize(function() {
      $(".TLcolumn").css("height", String($(window).height() - 39 - 60) + "px");
      $(".timeline").css("height", String($(window).height() - 39 - 110) + "px");
    });

    $("#textInputArea").on("keypress keyup", function() {
      _this.updateTextInputArea($(this).val().length);
    });
    
    $("#textInputArea").focus(function(){
      _this.ENV.focus = "textInputArea";
    });
    
    //SideBar Handler
    $("#ChangeHomeDisplay").click(function() {
      _this.changeDisplay("homeDisplay");
      $('.ui.labeled.icon.sidebar').sidebar("hide");
    });

    $("#ChangeSettingDisplay").click(function() {
      _this.changeDisplay("settingDisplay");
      $('.ui.labeled.icon.sidebar').sidebar("hide");
    });

    $("#ChangeBugReportDisplay").click(function() {
      _this.changeDisplay("bugReportDisplay");
      $('.ui.labeled.icon.sidebar').sidebar("hide");
    });

    $("#searchButton").click(function() { 
      _this.searchRequest();
      _this.ENV.dialog.startLoading();
    });
  }

  updateTextInputArea(thisValueLength: number) {
    if (thisValueLength > 140) {
      $("#tweetButton").removeClass(this.normalColor);
      $("#tweetButton").addClass(this.warnColor);

      $(".counter").css("color", this.warnColor);
    } else {
      $("#tweetButton").removeClass(this.warnColor);
      $("#tweetButton").addClass(this.normalColor);

      $(".counter").css("color", "black");
    }

    //Todo: 設定で残り文字数を表示するか文字数を表示するかの切り替えを出来るようにする
    $('.counter').html(String(this.ENV.lastLengthFlag ?  140 - thisValueLength : thisValueLength));
  }

  addDisplay(name: string) {
    this.displays.push(name);
    $("." + name).css("display", "none");
  }

  activeDisplay(name: string) {
    this.activeDisplayName = name;
    $("." + name).css("display", "block");
  }

  changeDisplay(name: string) {
    $("." + this.activeDisplayName).css("display", "none");
    this.activeDisplay(name);
  }
  
  showSearchResult(res: any) {
    res["statuses"].reverse();

    for (var status in res["statuses"]) {
      this.ENV.tlStore.insertElement("search", new TweetElement(res["statuses"][status]));
    }
  }

  searchRequest() {
    this.ENV.socket.getSearchData($(':text[name="searchText"]').val(), { "count": "100" });
  }
  
  swapColumn(from: string, to: string) {
    if (from[0] != "#") {
      from = "#" + from;
    }
    if (to[0] != "#") {
      to = "#" + to;
    }

    var $from = $(from);
    var $to = $(to);

    $from.replaceWith('<div id="REPLACE_TMP"></div>');
    $to.replaceWith($from);
    $("#REPLACE_TMP").replaceWith($to);
  }
}
