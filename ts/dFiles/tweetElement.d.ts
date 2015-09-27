declare class TweetElement {
    kind: string;
    text: string;
    in_reply_to_status_id: string;
    profile_image_url_https: string;
    id_str: string;
    event: string;
    _protected: boolean;
    user: {
        [key: string]: string;
    };
    source: {
        [key: string]: string;
    };
    target: {
        [key: string]: string;
    };
    target_object: {
        [key: string]: string;
    };
    originalJson: JSON;
    favorited: boolean;
    retweeted: boolean;
    constructor(json: JSON);
    getOriginalJson(): JSON;
    getJsonData(parsedJson: JSON, key: string): string;
}
