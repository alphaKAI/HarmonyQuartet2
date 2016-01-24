import {Environments} from "./environments";

export class LoadingController {
  private ENV: Environments;

  constructor(env: Environments) {
    this.ENV = env;
  }

  startLoading(): void {
    this.ENV.loading = true;
    $("#loading").fadeIn(300);
    $('.loadingBall, .loadibgBall1').removeClass('stopLoading');
  }

  stopLoading(): void {
    this.ENV.loading = false;
    $('.loadingBall, .loadibgBall1').addClass('stopLoading');
    $("#loading").fadeOut(300);
  }
}