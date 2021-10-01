function sendMessage(data) {
  request("sendMessage", data);
}

function forwardMessage(data) {
  request("forwardMessage", data);
}

function sendPhoto(data) {
  request("sendPhoto", data);
}

function sendVideo(data) {
  request("sendVideo", data);
}

function sendVideoFile(data) {
  requestFile("sendVideo", data);
}

function sendAnimation(data) {
  request("sendAnimation", data);
}

function sendAudio(data) {
  request("sendAudio", data);
}

function sendMediaGroup(data) {
  request("sendMediaGroup", data);
}

function sendDocument(data) {
  request("sendDocument", data);
}

function editMessageText(data) {
  request("editMessageText", data);
}

function editMessageMedia(data) {
  request("editMessageMedia", data);
}

function editMessageReplyMarkup(data) {
  request("editMessageReplyMarkup", data);
}

function deleteMessage(data) {
  request("deleteMessage", data);
}

function answerCallbackQuery(data) {
  request("answerCallbackQuery", data);
}

function getMyCommands() {
  request("getMyCommands");
}

function getWebhookInfo() {
  request("getWebhookInfo");
}

function setWebhook() {
  request("setWebhook", {
    url: telegramWebhookUrl,
  });
}

function deleteWebhook() {
  request("deleteWebhook", {
    drop_pending_updates: true,
  });
}

function getUpdates() {
  request("getUpdates");
}

function request(api, data) {
  console.log(data);
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(telegramUrl + api, options);
  if (response.getResponseCode() == 200) {
    var result = JSON.parse(response.getContentText());
    console.log(result);
    return result;
  }
  return false;
}

function requestFile(api, data) {
  console.log(data);
  var options = {
    method: "post",
    payload: data,
  };
  var response = UrlFetchApp.fetch(telegramUrl + api, options);
  if (response.getResponseCode() == 200) {
    var result = JSON.parse(response.getContentText());
    console.log(result);
    return result;
  }
  return false;
}
