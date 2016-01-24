#HarmonyQuartet2
The twitter client written in Node.js(server side) and TypeScript(front end).  
  
This version is development snapshot, please use at own risk.  
  
  
##Requirements
* typescript 1.6.2  
* gulp(latest)  
* npm(latest)  
* node.js(latest)  
  
  
##Setup

```zsh:
% ./setup.sh
```
  
###Note
The semantic-ui's install wizard ask you some questions but you have only to hit return key.  
  
  
HarmonyQurartet2 support Twitter Authraization.  
If you already have access_token and access_token_secret or intend to use your consumer_key, you should configure "setting.json" as below:  
```:json
{
  "consumer_key"        : "Your Consumer Key",
  "consumer_secret"     : "Your Consumer Secret",
  "access_token_key"    : "Your Access Token Key",
  "access_token_secret" : "Your Access Token Secret"
}
```

Note: Currently, HarmonyQuartet2 doesn't provide own consumer_key and consumer_secret therefore you must arrange your consumer_key from [apps.twitter.com](https://apps.twitter.com) and configure "setting.json" as below:  
```:json
{
  "consumer_key"        : "Your Consumer Key",
  "consumer_secret"     : "Your Consumer Secret",
}
```
It isn't necessary for you to set an access token, for HarmonyQuartet authenticate and save automatically.  
  
  
##Execute
1. run `% node app.js`  
2. access to `127.0.0.1:3000`  
  
  
##Disclaimer
This project have many bugs.  
Please use at own risk.  
I do not take the responsibility even if any damage occurs.  
  
  
##LICENSE
The MIT License  
Copyright (C) 2015 alphaKAI  
