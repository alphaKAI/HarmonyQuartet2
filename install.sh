npm install
tsc app.ts --module commonjs
cd ts/gulp
npm install
gulp tsc
gulp browserify
gulp minify
cd ../

echo "[HarmonyQuartet2 - Installation] Finish"