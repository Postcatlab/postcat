const markdownIt = require('markdown-it');

module.exports = source => {
  let md = new markdownIt();
  const html = md.render(source);
  return html;
};
