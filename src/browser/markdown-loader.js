const showdown = require('showdown');

module.exports = source => {
  let converter = new showdown.Converter();
  const html = converter.makeHtml(source);
  return html;
};
