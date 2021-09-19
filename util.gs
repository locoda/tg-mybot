function getUrlFromText(text) {
  var regExp = new RegExp("(http|ftp|https)://[A-Za-z0-9./?=]*");
  var url = regExp.exec(text)[0];
  return url;
}

const markdownChar = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];

function cleanMarkdown(text) {
  markdownChar.forEach(ch => text = text.replaceAll(ch, '\\'+ch));
  return text;
}
