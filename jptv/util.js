function editJptvMedia() {
  editMessageMedia({
    chat_id: '@' + jptvUsername,
    message_id: 0, // message id
    media: {
      type: "video",
      media: "", // file id
      caption: "" // caption
    }
  })
}

function setJptvMediaList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('JPTV_MEDIA_LIST', JSON.stringify(JPTV_MEDIA_LIST));
}

function getJptvMediaListString() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('JPTV_MEDIA_LIST');
}

function getJptvMediaList() {
  return JSON.parse(getJptvMediaListString());
}

function updateJptvTelegraph() {
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      access_token: telegraphAccessToken,
      title: "乙醚的日剧片单",
      author_name: "乙醚",
      author_url: "https://t.me/ethersdaily",
      content: JSON.stringify(jptv2node())
    }),
  }
  var response = UrlFetchApp.fetch(telegraphBaseURL, options);
  console.log(response.getContentText())
}

function insertJptv(channel_post) {
  if (!channel_post.hasOwnProperty("video")) {
    // not a video file post
    return;
  }
  checkJptvCaptionInList(channel_post.caption);
  var data = {
    message_id: channel_post.message_id,
    text: channel_post.caption,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvInsertApi, options);
  try {
    var result = JSON.parse(response.getContentText());
  } catch (error) {
    console.error(error);
    return response.getContentText();
  }
  console.log(result);
  return result;
}

function updateJptv(channel_post) {
  if (!channel_post.hasOwnProperty("video")) {
    // not a video file post
    return;
  }
  checkJptvCaptionInList(channel_post.caption);
  var data = {
    message_id: channel_post.message_id,
    text: channel_post.caption,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvUpdateApi, options);
  try {
    var result = JSON.parse(response.getContentText());
  } catch (error) {
    console.error(error);
    return response.getContentText();
  }
  console.log(result);
  return result;
}

function checkJptvCaptionInList(caption) {
  var tag = caption.split(' ')[0];
  if (!getJptvMediaListString().includes(tag)) {
    sendMessage({
      chat_id: telegramMasterId,
      text: "未在片单中找到 " + tag,
    });
    return false;
  }
  return true;
}

function jptv2node() {
  var data = getJptvMediaList();
  data = data["片单"];

  var nodes = [{ tag: "a", attrs: { "href": "https://t.me/etherjptv" }, children: ["频道链接"] }, { tag: "br" }]
  for (i in data) {
    node = {
      tag: "h3",
      children: [i]
    }
    nodes.push(node);
    if (Array.isArray(data[i])) {
      data[i].forEach(item => nodes.push({
        tag: "p",
        children: [item]
      }))
    } else {
      for (j in data[i]) {
        data[i][j].forEach(item => nodes.push({
          tag: "p",
          children: [item]
        }))
      }
    }
  }
  return nodes;
}

function jptv2md() {
  var data = getJptvMediaList();
  data = data["片单"];
  var text = "";

  for (i in data) {
    text += '*' + cleanMarkdown(i) + '*\n'
    if (Array.isArray(data[i])) {
      data[i].forEach(item => text += '  ' + cleanMarkdown(item) + '\n')
    } else {
      for (j in data[i]) {
        data[i][j].forEach(item => text += '  ' + cleanMarkdown(item) + '\n')
      }
    }
    text += '\n'
  }
  return text;
}
