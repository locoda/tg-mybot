function fetch(msg) {
  // Try to get URL from the plain text  
  const report = checkReportNecessary(msg);
  try { 
    var url = getUrlFromText(msg.text);
  } catch(error) {
    try {
      url = getUrlFromText(msg.reply_to_message.text);
      if (report) {
        var msgToDel = msg;
      }
      msg = msg.reply_to_message;
    } catch (error) {
      console.error(error);
      if (report) {
        sendMessage({
          chat_id: msg.chat.id,
          text: "消息内无链接",
          reply_to_message_id: msg.message_id,
        });
        return;
      }
    }
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
    }
  } else if (url.includes('vm.tiktok.com') || (url.includes('www.tiktok.com') && url.includes('/video'))) {
    try {
      processTiktok(msg, url);
    } catch (error) {
      console.error(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "TikTok获取出错啦",
        reply_to_message_id: msg.message_id,
      });
    }
  } else if (url.includes('b23.tv') || url.includes('www.bilibili.com')) {
    try {
      processBilibili(msg, url);
    } catch (error) {
      console.error(error);
      sendMessage({
        chat_id: msg.chat.id,
        text: "哔哩哔哩获取出错啦",
        reply_to_message_id: msg.message_id,
      });
    }
  }else {
    // No URL is valid for fetch
    if (report) {
      sendMessage({
        chat_id: msg.chat.id,
        text: "无可用链接",
        reply_to_message_id: msg.message_id,
      });
    }
  }
  if (msgToDel) {
    deleteMessage({
      chat_id: msgToDel.chat.id,
      message_id: msgToDel.message_id
    });
  }
}


function checkReportNecessary(msg) {
  return msg.hasOwnProperty('entities') && msg.entities[0].type === 'bot_command';
}