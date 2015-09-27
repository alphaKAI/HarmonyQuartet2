/// <reference path="../lib/jquery.d.ts" />
/// <reference path="environments.d.ts" />
/// <reference path="tweetElement.d.ts" />
declare class uiController {
    private normalColor;
    private warnColor;
    private displays;
    private activeDisplayName;
    private ENV;
    private _following;
    private following;
    constructor(env: Environments);
    updateTextInputArea(thisValueLength: number): void;
    addDisplay(name: string): void;
    activeDisplay(name: string): void;
    changeDisplay(name: string): void;
    followToggle(): void;
    showUserPage(userData: any): void;
    openUserPage(target: string): void;
    startLoading(): void;
    stopLoading(): void;
    showOverlay(): void;
    hideOverlay(): void;
}
