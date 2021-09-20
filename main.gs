function doGet(e) {
  return HtmlService.createHtmlOutput('乙醚的替身使者');
}

function doPost(e) {
  if(e.postData.type == "application/json") {
    var update = JSON.parse(e.postData.contents);
    Logger.log(update);
    var msg = update.message;
    if (msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command') {
      handleBotCommand(update);
    } 
  }
}

function handleBotCommand(update) {
    var msg = update.message;
    var msgSplitted = msg.text.split(' ');
    var command = msgSplitted[0].replace('/','').replace(botName,'');
    switch (command) {
      case 'start':
        sendMessage({
          chat_id: msg.chat.id,
          text: '是乙醚的替身，任何疑问/建议/聊天请直接找 @locoda'
        })
        break;
      case 'fetch':
        fetch(msg);
        break;
      case 'debug':
        sendMessage({
          chat_id: msg.chat.id,
          text: debug(update),
          reply_to_message_id: msg.message_id,
          disable_web_page_preview: true
        })
        break;
    }
    return;
}

function debug(update) {
  var msg = update.message;
  if (msg.hasOwnProperty('reply_to_message')) {
    return JSON.stringify(msg.reply_to_message)
  }
  return JSON.stringify(update);
}
