function editJptvMedia() {
  editMessageMedia({
    chat_id: '@' + jptvUsername,
    message_id: 595,
    media: {
      type: "video",
      media: "BAACAgEAAxkBAAIFbGFXYvsrAojI1sEaGbDG0C3NwhviAAJEAgAC8AO4RjRF_Qse3ydvIQQ", // file id
      caption: "#Byplayers3：#名配角的森林100日 ep12 #完结" // caption
    }
  })
}

function setJptvMediaList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('JPTV_MEDIA_LIST', JSON.stringify(JPTV_MEDIA_LIST));
}

function getJptvMediaList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var data = scriptProperties.getProperty('JPTV_MEDIA_LIST');
  return JSON.parse(data);
}

function updateJptvTelegraph() {
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      access_token: telegraphAccessToken,
      title: "乙醚的日剧片单",
      autor: "乙醚",
      // author_url: "https://t.me/ethersdaily", 
      content: JSON.stringify(jptv2node())
    }),
  }
  var response = UrlFetchApp.fetch(telegraphBaseURL, options);
  console.log(response.getContentText())
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
    text += '*' + i + '*\n'
    if (Array.isArray(data[i])) {
      data[i].forEach(item => text += '  ' + item + '\n')
    } else {
      for (j in data[i]) {
        data[i][j].forEach(item => text += '  ' + item + '\n')
      }
    }
  }
  text += '\n'
  return text;
}
