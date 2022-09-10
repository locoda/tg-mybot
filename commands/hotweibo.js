function hotweibo(msg) {
  var params = msg.text.split(" ");
  if (params.length > 1) {
    var category = params[1];
  }
  sendMessage({
    chat_id: msg.chat.id,
    text: fetchHotWeibo(category),
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
    reply_to_message_id: msg.message_id,
  });
}
