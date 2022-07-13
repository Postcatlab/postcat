/**
 * Use electron-notarize to notarize app
 *
 * @description The app should be notarized after it has been signed and before it’s packaged into a dmg.
 * Electron-builder has a hook for this called afterSign. You can link that to a javascript file that will be called (and waited for) after sign.
 * You add it to your top level “build” configuration
 *
 * @link https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
 */

exports.default = function notarizing(context) {
  return context;
};
