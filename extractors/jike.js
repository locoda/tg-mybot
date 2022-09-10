function processJike(msg, url) {
  const data = getJikeData(url);
  const caption = getJikeCaption(data);
  url = "https://m.okjike.com/originalPosts/" + data.id;
  if (data.pictures.length == 1) {
    sendPhoto({
      chat_id: msg.chat.id,
      caption: caption,
      parse_mode: "MarkdownV2",
      photo: data.pictures[0].picUrl,
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
  } else if (data.pictures.length > 1) {
    var media_data = [];
    data.pictures.forEach((pic) =>
      media_data.push({
        type: "photo",
        media: pic.picUrl,
      })
    );
    media_data[0].caption = caption + "\n\n[🔗原文链接](" + url + ")";
    media_data[0].parse_mode = "MarkdownV2";
    sendMediaGroup({
      chat_id: msg.chat.id,
      media: media_data,
      reply_to_message_id: msg.message_id,
    });
  } else if (caption) {
    sendMessage({
      chat_id: String(msg.chat.id),
      text: caption,
      parse_mode: "MarkdownV2",
      reply_to_message_id: String(msg.message_id),
      disable_web_page_preview: true,
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
  }
}

function getJikeData(url) {
  if (url.includes("web.okjike.com")) {
    url = url.replace("web", "m").replace("originalPost", "originalPosts");
  }
  // console.log(url);
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  var data = html.split(
    '<script id="__NEXT_DATA__" type="application/json">'
  )[1];
  data = data.split("</script>")[0];
  data = JSON.parse(data);
  return data.props.pageProps.post;
}

function getJikeCaption(data) {
  // console.log(JSON.stringify(data));
  caption = "@" + data.user.screenName + ": " + data.content;
  return cleanMarkdown(shortenCaption(caption));
}
