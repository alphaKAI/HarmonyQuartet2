/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/semantic-ui.d.ts" />

import {Environments} from "./environments";
import {TLStore} from "./tlController";
import {UIController} from "./uiController";
import {SocketController} from "./socketController";
import {TwitterController} from "./twitterController";

export class ApplicationMain {
  private env:               Environments;
  private tlStore:           TLStore;
  private ui:                UIController;
  private twitterController: TwitterController;

  constructor() {
    this.env               = new Environments();
    this.tlStore           = new TLStore(this.env);
    this.env.tlStore       = this.tlStore;
    this.ui                = new UIController(this.env);
    this.env.uicontroller  = this.ui;
    this.env.socket        = new SocketController(this.env);
    this.twitterController = new TwitterController(this.env);

    /* tlの順番とかその辺も設定可能にしたい */
    this.tlStore.add("home");
    this.tlStore.add("reply");
    this.tlStore.add("search");
    this.tlStore.add("dm");

    this.ui.addDisplay("homeDisplay");
    this.ui.addDisplay("settingDisplay");
    this.ui.addDisplay("bugReportDisplay")

    this.ui.activeDisplay("homeDisplay");

    this.registerEventHundler();
  }

  private registerEventHundler() {
    var _this:any = this;

    $(document).on("click", "#toggleSidebar", function(event) {
      $(".ui.labeled.icon.sidebar").sidebar("toggle");
    });

    $(document).on("click", ".userPageOpenToggle", function(event) { 
      _this.ui.openUserPage($(this).attr("data-user_screen_name"));
    });

    $(document).on("click", ".userInfo", function(event) {
      _this.tlStore.clickUserIcon($(this).attr("data-tlName"), $(this).attr("data-id"));
      _this.ui.startLoading();
    });

    $(document).on("click", ".actionRetweet", function(event) {
      _this.tlStore.twitterToggleClick("Retweet", $(this).attr("data-tlName"), $(this).attr("data-id"))
    });

    $(document).on("click", ".actionFavorite", function(event) {
      _this.tlStore.twitterToggleClick("Favorite", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });

    $(document).on("click", ".actionReply", function(event) {
      _this.tlStore.twitterToggleClick("Reply", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });

    $(document).on("click", ".actionDestroy", function (event) {
      _this.tlStore.twitterToggleClick("Destroy", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });
  }
}

var app:ApplicationMain = new ApplicationMain();