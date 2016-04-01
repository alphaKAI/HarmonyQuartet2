/*
  The MIT License
  Copyright (C) 2016 alphaKAI
*/

import {TimeLine} from "./timeline";
import {TweetElement} from "../tweetElement";

export class TimeLineStore {
  private timelines: { [name: string]: TimeLine } = {};
  
  constructor() {
    
  }
  
  addTimeLine(timeLineName: string): Boolean {
    if (this.existTimeLine(timeLineName)) {
      return false;
    } else {
      this.timelines[timeLineName] = new TimeLine(timeLineName);
    
      return true;
    }
  }
  
  addNewTweet(timeLineName: string, newTweet: TweetElement): Boolean {
    if (this.existTimeLine(timeLineName)) {
      this.timelines[timeLineName].newTweet(newTweet);
      
      return true;
    } else {
      return false;
    }
  }
  
  getTweetElement(timeLineName: string, id: number): TweetElement {
    if (this.existTimeLine(timeLineName)) {
      return this.timelines[timeLineName].getTweetElement(id);
    } else {
      return undefined;
    }
  }
  
  getTiemLineLength(timeLineName: string): number {
    if (this.existTimeLine(timeLineName)) {
      return this.timelines[timeLineName].length();
    } else {
      return undefined;
    }
  }
  
  existTimeLine(timeLineName: string): Boolean {
    var flag: Boolean = false;
    
    this.timeLinesList().forEach(element => {
      if (element == timeLineName) {
        flag = true;
      }
    });
    
    return flag;
  }
  
  timeLinesList(): Array<string> {
    var timeLineNames = Array<string>();
    
    for (var k in this.timelines) {
      timeLineNames[timeLineNames.length++] = k;
    }
    
    return timeLineNames;
  }
}