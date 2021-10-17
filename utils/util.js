function shouldForward(msg) {
  return (
    !isBotCommand(msg) &&
    !isWhiteList(msg) &&
    (isPrivateChat(msg) || isMentioned(msg) || isReplied(msg))
  );
}

function shouldReply(msg) {
  return msg.chat.id === telegramMasterId && isForwarded(msg);
}

function isWhiteList(msg) {
  return telegramGroupWhiteList.includes(msg.chat.id);
}

function isBotCommand(msg) {
  return (
    msg.hasOwnProperty("entities") && msg.entities[0].type === "bot_command"
  );
}

function isPrivateChat(msg) {
  return msg.chat.type === "private";
}

function isMentioned(msg) {
  return (
    msg.hasOwnProperty("text") &&
    msg.text.includes(botName) &&
    msg.hasOwnProperty("entities") &&
    msg.entities.some((entity) => entity.type === "mention")
  );
}

function isReplied(msg) {
  return (
    msg.hasOwnProperty("reply_to_message") &&
    "@" + msg.reply_to_message.from.username === botName
  );
}

function isForwarded(msg) {
  return (
    msg.hasOwnProperty("reply_to_message") &&
    msg.reply_to_message.hasOwnProperty("forward_from")
  );
}

function getUrlFromText(text) {
  var regExp = new RegExp("(http|ftp|https)://[A-Za-z0-9./?=_@]*");
  var url = regExp.exec(text)[0];
  return url;
}

const markdownChar = [
  "_",
  "*",
  "[",
  "]",
  "(",
  ")",
  "~",
  "`",
  ">",
  "#",
  "+",
  "-",
  "=",
  "|",
  "{",
  "}",
  ".",
  "!",
];

function cleanMarkdown(text) {
  markdownChar.forEach((ch) => (text = text.replaceAll(ch, "\\" + ch)));
  return text;
}

const line = "\n\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\n";
