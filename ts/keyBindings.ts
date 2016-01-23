import {Environments} from "./environments";

export class KeyBindings {
  private ENV: Environments;

  constructor(_env: Environments) {
    this.registerEventHandler();
    this.ENV = _env;
  }

  private registerEventHandler() {
    var _this = this;
    $(window).keydown(function (event) {
      switch (event.keyCode) {
        case 13://Enter key
          if ((event.metaKey || event.ctrlKey) && _this.ENV.focus == "textInputArea") {
            $("#tweetButton").trigger("click");
          }
          break;
      }
    });
  }
}