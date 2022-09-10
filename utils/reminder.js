function remindWordle() {
  sendMessage({
    chat_id: -1001428581858,
    text: "来玩 Wordle 了！",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Wordle",
            url: "https://www.nytimes.com/games/wordle/index.html",
          },
        ],
      ],
    },
  });
}

function remindWeibo() {
  sendMessage({
    chat_id: -1001428581858,
    text: fetchHotWeibo(),
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
  });
}
