function checkPrivateError(msg) {
    if (!isPrivateChat(msg)) {
        sendMessage({
            chat_id: msg.chat.id,
            text: "本指令仅限私聊使用",
            reply_to_message_id: msg.message_id,
        });
        return true;
    }
    return false;
}