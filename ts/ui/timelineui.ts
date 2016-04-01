/// <reference path="../lib/jquery.d.ts" />

/*
  The MIT License
  Copyright (C) 2016 alphaKAI
*/

import {TimeLineStore} from "../timeline/timelineStore";
import {TweetElement} from "../tweetElement";

export class TimeLineUI extends TimeLineStore {
  private selectList:{ [timeLineName: string]: {[timeLineID: number] : Boolean}} = {}; 
  
  constructor() {
    super();
    this.registerEventHandler();
  }

  registerEventHandler(): void {    
    var _this = this;
    
    $(document).on("click", "div.TLElement", function (event: JQueryEventObject) {
      var id: string           = $(this).attr("id");
      var timeLineName: string = id.split("_")[0];
      var timeLineID: number   = Number(id.split("_")[1]);
      
      if (_this.selectList[timeLineName] === undefined) {
        _this.selectList[timeLineName] = {};  
      }
      
      var status = _this.selectList[timeLineName][timeLineID];
      if (status === undefined || status == false) {
        _this.selectList[timeLineName][timeLineID] = true;
      } else {
        _this.selectList[timeLineName][timeLineID] = false;
      }
      
      _this.applyClickEvent();
    });
    
    /*
    $(document).on({
      "mouseenter": function() {
        var id: string           = $(this).attr("id");
        var timeLineName: string = id.split("_")[0];
        var timeLineID: number   = Number(id.split("_")[1]);
        $("#" + timeLineName + "_" + String(timeLineID) + " .TLElementActionButtons").css("display", "flex");
        console.log("#" + timeLineName + "_" + String(timeLineID) + " .TLElementActionButtons");
      },
      "mouseleave": function() {
        var id: string           = $(this).attr("id");
        var timeLineName: string = id.split("_")[0];
        var timeLineID: number   = Number(id.split("_")[1]);
        console.log("#" + timeLineName + "_" + String(timeLineID) + " .TLElementActionButtons");
        $("#" + timeLineName + "_" + String(timeLineID) + " .TLElementActionButtons").css("display", "none");
      }
    }, "div.TLElement");
    */
  } 

  addNewTimeLine(timeLineName: string): Boolean {
    return this.addTimeLine(timeLineName);
  }

  addNewTweet(timeLineName: string, newTweet: TweetElement): Boolean {
    if (super.addNewTweet(timeLineName, newTweet)) {
      var elementString =
        '<div class="TLElement TLElementDefault" id="' + timeLineName + '_' + String(this.getTiemLineLength(timeLineName)) + '" data-tlname="' + timeLineName + '">'
        + '<div class="userInfo" data-tlname="' + timeLineName + '" data-id="' + String(this.getTiemLineLength(timeLineName)) + '">'
        + '<div class="userIcon">'
        + '<img src="' + newTweet.profile_image_url_https + '" alt="icon" class="userIcon">'
        + '</div>'
        + '<div class="userName">'
        + ((()=>{
          var name = newTweet.user["name"];
          if (16 <= name.length) {
            name = name.slice(0, 15) + "...";
          }
          return name;
        })())
        + '</div>'
        + '</div>'
        + '<div class="tweetText">'
        + newTweet.text
        + '</div>'
        + '<div class="TLElementActionButtons">'
        + '<button class="ui inverted red icon button">'
        + '<i class="icon retweet"> </i>'
        + '</button>'
        + '<button class="ui inverted orange icon button">'
        + '<i class="icon star"> </i>'
        + '</button>'
        + '<button class="ui inverted blue icon button">'
        + '<i class="icon reply"> </i>'
        + '</button>'
        + '<button class="ui inverted green icon button">'
        + '<i class="icon trash" > </i>'
        + '</button>'
        +  '</div>'
        + '</div>';

      var scrollPosition = $("#" + timeLineName + " .TLElements").scrollTop();

      $("#" + timeLineName + " .TLElements").prepend(elementString);

      /*
        TLをスクロールしていた場合に、表示位置を固定する
        If TL is scrolled that fix y-coordinate.
      */
      if (scrollPosition != 0) {
        var x = document.getElementById(timeLineName + "_" + String(this.getTiemLineLength(timeLineName))).clientHeight;
        var margin = 2;
        $("#" + timeLineName + " .TLElements").scrollTop(scrollPosition + x + margin * 2 - 4 + 1);
      } else {
        $("#" + timeLineName + " .TLElements").scrollTop(0);
      }


      return true;
    } else {
      return false;
    }
  }
  
  applyClickEvent(): void {
    for (var timeLineName in this.selectList) {
      for (var timeLineID in this.selectList[timeLineName]) {
        if (this.selectList[timeLineName][timeLineID]) {
          $("#" + timeLineName + "_" + String(timeLineID)).removeClass("TLElementDefault");
          $("#" + timeLineName + "_" + String(timeLineID)).addClass("TLElementSelected");
        } else {
          $("#" + timeLineName + "_" + String(timeLineID)).removeClass("TLElementSelected");
          $("#" + timeLineName + "_" + String(timeLineID)).addClass("TLElementDefault");
        }
      }
    }
  }
}