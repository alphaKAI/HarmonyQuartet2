#HarmonyQuartet2
分かる人のみ使ってください。
  
  
##前提環境
* typescript 1.6.2  
* gulp(最新のもの)  
* npm(最新のもの)  
* node.js(最新のもの)  
  
  
##依存関係解決

```zsh:
% npm install express socket.io serve-static confu
% npm install semantic-ui
% ruby buildTS.rb
```
  
ただし、semantic-uiのインストール先は、途中で聞かれるときにsemanticではなくてlib/semanticにする必要あり。  
それから、lib/semanticにてgulp buildしろとか言われるけど(検証してみた時はそうなっただけなので、もしかしたら修正されているかも)  
なんかそれだとbuildに失敗してうまくいかないのでnode_modulesの方のsemantic-uiのディレクトリでgulp buildしてください。  
コマンドは以下になります。  

```:zsh
% cd node_modules/semantic-ui  
% gulp build  
```

なにか聞かれても全部Enterで問題無いです  
  
ruby buildTS.rbで出てくるエラーは無視して問題無いです。  
  

それが終わったら、setting.jsonを作り以下のようにconsumerKey,consumerSecret,accessToken,accessTokenSecretを書き込んでください  

```:json
{
  "consumer_key"        : "Your Consumer Key",
  "consumer_secret"     : "Your Consumer Secret",
  "access_token_key"    : "Your Access Token Key",
  "access_token_secret" : "Your Access Token Secret"
}
```

  
##起動
`% node app.js`で起動後`localhost:3000`にアクセス。
  
  
##免責事項
バグが多いです  
何が起きても知りません  
それから、動くと思っても動かない機能が多いです。  
  
  
##LICENSE
The MIT License  
Copyright (C) 2015 alphaKAI  
