function processTiktok(msg, url) {
  var data = getTiktokData(url);
  // console.log(data.itemInfo.itemStruct.video.downloadAddr);
  var caption = getTiktokCaption(data);
  try {
    var video = getTiktokVideo(data.itemInfo.itemStruct.video.downloadAddr);
    sendVideoFile({
      chat_id: String(msg.chat.id),
      video: video,
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: String(msg.message_id),
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: data.seoProps.metaParams.canonicalHref,
            },
          ],
        ],
      }),
    });
  } catch (error) {
    console.error(error);
    sendMessage({
      chat_id: msg.chat.id,
      text: caption + "\n\n_⬇️（视频获取失败，请原文查看）_",
      parse_mode: "MarkdownV2",
      reply_to_message_id: msg.message_id,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: data.seoProps.metaParams.canonicalHref,
            },
          ],
        ],
      },
    });
  }
}

function getTiktokData(url) {
  if (url.includes("vm.tiktok.com")) {
    options = {
      headers: {
        cookie: tiktokCookieVM,
        "User-Agent": macChromeUserAgent,
      },
      followRedirects: false,
    };
    var response = UrlFetchApp.fetch(url, options);
    url = response.getAllHeaders().Location;
    options = {
      headers: {
        cookie: tiktokCookieM,
        "User-Agent": macChromeUserAgent,
      },
      followRedirects: false,
    };
    var response = UrlFetchApp.fetch(url, options);
    url = response.getAllHeaders().Location;
  }
  url = url.split("?")[0];
  options = {
    headers: {
      cookie: tiktokCookieVM,
      "User-Agent": macChromeUserAgent,
    },
    followRedirects: false,
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  var data = html.split('<script id="__NEXT_DATA__"')[1];
  data = data.split("</script>")[0];
  data = data.split(">")[1];
  return JSON.parse(data).props.pageProps;
}

function getTiktokCaption(data) {
  var caption =
    "@" +
    data.itemInfo.itemStruct.author.uniqueId +
    ": " +
    data.itemInfo.itemStruct.desc;
  return cleanMarkdown(caption);
}

function getTiktokVideo(url) {
  var options = {
    headers: tiktokVideoHeader,
  };
  var response = UrlFetchApp.fetch(url, options);
  return response.getBlob();
}
