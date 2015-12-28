/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/semantic-ui.d.ts" />

import {Environments} from "./environments";
import {TLStore} from "./tlController";
import {UIController} from "./uiController";
import {SocketController} from "./socketController";
import {TwitterController} from "./twitterController";

export class ApplicationMain{
  private env: Environments;
  private tlStore: TLStore;
  private ui: UIController;
  private twitterController: TwitterController;

  constructor(){
    this.env     = new Environments();
    this.tlStore = new TLStore(this.env);
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

  private registerEventHundler(){
    var _this = this;

    $(document).on("click", "#toggleSidebar", function(event){
      $(".ui.labeled.icon.sidebar").sidebar("toggle");
    });

    $(document).on("click", ".userPageOpenToggle", function(event){
      var id = $(this).attr("data-user_screen_name");

      _this.ui.openUserPage(id);
    });

    $(document).on("click", ".userInfo", function(event){
      var tlName = $(this).attr("data-tlName");
      var id     = $(this).attr("data-id");

      _this.tlStore.clickUserIcon(tlName, id);
      _this.ui.startLoading();
    });

    $(document).on("click", ".actionRetweet", function(event){
      var tl = $(this).attr("data-tlName");
      var id = $(this).attr("data-id");

      _this.tlStore.twitterToggleClick("Retweet", tl, id);
    });

    $(document).on("click", ".actionFavorite", function(event){
      var tl = $(this).attr("data-tlName");
      var id = $(this).attr("data-id");

      _this.tlStore.twitterToggleClick("Favorite", tl, id);
    });

    $(document).on("click", ".actionReply", function(event){
      var tl = $(this).attr("data-tlName");
      var id = $(this).attr("data-id");

      _this.tlStore.twitterToggleClick("Reply", tl, id);
    });
  }
}

var app:ApplicationMain = new ApplicationMain();
