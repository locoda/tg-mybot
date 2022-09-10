function processLofter(msg, url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  var title = html.split("<title>")[1];
  title = title.split("</title>")[0].trim();
  if (html.includes("txtcont")) {
    var content = html.split('<div class="txtcont">')[1];
    content = content.split("</div>")[0];
  } else {
    var content = html.split('<div class="text">');
    content = content[content.length - 1];
    content = content.split("</div>")[0];
  }
  content = content.replaceAll("&nbsp;", "  ").replaceAll("&mdash;", "-");
  var decode = XmlService.parse('<div class="text">' + content + "</div>");
  var nodes = parseDOMContent(decode.getContent(0), "LOFTER");
  var telegraph = updateArchiveTelegraph(
    "Lofter",
    title,
    url,
    nodes.children,
    telegraphArchiveAccessToken
  );
  sendMessage({
    chat_id: msg.chat.id,
    text: title + "\n" + telegraph,
    reply_to_message_id: msg.message_id,
  });
}
