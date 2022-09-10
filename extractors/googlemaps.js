function processGoogleMaps(msg, url) {
  const data = getGoogleMapsData(url);
  const caption = getGoogleMapsCaption(data);
  if (!data) {
    sendMessage({
      chat_id: msg.chat.id,
      text: "没有找到地图数据",
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

  sendLocation({
    chat_id: msg.chat.id,
    latitude: data.geometry.location.lat,
    longitude: data.geometry.location.lng,
    reply_to_message_id: msg.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: caption,
            url: url,
          },
        ],
      ],
    },
  });
}

function getGoogleMapsData(url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
    },
    followRedirects: false,
  };
  var response = UrlFetchApp.fetch(url, options);

  url = response.getAllHeaders().Location;
  var ftid;
  if (url.includes("ftid=")) {
    ftid = url.split("ftid=")[1].split("&")[0];
  } else {
    ftid = url.split("!5s")[1].split("!")[0];
  }
  url = placeDetailApi + ftid;
  // console.log(url)
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());
  return data.result;
}

function getGoogleMapsCaption(data) {
  if (data.name === "1") {
    return "Google Maps 链接";
  } else {
    return data.name;
  }
}
