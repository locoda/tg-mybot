function processBilibili(msg, url) {
  const data = getBilibiliData(url);
  var caption = getBilibiliCaption(data);
  var video = getBilibiliVideo(data.bvid, data.cid);
  if (video) {
    sendVideoFile({
      chat_id: String(msg.chat.id),
      video: video,
      width: String(data.dimension.width),
      height: String(data.dimension.height),
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: String(msg.message_id),
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: "https://www.bilibili.com/video/" + data.bvid,
            },
          ],
        ],
      }),
    });
  } else {
    sendBilibiliCover(msg, data, caption);
  }
}

function getBilibiliData(url) {
  if (url.includes("b23.tv")) {
    var options = {
      headers: {
        "User-Agent": macChromeUserAgent,
      },
      followRedirects: false,
    };
    var response = UrlFetchApp.fetch(url, options);
    url = response.getAllHeaders().Location;
  }
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      Cookie: bilibiliCookie,
    },
  };
  var response = UrlFetchApp.fetch(url.split("?")[0], options);
  var html = response.getContentText();
  var video_data = html.split("window.__playinfo__=")[1];
  video_data = video_data.split("</script>")[0];
  var data = html.split("__INITIAL_STATE__=")[1];
  data = data.split(";(function()")[0];
  // console.log(data);
  return JSON.parse(data).videoData;
}

function getBilibiliCaption(data) {
  return "*" + cleanMarkdown(data.title) + "*\n\n" + cleanMarkdown(data.desc);
}

function getBilibiliVideo(bvid, cid) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      Cookie: bilibiliCookie,
    },
  };
  var response = UrlFetchApp.fetch(
    bilibiliVideoApi + "bvid=" + bvid + "&cid=" + cid + bilibiliVideoParam,
    options
  );
  data = JSON.parse(response.getContentText()).data.durl[0];
  options.headers["Referer"] = "https://www.bilibili.com";
  if (data.size / 1024 / 1024 / 8 < 40) {
    return UrlFetchApp.fetch(data.url, options).getBlob();
  } else {
    return null;
  }
}

function sendBilibiliCover(msg, data, caption) {
  sendPhoto({
    chat_id: msg.chat.id,
    photo: data.pic,
    caption: caption + "\n\n_⬇️（视频获取失败，请原文查看）_",
    parse_mode: "MarkdownV2",
    reply_to_message_id: msg.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "原文链接",
            url: "https://www.bilibili.com/video/" + data.bvid,
          },
        ],
      ],
    },
  });
}
