// ffmpeg memos: 
// Covert video only to x265: ffmpeg -i in.mp4 -acodec copy -c:v libx265 -crf 21 out.mp4
// Convert audio only to aac: ffmpeg -i in.mp4 -vcodec copy -c:a aac out.mp4
// ffmpeg -i in.mp4 -c:v libx265 -crf 21 -c:a aac out.mp4
// loop+rename example: for i in *.mp4; do ffmpeg -i "$i" -c:v libx265 -crf 21 -preset fast -c:a aac "#桃与梅 ep${${i#【*【}%%】*}.mp4"; done

function editJptvMedia() {
  editMessageMedia({
    chat_id: '@' + jptvUsername,
    message_id: 677,
    media: {
      type: "video",
      media: "BAACAgEAAxkBAAIGJGFY3BFy4BdFSLn4I81VbkSp7aDLAALkAQACRcXIRlAtjprugjUIIQQ", // file id
      caption: "#我的姐姐 ep01" // caption
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
      title: "乙醚的日剧私藏片单",
      author_name: "乙醚的日剧私藏",
      author_url: "https://t.me/etherjptv",
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
  var tag = caption.split(' ')[0].replaceAll('#', '');
  if (!getJptvMediaListString().includes(tag)) {
    sendMessage({
      chat_id: telegramMasterId,
      text: "未在片单中找到 " + tag + '\n来自：' + caption,
    });
    return false;
  }
  return true;
}

function parseJptvItemNode(item) {
  var node = {
    tag: "p",
    children: [],
  }
  if (item.firstEp) {
    let url = "https://t.me/" + jptvUsername + "/" + item.firstEp;
    node.children.push(
      {
        tag:"a",
        attrs: {
          href: url
        },
        children: [item.name],
      }
    )
  } else {
    node.children.push(item.name)
  }
  if (item.year) {
    node.children.push(' （'+item.year+'）')
  }
  // console.log(node);
  return node;
}

function jptv2node() {
  var data = getJptvMediaList();
  data = data["片单"];

  var nodes = []
  for (i in data) {
    node = {
      tag: "h3",
      children: [i]
    }
    nodes.push(node);
    if (Array.isArray(data[i])) {
      data[i].forEach(item => nodes.push(parseJptvItemNode(item)))
    } else {
      for (j in data[i]) {
        data[i][j].forEach(item => nodes.push(parseJptvItemNode(item)))
      }
    }
  }
  return nodes;
}

function parseJptvItemMd(item) {
  if (item.firstEp) {
    text = '[' + cleanMarkdown(item.name) + '](' + "https://t.me/" + jptvUsername + "/" + item.firstEp + ') '
  } else {
    text = item.name
  }
  if (item.year) {
    text += '（' + item.year + '）'
  }
  return text;
}

function jptv2md() {
  var data = getJptvMediaList();
  data = data["片单"];
  var text = "";

  for (i in data) {
    text += '*' + cleanMarkdown(i) + '*\n'
    if (Array.isArray(data[i])) {
      list = data[i].map(item => parseJptvItemMd(item))
      text += list.join('\n')
    } else {
      for (j in data[i]) {
        list = data[i][j].map(item => parseJptvItemMd(item))
        text += list.join('\n')
      }
    }
    text += '\n'
  }
  return text;
}
