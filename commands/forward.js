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
    text: "_\\> " + cleanMarkdown(msg.reply_to_message.text) + "_" + line + msg.text,
    parse_mode: "MarkdownV2",
  });
}
