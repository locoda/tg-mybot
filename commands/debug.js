function debug(update) {
  var msg = update.message;
  if (msg.hasOwnProperty("reply_to_message")) {
    return JSON.stringify(msg.reply_to_message);
  }
  return JSON.stringify(update);
}

function forward(msg) {
  forwardMessage({
    chat_id: telegramMasterId,
    from_chat_id: msg.chat.id,
    message_id: msg.message_id,
  });
}

function reply(msg) {
  if (!shouldReply(msg)) {
    return;
  }
  sendMessage({
    chat_id: msg.reply_to_message.forward_from.id,
    text:
      "_\\> " +
      cleanMarkdown(msg.reply_to_message.text) +
      "_" +
      line +
      msg.text,
    parse_mode: "MarkdownV2",
  });
}

function getVideoFileId(msg) {
  if (msg.chat.id !== telegramMasterId || !msg.hasOwnProperty("video")) {
    // not from master or not a video file post
    return;
  }
  sendMessage({
    chat_id: msg.chat.id,
    text: msg.video.file_name + "\n\n" + msg.video.file_id,
    reply_to_message_id: msg.message_id,
  });
}
