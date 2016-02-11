import {Environments} from "./environments";
import {TweetElement} from "./tweetElement";

export class Dialog {
  private _following: boolean;
  private following: boolean;
  private dialogTweetLength: number = 0;
  private dialogTweets: { [key: number]: TweetElement };
  private ENV: Environments;

  constructor(env: Environments) {
    this.ENV = env;
    this.dialogTweets = {};

    this.registerEventHandler();
  }

  private registerEventHandler(): void {
    var _this = this;

    $("#overlayBackground").click(function() {
      _this.closeDialog();
    });

    $(document).on("click", ".dialogActionButton", function(event: JQueryEventObject) {
      $(this).toggleClass("active");
    });

    $(document).on("click", ".dialogActionRetweet", function(event: JQueryEventObject) {
      _this.actionButtonReaction("Retweet", $(this).attr("data-id"))
    });

    $(document).on("click", ".dialogActionFavorite", function(event: JQueryEventObject) {
      _this.actionButtonReaction("Favorite", $(this).attr("data-id"));
    });

    $(document).on("click", ".dialogActionReply", function(event: JQueryEventObject) {
      _this.actionButtonReaction("Reply", $(this).attr("data-id"));
    });

    $(document).on("click", ".dialogActionDestroy", function(event: JQueryEventObject) {
      _this.actionButtonReaction("Destroy", $(this).attr("data-id"));
    });

    $("#loading").css("display", "none");
  }

  openUserPage(target: string): void {
    this.closeDialog();
    this.ENV.loadingController.startLoading();
    this.ENV.socket.getUserData(target);
  }

  openDialog(): void {
    this.ENV.overLayOpen = true;
    $("#overlayBackground, #overlayDisplay").fadeIn(300);
  }

  closeDialog(): void {
    this.ENV.overLayOpen = false;
    $("#overlayBackground, #overlayDisplay").fadeOut(300);
    $("#overlayDisplay").html();

    this.dialogTweetLength = 0;
    this.dialogTweets = {};
  }

