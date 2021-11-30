function guess(msg) {
    if (msg.hasOwnProperty("reply_to_message")) {
        var text = msg.reply_to_message.text;
        msg = msg.reply_to_message;
    } else {
        var text = msg.text.split(" ").slice(1).join(" ");
    }

    var data = fetchGuessFromApi(text);
    var caption = getCaptionFromGuessData(data);

    sendMessage({
        chat_id: msg.chat.id,
        text: caption,
        // parse_mode: "MarkdownV2",
        reply_to_message_id: msg.message_id,
    });
}

function fetchGuessFromApi(text) {
    let data = { "text": text };
    var options = {
        method: "post",
        payload: data,
    };
    var response = UrlFetchApp.fetch(nbnhhshGuessApi, options);
    return JSON.parse(response.getContentText());
}

function getCaptionFromGuessData(data) {
    if (data.length === 0) {
        return "没有找到缩写";
    } else {
        data = data.map(item => {
            if (item.hasOwnProperty("trans")) {
                return item.name + ": " + item.trans.join(", ");
            } else {
                return item.name + ": 未找到单词缩写";
            }
        });
        return data.join('\n')
    }
}