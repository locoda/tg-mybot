function insertJptv(channel_post) {
  if (!channel_post.hasOwnProperty("video")) {
    // not a video file post
    return;
  }
  var data = {
    message_id: channel_post.message_id,
    text: channel_post.caption,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvInsertApi, options);
  if (response.getResponseCode() == 200) {
    var result = JSON.parse(response.getContentText());
    console.log(result);
    return result;
  }
  return false;
}

function updateJptv(channel_post) {
  if (!channel_post.hasOwnProperty("video")) {
    // not a video file post
    return;
  }
  var data = {
    message_id: channel_post.message_id,
    text: channel_post.caption,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvUpdateApi, options);
  if (response.getResponseCode() == 200) {
    var result = JSON.parse(response.getContentText());
    console.log(result);
    return result;
  }
  return false;
}

function jpls(msg) {
  if (checkPrivateError(msg)) return;
  sendMessage({
    chat_id: msg.chat.id,
    text: JPTV_MESSAGE + "请按键开始⬇️",
    // parse_mode: "MarkdownV2",
    reply_to_message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "片单",
            callback_data: "jptv:片单",
          },
        ],
      ],
    },
  });
}

function handleJptvCallback(callback_query) {
  data = callback_query.data.split(":").slice(1);
  let list = JPTV_MEDIA_LIST;
  data.forEach((i) => (list = list[i]));
  if (Array.isArray(list)) {
    var text = "获取到结果：\n" + list.join("\n");
    var buttons = [];
  } else {
    var text = "请继续选择操作⬇️";
    var buttons = [];
    Object.keys(list).forEach((i) =>
      buttons.push([
        {
          text: i,
          callback_data: "jptv:" + data.join(":") + ":" + i,
        },
      ])
    );
  }

  if (data.length > 1) {
    last_line = [
      {
        text: "主页",
        callback_data: "jptv:",
      },
      {
        text: "返回",
        callback_data: "jptv:" + data.slice(0, data.length - 1).join(":"),
      },
    ];
    buttons.push(last_line);
  }
  answerCallbackQuery({
    callback_query_id: callback_query.id
  })
  editMessageText({
    chat_id: callback_query.message.chat.id,
    message_id: callback_query.message.message_id,
    text: JPTV_MESSAGE + text,
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

function jptv(msg) {
  if (checkPrivateError(msg)) return;
  var command = msg.text.split(" ")[0];
  var searchKeywords = msg.text.split(" ").slice(1);
  var message_id = command.replace("/", "").split("@")[1];
  if (message_id) {
    forwardJptv(msg, parseInt(message_id));
  } else if (searchKeywords.length) {
    searchJptv(msg, searchKeywords);
  } else {
    helpJptv(msg);
  }
}

function searchJptv(msg, searchKeywords) {
  var data = {
    keywords: searchKeywords,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  var response = UrlFetchApp.fetch(jptvSearchApi, options);
  var result = JSON.parse(response.getContentText());
  // console.log(result);
  sendMessage({
    chat_id: msg.chat.id,
    text: aggregateJptvSearchResult(result),
    reply_to_message_id: msg.message_id,
  });
}

function forwardJptv(msg, id) {
  forwardMessage({
    chat_id: msg.chat.id,
    from_chat_id: "@" + jptvUsername,
    message_id: id,
    // reply_to_message_id: msg.message_id,
  });
}

function helpJptv(msg) {
  sendMessage({
    chat_id: msg.chat.id,
    text: "使用方法：\n/j <关键词> - 搜索日剧\n例如：/j 电影\n片单：/j@003 （直接点击即可）\n",
    reply_to_message_id: msg.message_id,
  });
}

function aggregateJptvSearchResult(result) {
  if (!result.length) {
    return "没有搜索到结果，换个关键词试试？";
  }
  result = result.map(
    (item) =>
      "/j@" +
      item.message_id["$numberDouble"].padStart(3, "0") +
      "  ➡️  " +
      item.text
  );
  // console.log(result);
  return "搜索结果：\n" + result.join("\n");
}
