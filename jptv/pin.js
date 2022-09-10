function editJptvPinMessage() {
  editMessageText({
    chat_id: jptvId,
    message_id: 3,
    text:
      "欢迎来到乙醚的日剧收藏频道～ \n" +
      "许愿/安利/交流/资源反馈请通过以下任意渠道：@locoda/@ethersdaily/@yimi_bot \n\n",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🤖️ 试试片单📋",
            url: "https://t.me/yimi_bot?start=jpls",
          },
          {
            text: "🤖️ 试试搜索🔍",
            url: "https://t.me/yimi_bot?start=jptv",
          },
        ],
        [
          {
            text: "片单完整版 (Telegraph)",
            url: "https://telegra.ph/%E4%B9%99%E9%86%9A%E7%9A%84%E6%97%A5%E5%89%A7%E7%89%87%E5%8D%95-10-01-2",
          },
        ],
      ],
    },
  });
}
