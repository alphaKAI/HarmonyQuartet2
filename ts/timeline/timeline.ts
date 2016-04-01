/*
  The MIT License
  Copyright (C) 2016 alphaKAI
*/

import {TweetElement} from "../tweetElement";

export class TimeLine {
  private name: string;
  private tweets: { [id: number]: TweetElement } = {};
  private tweetLength: number = 0;

  constructor(_name: string) {
    this.name = _name;
  }

  newTweet(newElement: TweetElement): void {
    this.tweetLength++;
    this.tweets[this.tweetLength] = newElement;
  }
  
  getTweetElement(id: number): TweetElement {
    if (this.checkExist(id)) {
      return this.tweets[id];
    } else {
      return undefined;
    }
  }

  checkExist(id: number): boolean {
    if (this.tweets[id] === undefined) {
      return false;
    } else {
      return false;
    }
  }
  
  length(): number {
    return this.tweetLength;
  }
}