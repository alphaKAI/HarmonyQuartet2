/// <reference path="../lib/jquery.d.ts" />
/// <reference path="environments.d.ts" />
/// <reference path="tweetElement.d.ts" />
declare class TL {
    private tlLength;
    private selected;
    private selectable;
    private tlName;
    private waitFlag;
    tweets: {
        [key: number]: TweetElement;
    };
    private ENV;
    constructor(arg: string, env: Environments);
    updatetlLength(): void;
    clickActionButton(jqThis: JQuery): void;
    toggleSelect(n: number): void;
    clearSelects(): void;
    clickReaction(jqThis: JQuery): void;
    keyDownReaction(keyCode: number): void;
    setIDAndFocusTextArea(id?: any): void;
    insertElement(element: TweetElement): void;
    deleteElement(id: number): void;
    deleteAllElement(): void;
    twitterToggleClick(method: string, id: string): void;
}
declare class TLStore {
    private tls;
    private currentTL;
    private ENV;
    constructor(env: Environments);
    registerEventHandler(): void;
    add(tlName: string): void;
    deleteAllElement(tlName: string): void;
    insertElement(tlName: string, element: TweetElement): void;
    twitterToggleClick(method: string, tlName: string, id: string): void;
    setIDAndFocusTextArea(tlName: string, id?: any): void;
    clickUserIcon(tlName: string, id: string): void;
}
