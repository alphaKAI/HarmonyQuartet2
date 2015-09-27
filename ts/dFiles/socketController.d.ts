/// <reference path="environments.d.ts" />
/// <reference path="../lib/node.d.ts" />
/// <reference path="../lib/socket.io.d.ts" />
declare class SocketController {
    private ENV;
    private socket;
    constructor(env: Environments);
    send(method: string, endPoint: string, params?: {
        [key: string]: string;
    }): void;
    getUserData(screen_name: string): void;
}
