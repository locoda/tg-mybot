function updateJptvMediaList() {
  // set media list for internal useage
  setJptvMediaList();
  // update telegraph for public serving
  updateJptvTelegraph();
}

const JPTV_MESSAGE =
  "欢迎来到乙醚的日剧收藏机器人～ \n" +
  "许愿/安利/交流/资源反馈请通过以下任意渠道：@locoda/@ethersdaily/@yimi_bot \n\n" +
  "完整片单：/jpls@all ⚠️长度警告\n\n" +
  "=========片单=========\n";

function getGistJptvList() {
  var response = UrlFetchApp.fetch(jptvListGist);
  return JSON.parse(response.getContentText());
}

function setJptvMediaList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('JPTV_MEDIA_LIST', JSON.stringify(getGistJptvList()));
}

function getJptvMediaListString() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('JPTV_MEDIA_LIST');
}

function getJptvMediaList() {
  return JSON.parse(getJptvMediaListString());
}

function updateJptvTelegraph() {
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      access_token: telegraphAccessToken,
      title: "乙醚的日剧私藏片单",
      author_name: "乙醚的日剧私藏",
      author_url: "https://t.me/etherjptv",
      content: JSON.stringify(jptv2node())
    }),
  }
  var response = UrlFetchApp.fetch(telegraphBaseURL, options);
  console.log(response.getContentText())
}