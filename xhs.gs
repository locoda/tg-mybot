const paramReg = /\?.*/g

function processXhs(msg, url) {
  var data = getXhsData(url);
  var caption = getXhsCaption(data);
  Logger.log(JSON.stringify(data));
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
      sendXhsFinal(msg, data, caption, '\n_⬇️（视频获取失败，请原文查看）_');
    }
  } else if (xhsCheckSendOne(data)) {
    sendXhsFinal(msg, data, caption, '');  
  } else {
    try {
    var media_data = [];
    data.imageList.forEach((img) =>
      media_data.push({
        type: "photo",
        media: "https:" + img.url,
      })
    );
    media_data[0].caption =
      caption +
      "[🔗原文链接](https://www.xiaohongshu.com/discovery/item/" +
      data.id +
      ")";
    media_data[0].parse_mode = "MarkdownV2";
    if (media_data.length > 10) {
      media_data = media_data.slice(0, 10);
    }
    Logger.log(media_data);
    sendMediaGroup({
      chat_id: msg.chat.id,
      media: media_data,
      reply_to_message_id: msg.message_id,
    });
    } catch (error) {
      console.error(error);
      sendXhsFinal(msg, data, caption, '\n_⬇️（多图获取失败，请原文查看）_');
    }
  }
}

function getXhsData(url) {
  var options = {
    headers: {
      "User-Agent": xhsUA,
    },
    // Stop redirect, we need cookie in second reqeust
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
  // data in plain html
  var data = html.split("window.__INITIAL_SSR_STATE__=")[1];
  data = data.split("</script>")[0].replace("undefined", '"undefined"');
  // return main note information only
  return JSON.parse(data).NoteView.noteInfo;
}

function xhsCheckSendVideo(data) {
  return data.hasOwnProperty("video");
}

function xhsCheckSendOne(data) {
  return data.imageList.length === 1;
}

function getXhsCaption(data) {
  return "*" + cleanMarkdown(data.title) + "*\n\n" + cleanMarkdown(data.desc);
}

function sendXhsFinal(msg, data, caption, extra_caption) {
  //Try to send cover photo
  try {
    sendPhoto({
        chat_id: msg.chat.id,
        caption: caption + extra_caption,
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
  } catch (error) {
    console.error(error);
    // Try cover photo without params again
    try {
    sendPhoto({
        chat_id: msg.chat.id,
        caption: caption + extra_caption,
        photo: "https:" + data.cover.url.replace(paramReg, ''),
        parse_mode: "MarkdownV2",
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
    } catch (error) {
      // Cannot success, we send plain text
      console.error(error);
      if (!extra_caption) {
        extra_caption = '\n_⬇️（图片获取失败，请原文查看）_'
      }
      sendMessage({
          chat_id: msg.chat.id,
          text: caption + extra_caption,
          parse_mode: "MarkdownV2",
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
  }
}