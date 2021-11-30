function processAppleMusic(msg, url) {
  const data = getAppleMusicData(url);
  if (!data) {
    sendMessage({
      chat_id: msg.chat.id,
      text: "没有找到可预览音乐",
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
    return;
  }

  const audio = getAppleMusicAudio(data);
  const caption = getAppleMusicCaption(data);
  if (audio) {
    sendAudio({
      chat_id: String(msg.chat.id),
      audio: audio,
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: String(msg.message_id),
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "原文链接",
              url: data.attributes.url,
            },
          ],
        ],
      }),
    });
  }
}

function getAppleMusicData(url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  // console.log(html)
  var data = html.split('<script type="fastboot/shoebox" id="shoebox-media-api-cache-amp-music">')[1];
  data = data.split("</script>")[0];
  data = JSON.parse(data);
  for (var key in data) {
    if (key.includes("audio-extras")) {
      data = data[key];
      break;
    }
  }
  data = JSON.parse(data).d[0].relationships.tracks.data;
  if (url.includes("i=")) {
    let track = url.split('i=')[1].split('&')[0];
    data = data.filter(d => d.id === track);
  } else {
    data = data.filter(d => d.attributes.previews[0]);
  }
  return data[0];
}

function getAppleMusicAudio(data) {
  return data.attributes.previews[0].url;
}

function getAppleMusicCaption(data) {
  // console.log(data);
  return "预览： " + cleanMarkdown(data.attributes.name);
}