function jpls(msg) {
  if (checkPrivateError(msg)) return;
  var param = msg.text.split("@")[1];
  switch (param) {
    case "all":
      sendMessage({
        chat_id: msg.chat.id,
        text: jptv2md(),
        parse_mode: "MarkdownV2",
        reply_to_message_id: msg.message_id,
        disable_web_page_preview: true,
      });
      break;
    default:
      sendMessage({
        chat_id: msg.chat.id,
        text: JPTV_MESSAGE + "请按键开始⬇️",
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "片单",
                callback_data: "jpls:片单",
              },], [
              {
                text: "完整版（Telegrah ver.）",
                url: "https://telegra.ph/%E4%B9%99%E9%86%9A%E7%9A%84%E6%97%A5%E5%89%A7%E7%89%87%E5%8D%95-10-01-2",
              },

            ],
          ],
        },
      });
  }
}

function handleJplsCallback(callback_query) {
  data = callback_query.data.split(":").slice(1).filter(i => (i));
  var list = getJptvMediaList();
  data.forEach((i) => (list = list[i]));
  if (Array.isArray(list)) {
    list = list.map(
      item => parseJptvItemMd(item)
    );
    var text = "获取到结果：\n" + list.join("\n");
    var buttons = [];
  } else {
    var text = "请继续选择操作⬇️";
    var buttons = [];
    Object.keys(list).sort().forEach((i) =>
      buttons.push([
        {
          text: i,
          callback_data: "jpls:" + data.join(":") + ":" + i,
        },
      ])
    );
  }

  if (data.length > 0) {
    last_line = [
      {
        text: "主页",
        callback_data: "jpls:",
      },
      {
        text: "返回",
        callback_data: "jpls:" + data.slice(0, data.length - 1).join(":"),
      },
    ];
  } else {
    last_line = [
      {
        text: "完整版（Telegrah ver.）",
        url: "https://telegra.ph/%E4%B9%99%E9%86%9A%E7%9A%84%E6%97%A5%E5%89%A7%E7%89%87%E5%8D%95-10-01-2",
      },
    ]
  }
  buttons.push(last_line);

  // Getting data finished - ready to answer
  answerCallbackQuery({
    callback_query_id: callback_query.id
  })
  // Edit the message
  editMessageText({
    chat_id: callback_query.message.chat.id,
    message_id: callback_query.message.message_id,
    text: cleanMarkdown(JPTV_MESSAGE) + text,
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

function handleJptvCallback(callback_query) {
  var index = parseInt(callback_query.data.slice(5));
  var scriptProperties = PropertiesService.getScriptProperties();
  var result = scriptProperties.getProperty('jptv:' + callback_query.message.chat.id);
  result = JSON.parse(result);
  var buttons = [];
  if (index > 0) {
    buttons.push(
      {
        text: "上一页",
        callback_data: "jptv:" + (index - 10),
      },
    )
  }

  if (index + 10 < result.length) {
    buttons.push(
      {
        text: "下一页",
        callback_data: "jptv:" + (index + 10),
      },
    )
  }

  // Getting data finished - ready to answer
  answerCallbackQuery({
    callback_query_id: callback_query.id
  })
  // Edit the message
  editMessageText({
    chat_id: callback_query.message.chat.id,
    message_id: callback_query.message.message_id,
    text: "搜索结果（" + (Math.ceil(index / 10) + 1) + "/" + (Math.floor((result.length - 1) / 10) + 1) + "）： \n" + result.slice(index, index + 10).join('\n'),
    reply_markup: {
      inline_keyboard: [buttons],
    },
  });
}

function jptv(msg) {
  if (checkPrivateError(msg)) return;
  var command = msg.text.split(" ")[0];
  var searchKeywords = msg.text.split(" ").slice(1);
  var message_id = command.replace("/", "").split("@")[1];
  if (command.startsWith("/start")) {
    helpJptv(msg);
  } else if (message_id) {
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
  console.info("Search Results: " + JSON.stringify(result));
  result = parseJptvSearchResult(result);
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('jptv:' + telegramMasterId, JSON.stringify(result));

  if (!result.length) {
    sendMessage({
      chat_id: msg.chat.id,
      text: "没有搜索到结果，换个关键词试试？",
      reply_to_message_id: msg.message_id,
    });
  } else if (result.length <= 20) {
    sendMessage({
      chat_id: msg.chat.id,
      text: "搜索结果：\n" + result.join('\n'),
      reply_to_message_id: msg.message_id,
    });
  } else {
    sendMessage({
      chat_id: msg.chat.id,
      text: "⚠️搜索结果将在下一次搜索后过期\n\n搜索结果 （1/" + (Math.floor((result.length - 1) / 10) + 1) + "）：\n" + result.slice(0, 10).join('\n'),
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "下一页",
              callback_data: "jptv:" + 10,
            },
          ],
        ],
      },
    });
  }
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
    text: "使用方法：\n/j <关键词> - 搜索日剧\n例如：/j 电影\n搜索结果只保证最新的请求正确哦～\n\n查询片单：/jpls\n",
    reply_to_message_id: msg.message_id,
  });
}

function parseJptvSearchResult(result) {
  return result.map(
    (item) =>
      "/j@" +
      item.message_id["$numberDouble"].padStart(3, "0") +
      " ➡️ " +
      item.text
  );
}
