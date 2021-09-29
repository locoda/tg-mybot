function processWeibo(msg, url) {
  url = parseWeiboUrl(url);
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
    var html = response.getContentText();
    var data = html.split("$render_data = ")[1];
    var data = data.split("[0]")[0];
    var data = JSON.parse(data)[0];
    var caption = constructWeiboCaption(data);
    if (checkWeiboHasPhoto(data)) {
      photo_data = getWeiboPhoto(data);
      sendWeiboPhoto(msg, photo_data, caption, url);
    } else if (checkWeiboHasVideo(data, caption)) {
      try {
        sendVideo({
          chat_id: msg.chat.id,
          caption: caption,
          parse_mode: "MarkdownV2",
          video: getWeiboVideo(data),
          reply_to_message_id: msg.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "原文链接",
                  url: url,
                },
              ],
            ],
          },
        });
      } catch (error) {
        console.error(error);
        try {
          var options = {
            headers: {
              "User-Agent": macChromeUserAgent,
            },
          };
          var response = UrlFetchApp.fetch(getWeiboVideo(data), options);
          sendVideoFile({
            chat_id: String(msg.chat.id),
            caption: caption,
            parse_mode: "MarkdownV2",
            video: response.getBlob(),
            reply_to_message_id: String(msg.message_id),
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: "原文链接",
                    url: url,
                  },
                ],
              ],
            }),
          });
        } catch (error) {
          console.error(error);
          sendWeiboFinal(
            msg,
            data,
            url,
            caption,
            "\n\n_⬇️（视频获取失败，请原文查看）_"
          );
        }
      }
    } else {
      sendMessage({
        chat_id: msg.chat.id,
        text: caption,
        parse_mode: "MarkdownV2",
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "原文链接",
                url: url,
              },
            ],
          ],
        },
      });
    }
  } else {
    sendMessage({
      chat_id: msg.chat.id,
      text: "微博读取出错啦",
      reply_to_message_id: msg.message_id,
    });
    return;
  }
}

function parseWeiboUrl(url) {
  if (url.includes("m.weibo.cn")) {
    return url;
  } else if (url.includes("weibo.com")) {
    return url.replace("weibo.com", "m.weibo.cn");
  } else if (url.includes("share.api.weibo.cn")) {
    var id = url.split("weibo_id=")[1];
    return "https://m.weibo.cn/status/" + id;
  }
}

function constructWeiboCaption(data) {
  var text = data.status.text.replaceAll("<br />", "\n");
  const htmlTags = new RegExp("<[^>]*>", "g");
  text = text.replaceAll(htmlTags, "");
  if (data.status.hasOwnProperty("retweeted_status")) {
    const retweeted_text = data.status.retweeted_status.text.replace(
      htmlTags,
      ""
    );
    var caption =
      "@" +
      cleanMarkdown(data.status.user.screen_name) +
      ": " +
      cleanMarkdown(text) +
      line +
      "//@" +
      cleanMarkdown(data.status.retweeted_status.user.screen_name) +
      ": " +
      cleanMarkdown(retweeted_text);
  } else {
    var caption =
      "@" +
      cleanMarkdown(data.status.user.screen_name) +
      ": " +
      cleanMarkdown(text);
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
    if (media_data.length === 1) {
      sendWeiboPhotoOne(msg, media_data[0], caption, url);
    } else if (media_data[0].type === "document") {
      media_data.forEach((media) => (media.type = "document"));
      sendWeiboPhotoMultiple(msg, media_data, caption, url);
    } else {
      sendWeiboPhotoOne(
        msg,
        media_data[0],
        caption + "\n\n_⬇️（动图多图仅显示第一张，请原文查看）_",
        url
      );
    }
  } else {
    media_data = media_data.filter((media) => media.type === "photo");
    if (checkWeiboSendOne(media_data)) {
      sendWeiboPhotoOne(msg, media_data[0], caption, url);
    } else {
      sendWeiboPhotoMultiple(msg, media_data, caption, url);
    }
  }
}

function getWeiboPhotoMediaType(pic) {
  if (pic[0].endsWith(".gif")) {
    return "animation";
  } else if (pic[1] * 3 < pic[2]) {
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
      parse_mode: "MarkdownV2",
      animation: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: url,
            },
          ],
        ],
      },
    });
  } else if (pic.type === "document") {
    sendDocument({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: "MarkdownV2",
      document: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: url,
            },
          ],
        ],
      },
    });
  } else {
    sendPhoto({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: "MarkdownV2",
      photo: pic.media,
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: url,
            },
          ],
        ],
      },
    });
  }
}

function sendWeiboPhotoMultiple(msg, media_data, caption, url) {
  if (media_data[0].type === "photo") {
    media_data[0].caption = caption + "\n\n[🔗原文链接](" + url + ")";
    media_data[0].parse_mode = "MarkdownV2";
  } else {
    media_data[media_data.length - 1].caption =
      caption + "\n\n[🔗原文链接](" + url + ")";
    media_data[media_data.length - 1].parse_mode = "MarkdownV2";
  }
  if (media_data.length > 10) {
    media_data = media_data.slice(0, 10);
  }
  try {
    sendMediaGroup({
      chat_id: msg.chat.id,
      media: media_data,
      reply_to_message_id: msg.message_id,
    });
  } catch (error) {
    console.error(error);
    sendWeiboPhotoOne(
      msg,
      media_data[0],
      caption + "\n\n_⬇️（多图获取失败，请原文查看）_",
      url
    );
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
  if (media.stream_url_hd) {
    return media.stream_url_hd;
  } else {
    return media.stream_url;
  }
}

function getWeiboVideoCover(data) {
  if (data.status.hasOwnProperty("page_info")) {
    var page_info = data.status.page_info;
  } else {
    var page_info = data.status.retweeted_status.page_info;
  }
  return page_info.page_pic.url;
}

function sendWeiboFinal(msg, data, url, caption, extra_caption) {
  if (checkWeiboHasVideo(data)) {
    try {
      //Try to send cover photo
      sendPhoto({
        chat_id: msg.chat.id,
        caption: caption + extra_caption,
        parse_mode: "MarkdownV2",
        photo: data.status.page_info.page_pic.url,
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "原文链接",
                url: url,
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error(error);
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
                url: url,
              },
            ],
          ],
        },
      });
    }
  }
}
