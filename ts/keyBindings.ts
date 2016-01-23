export class KeyBindings {
  constructor() {
    this.registerEventHandler();
  }

  private registerEventHandler() {
    $(window).keydown(function (event) {
      switch (event.keyCode) {
        case 13://Enter key
          if (event.ctrlKey) {
            $("#tweetButton").trigger("click");
          }
          break;
      }
    });
  }
}