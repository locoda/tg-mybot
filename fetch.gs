function fetch(msg) {
  // Check if the message is a reply, if it is, include the replied message
  if (msg.hasOwnProperty("reply_to_message")) {
    var text = msg.text + " " + msg.reply_to_message.text;
  } else {
    var text = msg.text;
  }
  // Try to get URL from the plain text  
  try { 
    var url = getUrlFromText(text);
  } catch(error) {
    console.error(error);
    sendMessage({
      chat_id: msg.chat.id,
      text: "消息内无链接",
      reply_to_message_id: msg.message_id,
    });
    return;
  }
  // Check URL and decide process method
  if (url.includes("m.weibo.cn") || url.includes("weibo.com") || url.includes("share.api.weibo.cn")) {
    try {
      processWeibo(msg, url);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "小红书获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else if (url.includes('bbs.nga.cn') || url.includes('nga.178.com') || url.includes('ngabbs.com')) {
    try {
      processNga(msg, url);
    } catch (error) {
      console.error(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "NGA获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else if (url.includes('vm.tiktok.com')) {
    try {
      processTiktok(msg, url);
    } catch (error) {
      console.error(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "TikTok获取出错啦",
        reply_to_message_id: msg.message_id,
      });
      return;
    }
  } else {
    // No URL is valid for fetch
    sendMessage({
      chat_id: msg.chat.id,
      text: "无可用链接",
      reply_to_message_id: msg.message_id,
    });
    return;
  }
}
