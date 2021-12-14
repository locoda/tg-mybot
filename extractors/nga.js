function processNga(msg, url) {
  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      Cookie: ngaCookie,
    },
  };
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText("GBK");
  var [title, content] = getNgaTextFromHtml(html);
  var caption = constructNgaCaption(title, content);
  if (checkNgaImgExist(content)) {
    const imgReg = /\[img\][^\[]*\[\/img\]/g;
    var imgs = getNgaImagesFromText(content);
    content = content.replaceAll(imgReg, "");
    // regen caption due to image changes
    caption = constructNgaCaption(title, content);
    if (imgs.length == 1) {
      sendPhoto({
        chat_id: msg.chat.id,
        photo: imgs[0],
        caption: caption,
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
    } else {
      var media_data = [];
      imgs.forEach((img) =>
        media_data.push({
          type: "photo",
          media: img,
        })
      );
      (media_data[0].caption = caption + "\n\n[🔗原文链接](" + url + ")"),
        (media_data[0].parse_mode = "MarkdownV2");
      if (media_data.length > 10) {
        media_data = media_data.slice(0, 10);
      }
      sendMediaGroup({
        chat_id: msg.chat.id,
        media: media_data,
        reply_to_message_id: msg.message_id,
      });
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
}

function getNgaTextFromHtml(html) {
  const titleReg = /<h1 class='x'>.*/g;
  var title = html.match(titleReg)[0];
  title = title.replace("<h1 class='x'>", "").replace("</h1>", "");
  const contentReg = /\<p id\=\'postcontent0\'.*/g;
  var content = html.match(contentReg)[0];
  content = content
    .replace("<p id='postcontent0' class='postcontent ubbcode'>", "")
    .replace("</p>", "")
    .replaceAll("<br/>", "\n");
  return [title, content];
}

function constructNgaCaption(title, content) {
  content = cleanMarkdown(content);
  content = content
    .replaceAll(cleanMarkdown("[b]"), "*")
    .replaceAll(cleanMarkdown("[/b]"), "*");
  content = content
    .replaceAll(cleanMarkdown("[i]"), "_")
    .replaceAll(cleanMarkdown("[/i]"), "_");
  content = content
    .replaceAll(cleanMarkdown("[u]"), "__")
    .replaceAll(cleanMarkdown("[/u]"), "__");
  content = content
    .replaceAll(cleanMarkdown("[del]"), "~")
    .replaceAll(cleanMarkdown("[/del]"), "~");
  const tag = /\\\[[^\]]*\]/g;
  content = content.replaceAll(tag, "");
  var caption = "*" + cleanMarkdown(title) + "*\n\n" + content;
  return shortenCaption(decodeHtml(caption));
}

function checkNgaImgExist(text) {
  return text.includes("[img]");
}

function getNgaImagesFromText(text) {
  const imgReg = /\[img\][^\[]*/g;
  var imgs = text.match(imgReg);
  var response = [];
  imgs.forEach((img) => {
    img = img.replace("[img]", "").replace("[/img]", "");
    if (img.startsWith("http")) {
      response.push(img);
    } else {
      response.push("https://img.nga.178.com/attachments" + img.substring(1));
    }
  });
  return response;
}
