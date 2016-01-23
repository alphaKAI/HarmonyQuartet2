#HarmonyQuartet2
The twitter client written in Node.js(server side) and TypeScript(front end).  
  
This version is development snapshot, please use at own risk.  
  
  
##Requirements
* typescript 1.6.2  
* gulp(latest)  
* npm(latest)  
* node.js(latest)  
  
  
##Dependencies

```zsh:
% npm install express socket.io serve-static confu ntwitter
% npm install semantic-ui
% tsc app.ts
% cd ts/gulp
% npm install
% gulp tsc
% gulp browserify
% gulp minify
```
  
###Note
Installation path of semantic-ui is not default path(semantic/).  
Please enter "lib/semantic" when you are asked.  
  
Install wizard of semantic-ui says `run "gulp build" at /lib/semantic`, though this command wouldn't work.  
Please run "gulp build" at "node_modules/semantic-ui"  
(This problem might have been fixed.)  

```:zsh
% cd node_modules/semantic-ui  
% gulp build  
```

You have only to hit return key if you are asked by gulp wizard.
  

Currently, HarmonyQuartet2 doesn't support twitter authoraization byself, therefore you should configurate setting.js as follows:  

```:json
{
  "consumer_key"        : "Your Consumer Key",
  "consumer_secret"     : "Your Consumer Secret",
  "access_token_key"    : "Your Access Token Key",
  "access_token_secret" : "Your Access Token Secret"
}
```

  
##Execute
1. run `% node app.js`  
2. access to `localhost:3000`  
  
  
##Disclaimer
This project have many bugs.  
Please use at own risk.  
I do not take the responsibility even if any damage occurs.  
  
  
##LICENSE
The MIT License  
Copyright (C) 2015 alphaKAI  
