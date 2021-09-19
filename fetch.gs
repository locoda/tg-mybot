function fetch(msg) {
  if (msg.hasOwnProperty("reply_to_message")) {
    var text = msg.text + " " + msg.reply_to_message.text;
  } else {
    var text = msg.text;
  }
  var url = getUrlFromText(text);
  if (url.includes("m.weibo.cn") || url.includes("weibo.com")) {
    var url = getUrlFromText(text);
    url = url.replace('weibo.com', 'm.weibo.cn');
    try {
      processWeibo(msg, url);
    } catch (error) {
      Logger.log(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "微博获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else if (url.includes("xhslink.com")) {
     try {
      processXhs(msg, url);
    } catch (error) {
      Logger.log(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "小红书获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else if (url.includes('bbs.nga.cn') || url.includes('nga.178.com')) {
    try {
      processNga(msg, url);
    } catch (error) {
      Logger.log(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "NGA获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else {
    sendMessage({
      chat_id: msg.chat.id,
      text: "无可用链接",
      reply_to_message_id: msg.message_id,
    });
    return;
  }
}
