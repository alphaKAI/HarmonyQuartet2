/// <reference path="../lib/jquery.d.ts" />
/// <reference path="environments.d.ts" />

declare class TwitterController {
    private ENV;
    constructor(env: Environments);
    registerEventHandler(): void;
    update(text: string, in_reply_status_id?: any): void;
}
