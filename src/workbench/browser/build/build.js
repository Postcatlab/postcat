const fs = require('fs');
const { execSync } = require('child_process');
class webPlatformBuilder {
  resetBuildConfig(json) {
    delete json.projects.eoapi.i18n.sourceLocale.baseHref;
    Object.keys(json.projects.eoapi.i18n.locales).forEach((val) => {
      delete json.projects.eoapi.i18n.locales[val].baseHref;
    });
    return json;
  }
  executeBuild() {
    execSync('ng build -c production', { stdio: 'inherit' });
    fs.writeFile(
      './dist/index.html',
      `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Eoapi - Easy &amp; Open Source API Ecosystem</title>
        <script>
         let lang=window.location.href.includes("/en")?'en':'zh';
         try{
          lang=JSON.parse(window.localStorage.getItem("LOCAL_SETTINGS_KEY"))["eoapi-language"]=='en-US'?'en':'zh';
         }catch(e){
          
         }
         let search={};
         if(window.location.search){
          search=new URLSearchParams(window.location.search);
          window.location.href="/"+lang+'/?utm_source='+search.get('utm_source');
         }else{
         window.location.href="/"+lang;
         }
        </script>
      </head>
      <body></body>
    </html>
    `,
      () => {}
    );
  }
}
class appPlatformBuilder {
  resetBuildConfig(json) {
    json.projects.eoapi.i18n.sourceLocale.baseHref = '';
    Object.keys(json.projects.eoapi.i18n.locales).forEach((val) => {
      json.projects.eoapi.i18n.locales[val].baseHref = '';
    });
    return json;
  }
  executeBuild() {
    execSync('ng build  -c production --base-href ./', { stdio: 'inherit' });
  }
}
class PlatformBuilder {
  constructor(platForm) {
    switch (platForm) {
      case 'web': {
        this.instance = new webPlatformBuilder();
        break;
      }
      case 'app': {
        this.instance = new appPlatformBuilder();
        break;
      }
    }
  }
  build() {
    //Because of i18n,we should change angular.json for generate different base-href html tag
    let buildConfigJson = require('../angular.json');
    buildConfigJson = this.instance.resetBuildConfig(buildConfigJson);
    let that = this;
    fs.writeFile('./angular.json', JSON.stringify(buildConfigJson), function (err) {
      if (err) {
        console.error('build/beforeBuild.js:', err);
      }
      that.instance.executeBuild();
    });
  }
}
let platform = process.argv[2] || 'app';
let platformBuilder = new PlatformBuilder(platform);
platformBuilder.build();
