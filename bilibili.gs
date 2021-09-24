function processBilibili(msg, url) {
  const [meta_data, video_data] = getBilibiliData(url);
  var caption = getBilibiliCaption(meta_data);
  var video = getBilibiliVideo(video_data.video);
  if (video) {
    try {
    var videoBlob = getBilibiliVideoBlob(video.baseUrl);
    } catch (error) {
      sendBilibiliCover(msg, caption, meta_data);
    }
    sendVideoFile({
      chat_id: String(msg.chat.id) ,
      video: videoBlob,
      width: String(video.width),
      height: String(video.height),
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: String(msg.message_id),
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
          inline_keyboard: [[{
            text: "原文链接",
            url: "https://www.bilibili.com/video/" + meta_data.bvid,
          }]],
        }),
    });
  } else {
    sendBilibiliCover(msg, caption, meta_data);
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
    var response = UrlFetchApp.fetch(url, options)
    url = response.getAllHeaders().Location;
  }
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      "Cookie" : bilibiliCookie,
    },
  };
  var response = UrlFetchApp.fetch(url.split('?')[0], options);
  var html = response.getContentText();
  var video_data = html.split('window.__playinfo__=')[1];
  video_data = video_data.split('</script>')[0];
  var meta_data = html.split('__INITIAL_STATE__=')[1];
  meta_data = meta_data.split(';')[0];
  return [JSON.parse(meta_data).videoData, JSON.parse(video_data).data.dash];
}

function getBilibiliVideo(data) {
  var videos = data.filter(video => video.bandwidth < 500000 && video.mimeType === 'video/mp4');
  return videos[0];
}

function getBilibiliCaption(data) {
  return "*" + cleanMarkdown(data.title) + "*\n\n" + cleanMarkdown(data.desc);
}

function getBilibiliVideoBlob(url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      "Cookie" : bilibiliCookie,
    },
  }
  var response = UrlFetchApp.fetch(url, options);
  return response.getBlob();
}

function sendBilibiliCover(msg, caption, data){
  sendPhoto({
      chat_id: msg.chat.id ,
      photo: data.pic,
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: msg.message_id,
      disable_web_page_preview: true,
      reply_markup: {
          inline_keyboard: [[{
            text: "原文链接",
            url: "https://www.bilibili.com/video/" + data.bvid,
          }]],
        },
    })
}
