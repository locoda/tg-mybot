function doGet(e) {
  return HtmlService.createHtmlOutput("乙醚的替身使者");
  // return HtmlService.createHtmlOutputFromFile('index');
}

function doPost(e) {
  if (e.postData.type == "application/json") {
    var update = JSON.parse(e.postData.contents);
    // Handle Messages
    if (update.hasOwnProperty("message")) {
      var msg = update.message;
      console.info(msg);
      if (isBotCommand(msg)) {
        handleBotCommand(update);
      } else if (isWhiteList(msg)) {
        // auto fetch for whitelist chats
        fetch(msg);
        // ether's reply
        reply(msg);
      } else if (shouldForward(msg)) {
        // forward non-whitelisted regular message
        forward(msg);
      }
      return;
    }

    // Handle Channel Updates
    if (update.hasOwnProperty("channel_post")) {
      var channel_post = update.channel_post;
      console.info(channel_post);
      handleChannelPost(channel_post);
      return;
    }

    // Fall though service messages/updates
    console.warn(update);
    return;
  }
}

function handleBotCommand(update) {
  var msg = update.message;
  var msgSplitted = msg.text.split(" ");
  if (isPrivateChat(msg)) {
    var command = msgSplitted[0].replace("/", "").split("@")[0];
  } else {
    var command = msgSplitted[0].replace("/", "").replace(botName, "");
  }
  switch (command) {
    case "start":
      sendMessage({
        chat_id: msg.chat.id,
        text: "是乙醚的替身，任何疑问/建议/聊天请直接找 @locoda",
      });
      break;
    case "fetch":
      fetch(msg);
      break;
    case "debug":
      sendMessage({
        chat_id: msg.chat.id,
        text: debug(update),
        reply_to_message_id: msg.message_id,
        disable_web_page_preview: true,
      });
      break;
    // Private Only Commands
    case "j":
      jptv(msg);
      break;
  }
  return;
}

function handleChannelPost(channel_post) {
  switch (channel_post.chat.username) {
    case jptvUsername:
      insertJptv(channel_post)
      break;
  }
}
