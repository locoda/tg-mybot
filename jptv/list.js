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
  var list = JSON.stringify(JSON.parse(response.getContentText()));
  return list.match(/.{1,7000}/g); 
}

function setJptvMediaList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  getGistJptvList().forEach((element, index) => scriptProperties.setProperty('JPTV_MEDIA_LIST_'+index, element));
}

function getJptvMediaListString() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var list = '';
  var index = 0;
  while (true) {
    if (scriptProperties.getProperty('JPTV_MEDIA_LIST_'+index)) {
      list = list + scriptProperties.getProperty('JPTV_MEDIA_LIST_'+index);
      index += 1;
    } else {
      break;
    }
  }
  return list;
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