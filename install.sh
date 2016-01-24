npm install
cd semantic
gulp build
cd ../
tsc app.ts --module commonjs
cd ts/gulp
npm install
gulp tsc
gulp browserify
gulp minify
cd ../

cat << EOT > setting.json
{
  "consumer_key"        : "Your Consumer Key", 
  "consumer_secret"     : "Your Consumer Secret"
}
EOT

echo "[HarmonyQuartet2 - Installation] Finish"
echo 'You should configure "setting.json"'
