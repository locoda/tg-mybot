function doGet(e) {
  return ContentService.createTextOutput("乙醚的机器人～");
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
        // get video id
        getVideoFileId(msg);
      } else if (shouldForward(msg)) {
        // forward non-whitelisted regular message
        forward(msg);
      }
      return;
    }

    // Handle Channel Posts
    if (update.hasOwnProperty("channel_post")) {
      var channel_post = update.channel_post;
      console.info(channel_post);
      handleChannelPost(channel_post);
      return;
    }

    if (update.hasOwnProperty("edited_channel_post")) {
      var channel_post = update.edited_channel_post;
      console.info(channel_post);
      handleEditedChannelPost(channel_post);
      return;
    }

    if (update.hasOwnProperty("callback_query")) {
      var callback_query = update.callback_query;
      console.info(callback_query);
      handleCallbackQuery(callback_query);
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
      start(msg);
      break;
    case "fetch":
      fetch(msg);
      break;
    case "guess":
      guess(msg);
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
    case "jpls":
      jpls(msg);
      break;
  }
  return;
}

function handleChannelPost(channel_post) {
  switch (channel_post.chat.id) {
    case jptvId:
      insertJptv(channel_post);
      break;
    case jptvPrivateId:
      insertJptvPrivate(channel_post);
      break;
  }
}

function handleEditedChannelPost(channel_post) {
  switch (channel_post.chat.id) {
    case jptvId:
      updateJptv(channel_post);
      break;
  }
}

function handleCallbackQuery(callback_query) {
  let identifier = callback_query.data.split(":")[0]
  switch (identifier) {
    case "jpls":
      handleJplsCallback(callback_query);
      break;
    case "jptv":
      handleJptvCallback(callback_query);
      break;
  }
}