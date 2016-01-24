import {Environments} from "./environments";

export class ScreenCover {
  private ENV: Environments;

  constructor(env: Environments) {
    this.ENV = env;
  }

  public openCoverWithLogo() {
    var coverHtml =
      '<div id="hqCoverTitle">'
      + '<h1 id="hqCoverTitle">HarmonyQuartet2</h1>'
      + '</div>'
      + '<div id="hqCoverContens">'
      + '<h3 id="hqCoverCopy">Yet Another Twitter Client</h3>'
      + '</div>';
    $("#coverDisplay").html(coverHtml);

    this.ENV.coverWithLogoOpen = true;
    this.ENV.loadingController.startLoading();
    this.openCover();
  }

  public closeCoverWithLogo() {
    this.ENV.coverWithLogoOpen = false;
    this.ENV.loadingController.stopLoading();

    this.closeCover();
  }

  openCover(): void {
    $("#coverBackground, #coverDisplay").fadeIn(300);
  }

  closeCover(): void {
    $("#coverBackground, #coverDisplay").fadeOut(300);
    $("#coverDisplay").html();
  }

}