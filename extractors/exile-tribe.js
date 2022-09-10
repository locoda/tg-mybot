function processExileTribe(msg, url) {
  var data = getExileTribeData(url);
  console.log(data);
  var caption = getExileTribeCaption(data);
  // console.log(caption);
  var images = getExileTribeImages(data);
  // console.log(images);
  if (images && images.length === 0) {
    // send text
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
  } else if (images.length === 1) {
    // 1 image
    sendPhoto({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: "MarkdownV2",
      photo: images[0],
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
    // images
    var media_data = [];
    images.forEach((img) =>
      media_data.push({
        type: "photo",
        media: img,
      })
    );
    media_data[0].caption = caption + "\n[🔗原文链接](" + url + ")";
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

function testGetExileTribeData() {
  const url =
    "https://m.tribe-m.jp/image_diary/detail?id=55179&corner_id=124&group_id=124&before=2022-05-16%2018:00:01";
  console.log(getExileTribeData(url));
}

function getExileTribeData(url) {
  options = {
    headers: {
      cookie: exileTribeCookie,
      "User-Agent": macChromeUserAgent,
    },
    followRedirects: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText("UTF-8");
  // console.log(html);
  var data = html.split("blogTalkData = ")[1];
  // console.log(data);
  data = data.split("</script>")[0];
  data = data.substring(0, data.lastIndexOf("}") + 1);
  data = JSON.parse(data);
  if (url.includes("image_diary")) {
    data.contents = data.text;
  }
  return data;
}

function getExileTribeCaption(data) {
  try {
    return (
      "*" +
      cleanMarkdown(decodeHtml(data.title)) +
      "*\n\n" +
      cleanMarkdown(decodeHtml(data.contents)) +
      "\n"
    );
  } catch (error) {
    console.error(error);
    try {
      return (
        "*" +
        cleanMarkdown(decodeHtml(data.title)) +
        "*\n\n_⬇️（内文获取失败，请原文查看）_"
      );
    } catch (error) {
      console.error(error);
      return "_⬇️（文字获取失败，请原文查看）_";
    }
  }
}

function getExileTribeImages(data) {
  const imgReg = /https:\/\/cf-stat\.tribe-m\.jp\/img\/uplcmn[\w\d/]*\.jpg/g;
  var content = data.contents;
  return content.match(imgReg);
}
