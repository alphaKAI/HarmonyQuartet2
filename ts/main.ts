/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/semantic-ui.d.ts" />

import {Environments} from "./environments";
import {TLStore} from "./tlController";
import {UIController} from "./uiController";
import {SocketController} from "./socketController";
import {TwitterController} from "./twitterController";
import {LoadingController} from "./loadingController";
import {ScreenCover} from "./screenCover";
import {Dialog} from "./dialog";
import {KeyBindings} from "./keyBindings";

export class ApplicationMain {
  private env:               Environments;
  private tlStore:           TLStore;
  private ui:                UIController;
  private twitterController: TwitterController;
  private dialog:            Dialog;
  private keybindings:       KeyBindings;
  private loadingController: LoadingController;
  private screenCover:       ScreenCover;

  constructor() {
    this.env               = new Environments();
    this.tlStore           = new TLStore(this.env);
    this.env.tlStore       = this.tlStore;
    this.ui                = new UIController(this.env);
    this.env.uicontroller  = this.ui;
    this.env.socket        = new SocketController(this.env);
    this.twitterController = new TwitterController(this.env);
    this.loadingController = new LoadingController(this.env);
    this.env.loadingController = this.loadingController;
    this.screenCover       = new ScreenCover(this.env);
    this.env.screenCover   = this.screenCover;
    this.dialog            = new Dialog(this.env);
    this.env.dialog        = this.dialog;
    this.keybindings       = new KeyBindings(this.env);

    /* tlの順番とかその辺も設定可能にしたい */
    this.tlStore.add("home");
    this.tlStore.add("reply");
    this.tlStore.add("search");
    this.tlStore.add("dm");

    this.ui.addDisplay("homeDisplay");
    this.ui.addDisplay("settingDisplay");
    this.ui.addDisplay("bugReportDisplay")

    this.ui.activeDisplay("homeDisplay");

    this.registerEventHandler();

    this.env.screenCover.openCoverWithLogo();
  }

  private registerEventHandler(): void {
    var _this:any = this;

    $(document).on("click", "#toggleSidebar", function(event: JQueryEventObject) {
      $(".ui.labeled.icon.sidebar").sidebar("toggle");
    });

    $(document).on("click", ".userPageOpenToggle", function(event: JQueryEventObject) { 
      _this.dialog.openUserPage($(this).attr("data-user_screen_name"));
    });

    $(document).on("click", ".userInfo", function(event: JQueryEventObject) {
      _this.tlStore.clickUserIcon($(this).attr("data-tlName"), $(this).attr("data-id"));
      _this.loadingController.startLoading();
    });

    $(document).on("click", ".actionRetweet", function(event: JQueryEventObject) {
      _this.tlStore.twitterToggleClick("Retweet", $(this).attr("data-tlName"), $(this).attr("data-id"))
    });

    $(document).on("click", ".actionFavorite", function(event: JQueryEventObject) {
      _this.tlStore.twitterToggleClick("Favorite", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });

    $(document).on("click", ".actionReply", function(event: JQueryEventObject) {
      _this.tlStore.twitterToggleClick("Reply", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });

    $(document).on("click", ".actionDestroy", function(event: JQueryEventObject) {
      _this.tlStore.twitterToggleClick("Destroy", $(this).attr("data-tlName"), $(this).attr("data-id"));
    });
  }
}

var app: ApplicationMain = new ApplicationMain();