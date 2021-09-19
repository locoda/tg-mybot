function processWeibo(msg, url) {
  var options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
    var html = response.getContentText();
    var data = html.split("$render_data = ")[1];
    var data = data.split("[0]")[0];
    var data = JSON.parse(data)[0];
    var caption = constructWeiboText(data);
    if (checkWeiboHasPhoto(data)) {
      photo_data = getWeiboPhoto(data);
      sendWeiboPhoto(msg, photo_data, caption, url);
    } else if (checkWeiboHasVideo(data, caption)) {
      sendVideo({
        chat_id: msg.chat.id,
        caption: caption,
        parse_mode: 'MarkdownV2',
        video: getWeiboVideo(data),
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: url,
          }]],
        },
      });
    } else {
      sendMessage({
        chat_id: msg.chat.id,
        text: caption,
        parse_mode: 'MarkdownV2',
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: url,
          }]],
        },
      });
    }
  } else {
    sendMessage({
      chat_id: msg.chat.id,
      text: "获取出错啦",
      reply_to_message_id: msg.message_id,
    });
    return;
  }
}

function constructWeiboText(data) {
  const htmlTags = new RegExp("<[^>]*>", "g");
  const text = data.status.text.replace(htmlTags, "");
  if (data.status.hasOwnProperty("retweeted_status")) {
    const retweeted_text = data.status.retweeted_status.text.replace(
      htmlTags,
      ""
    );
    var caption = (
      "@" +
      cleanMarkdown(data.status.user.screen_name) +
      ": " +
      cleanMarkdown(text) +
      "*//@" +
      cleanMarkdown(data.status.retweeted_status.user.screen_name) +
      ": " +
      cleanMarkdown(retweeted_text) + '*'
    );
  } else {
    var caption = "@" + data.status.user.screen_name + ": " + cleanMarkdown(text);
  }
  return caption;
}

function checkWeiboHasPhoto(data) {
  if (data.status.hasOwnProperty("pics")) {
    return true;
  }
  if (!data.status.hasOwnProperty("retweeted_status")) {
    return false;
  }
  return data.status.retweeted_status.hasOwnProperty("pics");
}

function getWeiboPhoto(data) {
  if (data.status.hasOwnProperty("pics")) {
    var pics = data.status.pics;
  } else {
    var pics = data.status.retweeted_status.pics;
  }
  var response = [];
  pics.forEach((pic) =>
    response.push([pic.large.url, pic.large.geo.width, pic.large.geo.height])
  );
  return response;
}

function sendWeiboPhoto(msg, data, caption, url) {
  var media_data = [];
  data.forEach((pic) =>
    media_data.push({
      type: getWeiboPhotoMediaType(pic),
      media: pic[0],
    })
  );
  if (checkWeiboSendOne(media_data)) {
    sendWeiboPhotoOne(msg, media_data[0], caption, url);
  } else {
    media_data = media_data.filter((media) => media.type === "photo");
    media_data[0].caption = caption + "\n[🔗原文链接](" + url + ")";
    media_data[0].parse_mode= 'MarkdownV2';
    if (checkWeiboSendOne(media_data)) {
      sendWeiboPhotoOne(msg, media_data[0], caption, url);
    }
    if (media_data.length > 10) {
      media_data = media_data.slice(0, 10);
    }
    sendMediaGroup({
      chat_id: msg.chat.id,
      media: media_data,
      reply_to_message_id: msg.message_id,
    });
  }
}

function getWeiboPhotoMediaType(pic) {
  if (pic[0].endsWith(".gif")) {
    return "animation";
  } else if (pic[1] * 2 < pic[2]) {
    return "document";
  } else {
    return "photo";
  }
}

function checkWeiboSendOne(data) {
  return (
    data.length === 1 ||
    data[0].type === "animation" ||
    data[0].type === "document"
  );
}

function sendWeiboPhotoOne(msg, pic, caption, url) {
  if (pic.type === "animation") {
    sendAnimation({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: 'MarkdownV2',
      animation: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: url,
          }]],
        },
    });
  } else if (pic.type === "document") {
    sendDocument({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: 'MarkdownV2',
      document: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: url,
          }]],
        },
    });
  } else {
    sendPhoto({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: 'MarkdownV2',
      photo: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: url,
          }]],
        },
    });
  }
}

function checkWeiboHasVideo(data) {
  if (data.status.hasOwnProperty("page_info")) {
    return data.status.page_info.type === "video";
  }
  if (data.status.hasOwnProperty("retweeted_status")) {
    return data.status.retweeted_status.page_info.type === "video";
  }
}

function getWeiboVideo(data) {
  if (data.status.hasOwnProperty("page_info")) {
    var media = data.status.page_info.media_info;
  } else {
    var media = data.status.retweeted_status.page_info.media_info;
  }
  return media.stream_url_hd;
}