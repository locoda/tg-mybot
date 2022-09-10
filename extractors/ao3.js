function processAO3(msg, url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      Cookie: ao3Cookie,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  var title = html.split("<title>")[1];
  title = title.split("</title>")[0].trim();
  var content = html.split("<!-- BEGIN section where work skin applies -->")[1];
  content = content.split("<!-- END work skin -->")[0];
  var decode = XmlService.parse(content);
  var nodes = parseDOMContent(decode.getContent(0), "AO3");
  var telegraph = updateArchiveTelegraph(
    "Archive Of Our Own",
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

  const numReg = /\d+/g;
  const workId = url.match(numReg)[0];
  var html = UrlFetchApp.fetch(
    "https://archiveofourown.org/downloads/" + workId + "/" + workId + ".html"
  ).getBlob();
  sendDocumentFile({
    chat_id: String(telegramMasterId),
    caption: title,
    document: html,
    reply_to_message_id: msg.message_id,
  });
}
