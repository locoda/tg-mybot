function processXhs(msg, url) {
  var data = getXhsData(url);
  var caption = getXhsCaption(data);
  if (xhsCheckSendVideo(data)) {
    try {
      sendVideo({
        chat_id: msg.chat.id,
        caption: caption,
        parse_mode: "MarkdownV2",
        video: data.video.url,
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "原文链接",
                url: "https://www.xiaohongshu.com/discovery/item/" + data.id,
              },
            ],
          ],
        },
      });
    } catch {
      sendPhoto({
        chat_id: msg.chat.id,
        caption: caption + '\n _⬇️（视频获取失败，请原文查看）_',
        parse_mode: "MarkdownV2",
        photo: "https:" + data.cover.url,
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "原文链接",
                url: "https://www.xiaohongshu.com/discovery/item/" + data.id,
              },
            ],
          ],
        },
      });
    }
  } else if (xhsCheckSendOne(data)) {
    sendPhoto({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: "MarkdownV2",
      photo: "https:" + data.cover.url,
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: "https://www.xiaohongshu.com/discovery/item/" + data.id,
            },
          ],
        ],
      },
    });
  } else {
    var media_data = [];
    data.imageList.forEach((img) =>
      media_data.push({
        type: "photo",
        media: "https:" + img.url,
      })
    );
    media_data[0].caption =
      caption +
      "\n[🔗原文链接](https://www.xiaohongshu.com/discovery/item/" +
      data.id +
      ")";
    media_data[0].parse_mode = "MarkdownV2";
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

function getXhsData(url) {
  var options = {
    headers: {
      "User-Agent": xhsUA,
    },
    followRedirects: false,
  };
  var response = UrlFetchApp.fetch(url, options);
  url = response.getAllHeaders().Location;
  options = {
    headers: {
      cookie: xhsCookie,
      "User-Agent": xhsUA,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  var data = html.split("window.__INITIAL_SSR_STATE__=")[1];
  data = data.split("</script>")[0].replace("undefined", '"undefined"');
  return JSON.parse(data).NoteView.noteInfo;
}

function xhsCheckSendVideo(data) {
  return data.hasOwnProperty("video");
}

function xhsCheckSendOne(data) {
  return data.imageList.length === 1;
}

function getXhsCaption(data) {
  return "*" + cleanMarkdown(data.title) + "*\n" + cleanMarkdown(data.desc);
}
