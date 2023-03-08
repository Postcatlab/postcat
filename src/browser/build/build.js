const fs = require('fs');
const { execSync } = require('child_process');
class webPlatformBuilder {
  constructor(environment) {
    this.environment = environment;
  }
  resetBuildConfig(json) {
    delete json.projects.postcat.i18n.sourceLocale.baseHref;
    Object.keys(json.projects.postcat.i18n.locales).forEach(val => {
      delete json.projects.postcat.i18n.locales[val].baseHref;
    });
    return json;
  }
  executeBuild() {
    //! Can't use pathname to redirect,will cause the dead loop;
    execSync(`ng build -c ${this.environment}`, { stdio: 'inherit' });
    //! For vercel redirect
    fs.writeFile(
      './dist/index.html',
      `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Postcat - Easy &amp; Open Source API Ecosystem</title>
        <script>
         let lang=window.location.href.includes("/en")?'en':'zh';
         try{
          lang=JSON.parse(window.localStorage.getItem("LOCAL_SETTINGS_KEY"))["system.language"]=='en-US'?'en':'zh';
         }catch(e){

         }
         let baseDir="/"+lang+'/';
         let search={};
         if(window.location.search){
          window.location.href=baseDir+window.location.search;
         }else{
         window.location.href=baseDir;
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
    json.projects.postcat.i18n.sourceLocale.baseHref = '';
    Object.keys(json.projects.postcat.i18n.locales).forEach(val => {
      json.projects.postcat.i18n.locales[val].baseHref = '';
    });
    return json;
  }
  executeBuild() {
    execSync('ng build  -c production --base-href ', { stdio: 'inherit' });
  }
}
class PlatformBuilder {
  constructor(platForm, environment) {
    switch (platForm) {
      case 'web': {
        this.instance = new webPlatformBuilder(environment);
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
let environment = process.argv[3] || 'production';
let platformBuilder = new PlatformBuilder(platform, environment);
platformBuilder.build();
