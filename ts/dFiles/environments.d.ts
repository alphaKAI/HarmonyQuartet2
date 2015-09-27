/// <reference path="socketController.d.ts" />
/// <reference path="tlController.d.ts" />
/// <reference path="uiController.d.ts" />
declare class Environments {
    in_reply_to_status_id: string;
    socket: SocketController;
    lastLengthFlag: boolean;
    tlStore: TLStore;
    uicontroller: uiController;
    adminID: string;
    overLayOpen: boolean;
    loading: boolean;
    constructor();
}
