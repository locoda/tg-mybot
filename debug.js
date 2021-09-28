function debug(update) {
  var msg = update.message;
  if (msg.hasOwnProperty("reply_to_message")) {
    return JSON.stringify(msg.reply_to_message);
  }
  return JSON.stringify(update);
}