  followToggle(): void {
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
  private parseTwitterDate(created: string): string{
    var created_at = created.split(" ");
    var post_date  = created_at[1] + " "
      + created_at[2] + ", "
      + created_at[5] + " "
      + created_at[3];

    var date = new Date(post_date);
    date.setHours(date.getHours() + 9);
    var year = date.getFullYear();
    var mon  = date.getMonth() + 1;
    var day  = date.getDate();
    var hour = date.getHours();
    var min  = date.getMinutes();

    return [year, mon, day].join("/") + " " + [hour, min].join(":");
  }

  /*
    Todo:
      Dialogの要素に対してのクリックで要素の色を変える(TLの様に)
  */
  private buildTweetDiv(status: TweetElement): string {
    status.text = status.text.replace("\n", "<br>");
    status.text = status.text.replace(/(https?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>");

    var divElement: string =
      '<div class="tweetElement" id= "' + "dialog" + "_" + String(this.dialogTweetLength) + '">'
      + '<div class="content">'
      + '<div class="header userName">'
      + '<img src="' + status.profile_image_url_https + '" alt= "icon" class="ui avatar image" >'
      + status.user["name"] + "(@" + status.user["screen_name"] + ")"
      + '</div>'
      + status.text
      + '</div>'
      +  '<div class="twitterDate">'
      +  this.parseTwitterDate(status.created_at)
      +  '</div>';
      
    //{
    divElement += '<div class="twitterToggles" >';
   
    // FIXME: Filter of protected account is not working.
    //tlController.tsの処理をコピーしただけなのでここも修正が必要。 
    if (this.ENV.adminID != status.user["screen_name"] && status._protected != true) {
      divElement += '<button class="ui inverted red icon button dialogActionButton dialogActionRetweet ';
      if (status.retweeted == true) {
        divElement += "active";
      }
      divElement += '" data-id="' + String(this.dialogTweetLength) + '"> <i class="icon retweet" > </i></button>';
    }
    divElement += '<button class="ui inverted orange icon button dialogActionButton dialogActionFavorite ';

    if (status.favorited == true) {
      divElement += "active";
    }
    divElement += '" data-id="' + String(this.dialogTweetLength) + '"> <i class="icon star"    > </i></button>';

    divElement += '<button class="ui inverted blue icon button dialogActionButton dialogActionReply" data-id="' + String(this.dialogTweetLength) + '"> <i class="icon reply"   > </i></button>';
    if (this.ENV.adminID == status.user["screen_name"]) {
      divElement += '<button class="ui inverted green icon button dialogActionButton dialogActionDestroy" data-id="' + String(this.dialogTweetLength) + '"> <i class="icon trash" > </i></button>';
    }
    divElement += '</div>'

      + '</div>';
    //}

    return divElement;
  }

  private buildUserDiv(user: { [key: string]: string }): string {
    return '<div class="item elementDivider userElement">'
      + '<div class="content userPageOpenToggle" data-user_screen_name="' + user["screen_name"] + '" onclick=javascript:openUserPage("' + user["screen_name"] + '")>'
      + '<div class="header userName">'
      + '<img src="' + user["profile_image_url_https"] + '" alt= "icon" class="ui avatar image">'
      + user["name"] + "(@" + user["screen_name"] + ")"
      + '</div>'
      + '</div>'
      + '</div>';
  }

  showUserPage(userData: any): void {
    var userPageDiv =
      '<div id="userInfo">'
      + '<div id="userInfoTop">'
      + '<div id="userInfoIcon">'
      + '<img src="' + userData["show"]["profile_image_url_https"] + '"" alt= "icon" class="ui small circular image avatar" id= "userInfoIcon">'
      + '<div id="userInfoName">' + userData["show"]["name"] + '(@' + userData["show"]["screen_name"] + ')</div>'
      + '</div>'
      /*
      +     '<div id="userInfoBio">'
      +       userData["show"]["description"]
      +     '</div>'
      */
      + '</div>'
      + '<div id="userInfoNav">'
      + '<div class="ui secondary menu" id="dialogUserMenu">'
      + '<a class="item active" data-tab="tweets"> Tweets </a>'
      + '<a class="item" data-tab="follows"> Following </a>'
      + '<a class="item" data-tab="followers"> Followers </a>'
      + '<div id="ui inverted followButtonDiv">'
      + '<button class="ui button inverted blue" id="followButton">'
      + '</button>'
      + '</div>'
      + '<div class="ui  pointing label" id="followStatus">'
      + '</div>'
      + '</div>'
      + '<div class="ui tab tabElement active" data-tab="tweets">';

    var utl = userData["user_timeline"];
    for (var i = 0; i < utl.length; i++) {
      var element: TweetElement = new TweetElement(utl[i]);
      this.dialogTweets[this.dialogTweetLength++] = element;
      console.log(this.dialogTweets);
      userPageDiv += this.buildTweetDiv(element);
      $("#dialog_" + String(this.dialogTweetLength - 1)).addClass("default");
      console.log($("#dialog_" + String(this.dialogTweetLength - 1)).hasClass("default"));
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
      function() {
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
      } else {
        this.following = true;
      }
      this.followToggle();
    });

    $("#userInfoNav .menu .item").tab({});

    this.openDialog();
  }


  private deleteElement(id: number): void{
    $("#" + "dialog" + "_" + String(id)).css("display", "none");
  }

  private actionButtonReaction(method: string, id: string): void {
    if (method == "Retweet") {
      if (this.dialogTweets[Number(id)].retweeted == false) {
        this.ENV.socket.send("POST", "/statuses/retweet/" + this.dialogTweets[Number(id)].id_str + ".json", { "id": this.dialogTweets[Number(id)].id_str });
        this.dialogTweets[Number(id)].retweeted = true;
      } else if (this.dialogTweets[Number(id)].retweeted == true) {
        this.ENV.socket.send("POST", "/statuses/destroy/" + this.dialogTweets[Number(id)].id_str + ".json", { "id": this.dialogTweets[Number(id)].id_str });
        this.deleteElement(Number(id));
        this.dialogTweets[Number(id)].retweeted = false;
      }
    } else if (method == "Favorite") {
      if (this.dialogTweets[Number(id)].favorited == false) {
        this.ENV.socket.send("POST", "/favorites/create.json", { "id": this.dialogTweets[Number(id)].id_str });
        this.dialogTweets[Number(id)].favorited = true;
      } else if (this.dialogTweets[Number(id)].favorited == true) {
        this.ENV.socket.send("POST", "/favorites/destroy.json", { "id": this.dialogTweets[Number(id)].id_str });
        this.dialogTweets[Number(id)].favorited = false;
      }
    } else if (method == "Reply") {
      this.setIDAndFocusTextArea(Number(id));
      this.ENV.in_reply_to_status_id = this.dialogTweets[Number(id)].in_reply_to_status_id;
    } else if (method == "Destroy") {
      this.ENV.socket.send("POST", "/statuses/destroy/" + this.dialogTweets[Number(id)].id_str + ".json", { "id": this.dialogTweets[Number(id)].id_str });
      this.deleteElement(Number(id));
    }
  }

  private setIDAndFocusTextArea(id: any = null): void {
    $("#textInputArea").focus();
    $("#textInputArea").val("@" + this.dialogTweets[Number(id)].user["screen_name"] + " ");
  }
}