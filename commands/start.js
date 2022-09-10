function start(msg) {
  var param = msg.text.split(" ")[1];
  switch (param) {
    case "jpls":
      jpls(msg);
      break;
    case "jptv":
      jptv(msg);
      break;
    default:
      sendMessage({
        chat_id: msg.chat.id,
        text: "是乙醚的替身，任何疑问/建议/聊天请直接找 @locoda",
      });
  }
}
