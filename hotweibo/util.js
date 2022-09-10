function fetchHotWeibo(category) {
  if (!category) {
    category = "realtimehot";
  }
  switch (category) {
    case "realtimehot":
      categoryText = "热搜榜";
      break;
    case "socialevent":
      categoryText = "要闻榜";
      break;
    case "entrank":
      categoryText = "文娱榜";
      break;
    default:
      throw "不支持此榜";
  }

  var options = {
    headers: {
      "User-Agent": macChromeUserAgent,
      cookie: weiboCookie,
    },
  };
  url = "https://s.weibo.com/top/summary?cate=" + category;
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  // console.log(html)
  var data = html.split('<div class="data"')[1];
  var tdList = data.split('<td class="td-01');
  tdList.shift();
  var nodes = [];
  var title =
    "微博热搜 " +
    categoryText +
    "  @" +
    new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  // var titleNode = {
  //   tag: "p",
  //   children: [breakNode],
  // }
  // nodes.push(titleNode);
  // nodes.push(emptyParagraphNode);
  // nodes.push(breakNode);
  var hotCaption = "";
  tdList.forEach((td) => {
    const rankReg = /(\d+)<\/td>/g;
    var rank = rankReg.exec(td);
    if (rank || category === "socialevent") {
      // construct node
      if (rank) {
        var hotRank = rank[1];
      } else {
        var hotRank = "·";
      }
      const tdContent = td
        .split('<td class="td-02">')[1]
        .split("</td>")[0]
        .trim();
      const hotUrl =
        "https://s.weibo.com" + tdContent.split('href="')[1].split('"')[0];
      const hotTitle = tdContent.split('target="_blank">')[1].split("</a>")[0];
      // console.log(hotRank, hotUrl, hotTitle);
      var node = {
        tag: "p",
        children: [],
      };
      node.children.push(hotRank + "  ");
      node.children.push({
        tag: "a",
        attrs: {
          href: hotUrl,
        },
        children: [hotTitle],
      });

      node.children.push(" ");
      node.children.push(breakNode);
      nodes.push(node);

      // construct caption
      if (
        parseInt(hotRank) <= 10 ||
        (category === "socialevent" && hotCaption.split("·").length <= 10)
      ) {
        hotCaption =
          hotCaption +
          hotRank +
          " [" +
          cleanMarkdown(hotTitle) +
          "](" +
          hotUrl +
          ")\n";
      }
    }
  });

  var telegraph = updateArchiveTelegraph(
    "微博热搜",
    title,
    url,
    nodes,
    telegraphHotWeiboAccessToken
  );

  return (
    title +
    "\n" +
    hotCaption +
    "\n[全榜Telegraph](" +
    telegraph +
    ")  [Source](" +
    url +
    ")"
  );
}
