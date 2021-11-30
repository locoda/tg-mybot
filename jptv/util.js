// ffmpeg memos: 
// Covert video only to x265: ffmpeg -i in.mp4 -acodec copy -c:v libx265 -crf 21 out.mp4
// Convert audio only to aac: ffmpeg -i in.mp4 -vcodec copy -c:a aac out.mp4
// ffmpeg -i in.mp4 -c:v libx265 -crf 21 -c:a aac out.mp4
// loop+rename example: for i in *.mp4; do ffmpeg -i "$i" -c:v libx265 -crf 21 -preset fast -c:a aac "#桃与梅 ep${${i#【*【}%%】*}.mp4"; done

function editJptvMedia() {
  editMessageMedia({
    chat_id: '@' + jptvUsername,
    message_id: 722,
    media: {
      type: "video",
      media: "BAACAgEAAxkBAAILfWGEH4w--sfI1Okp_BFwLTkFpQZjAAJZAgACBTEgROj7ZoPiREm-IQQ", // file id
      caption: "这是恋爱！～#不良少年与白手杖女孩～ ep05" // caption
    }
  })
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

function insertJptvPrivate(channel_post) {
  if (!channel_post.hasOwnProperty("video")) {
    // not a video file post
    return;
  }
  // checkJptvCaptionInList(channel_post.caption);
  var data = {
    message_id: channel_post.message_id,
    text: channel_post.caption,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvInsertPrivateApi, options);
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
        tag: "a",
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
    node.children.push(' （' + item.year + '）')
  }
  if (item.douban) {
    node.children.push("  🔗")
    let url = "https://movie.douban.com/subject/" + item.douban
    let douban = {
      tag: "i",
      children: [
        {
          tag: "a",
          attrs: {
            href: url
          },
          children: ["豆瓣"],
        }
      ]
    }
    node.children.push(douban);
  }
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
