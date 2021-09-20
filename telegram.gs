function sendMessage(data) {
  var result = request('sendMessage', data);
  Logger.log(result);
}

function sendPhoto(data) {
  var result = request('sendPhoto', data);
  Logger.log(result);
}

function sendVideo(data) {
  var result = request('sendVideo', data);
  Logger.log(result);
}

function sendAnimation(data) {
  var result = request('sendAnimation', data);
  Logger.log(result);
}

function sendAudio(data) {
  var result = request('sendAudio', data);
  Logger.log(result);
}

function sendMediaGroup(data) {
  var result = request('sendMediaGroup', data);
  Logger.log(result);
}

function sendDocument(data) {
  var result = request('sendDocument', data);
  Logger.log(result);
}

function getMyCommands() {
  var result = request('getMyCommands');
  Logger.log(result);
}

function getWebhookInfo() {
  var result = request('getWebhookInfo');
  Logger.log(result);
}

function setWebhook() {
  var result = request('setWebhook', {
    url: telegramWebhookUrl,
  });
  Logger.log(result);
}

function deleteWebhook() {
  var result = request('deleteWebhook', {
    drop_pending_updates: true
  });
  Logger.log(result);
}


function getUpdates() {
  var result = request('getUpdates');
  Logger.log(result);
}

function request(api, data) {
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  var response = UrlFetchApp.fetch(telegramUrl + api, options);
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  return false;
}