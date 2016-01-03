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
*/

import {Environments} from "./environments";
import {TweetElement} from "./tweetElement";

export class UIController {
  private normalColor:       string = "blue";
  private warnColor:         string = "red";
  private displays:          any[]  = [];
  private activeDisplayName: string;
  private ENV:               Environments;
  private _following:        boolean;
  private following:         boolean;

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

    $('#textInputArea').bind('keyup', function() {
      _this.updateTextInputArea($(this).val().length);
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

    $("#overlayBackground").click(function() { 
      _this.hideOverlay();
    });

    $("#searchButton").click(function() { 
      _this.searchRequest();
    });

    $("#loading").css("display", "none");
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

  followToggle() {
    if (this.following) {
      $("#followButton").removeClass("red");
      $("#followButton").addClass("blue");
      $("#followButton").html("Following");
    } else {
      $("#followButton").removeClass("red");
      $("#followButton").addClass("blue");
      $("#followButton").html("Follow");
    }
  }


  //Dialog
  /*
    Todo:
      Dialogを選択した時に背景が切り替わらないのでなんとかして実装する。
  */
  buildTweetDiv(status: TweetElement) {
    status.text = status.text.replace("\n", "<br>");
    status.text = status.text.replace(/(https?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>");

    return '<div class="item tweetElement">'
      +   '<div class="content">'
      +     '<div class="header userName">'
      +       '<img src="' + status.profile_image_url_https + '" alt= "icon" class="ui avatar image" >'
      +       status.user["name"] + "(@" + status.user["screen_name"] + ")"
      +     '</div>'
      +     status.text
      +   '</div>'
      + '</div>';
  }

  buildUserDiv(user: {[key: string]: string}) {
    return '<div class="item elementDivider userElement">'
      +   '<div class="content userPageOpenToggle" data-user_screen_name="' + user["screen_name"] + '" onclick=javascript:openUserPage("' + user["screen_name"] + '")>'
      +     '<div class="header userName">'
      +       '<img src="' + user["profile_image_url_https"] + '" alt= "icon" class="ui avatar image">'
      +       user["name"] + "(@" + user["screen_name"] + ")"
      +     '</div>'
      +   '</div>'
      + '</div>';
  }

  showUserPage(userData: any) {
    var userPageDiv =
        '<div id="userInfo">'
      +   '<div id="userInfoTop">'
      +     '<div id="userInfoIcon">'
      +       '<img src="' + userData["show"]["profile_image_url_https"] + '"" alt= "icon" class="ui small circular image avatar" id= "userInfoIcon">'
      +       '<div id="userInfoName">' + userData["show"]["name"] + '(@' + userData["show"]["screen_name"] + ')</div>'
      +     '</div>'
      /*
      +     '<div id="userInfoBio">'
      +       userData["show"]["description"]
      +     '</div>'
      */
      +   '</div>'
      +   '<div id="userInfoNav">'
      +     '<div class="ui secondary menu">'
      +       '<a class="item active" data-tab="tweets"> Tweets </a>'
      +       '<a class="item" data-tab="follows"> Following </a>'
      +       '<a class="item" data-tab="followers"> Followers </a>'
      +       '<div id="ui inverted followButtonDiv">'
      +         '<button class="ui button inverted blue" id="followButton">'
      +         '</button>'
      +       '</div>'
      +       '<div class="ui  pointing label" id="followStatus">'
      +     '</div>'
      +   '</div>'
      +   '<div class="ui tab tabElement active" data-tab="tweets">';

    var utl = userData["user_timeline"];
    for (var i = 0; i < utl.length; i++) {
      userPageDiv += this.buildTweetDiv(new TweetElement(utl[i]));
    }

    userPageDiv +=
      '</div>'
    + '<div class="ui tab tabElement" data-tab="follows">';

    var friends = userData["friends"];
    for (var i = 0; i < friends.length; i++) {
      userPageDiv += this.buildUserDiv(friends[i]);
    }

    userPageDiv +=
      '</div>'
    + '<div class="ui tab tabElement" data-tab="followers">';

    var followers = userData["followers"];
    for (var i = 0; i < followers.length; i++) {
      userPageDiv += this.buildUserDiv(followers[i]);
    }

    userPageDiv +=
      "</div>"
    + "</div>"
    + "</div>";

    var connections = userData["lookup"];
    for (var i = 0; i < connections.length; i++) {
      if (connections[i] == "following") {
        this.following = true;
      } else if (connections[i] == "followed_by") {
        this._following = true;
      }
    }

    $("#overlayDisplay").html(userPageDiv);

    if (this._following) {
      $("#followStatus").html("following you!");
    } else {
      $("#followStatus").html("not following you");
    }

    $("#userInfoTop").css("background-image", "url(" + userData["show"]["profile_banner_url"] + ")")

    var _this = this;
    $("#followButton").hover(
      function(){
        if (_this.following) {
          $(this).removeClass("blue");
          $(this).addClass("red");
          $(this).html("Unfollow");
        }
    }, function() {
      if (_this.following) {
        $(this).removeClass("red");
        $(this).addClass("blue");
        $(this).html("Following");
      }
    });

    this.followToggle();

    $("#followButton").click(function() {
      if (this.following) {
        this.following = false;
      } else{
        this.following = true;
      }
      this.followToggle();
    });

    $("#userInfoNav .menu .item").tab({});

    this.showOverlay();
  }

  showSearchResult(res: any) {
    res["statuses"].reverse();

    for (var status in res["statuses"]) {
      this.ENV.tlStore.insertElement("search", new TweetElement(res["statuses"][status]));
    }
  }

  openUserPage(target: string) {
    this.hideOverlay();
    this.startLoading();
    this.ENV.socket.getUserData(target);
  }

  startLoading() {
    this.ENV.loading = true;
    $("#loading").fadeIn(300);
    $('.loadingBall, .loadibgBall1').removeClass('stopLoading');
  }

  stopLoading() {
    this.ENV.loading = false;
    $('.loadingBall, .loadibgBall1').addClass('stopLoading');
    $("#loading").fadeOut(300);
  }

  showOverlay() {
    this.ENV.overLayOpen = true;
    $("#overlayBackground, #overlayDisplay").fadeIn(300);
  }

  hideOverlay() {
    this.ENV.overLayOpen = false;
    $("#overlayBackground, #overlayDisplay").fadeOut(300);
    $("#overlayDisplay").html();
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
