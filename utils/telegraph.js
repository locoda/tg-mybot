const emptyParagraphNode = {
  tag: "p",
  children: ["  "],
};

const breakNode = {
  tag: "br",
};

function updateArchiveTelegraph(website, title, url, nodes, accessToken) {
  // console.log(JSON.stringify(nodes));
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      access_token: accessToken,
      title: title,
      author_name: website,
      author_url: url,
      content: JSON.stringify(nodes),
    }),
  };
  var response = UrlFetchApp.fetch(telegraphArchiveCreateBaseURL, options);
  // console.log(JSON.parse(response.getContentText()))
  if (JSON.parse(response.getContentText()).ok) {
    return JSON.parse(response.getContentText()).result.url;
  } else {
    throw JSON.parse(response.getContentText()).error;
  }
}

function parseDOMContent(content, callsite) {
  if (content.getType().name() === "TEXT") {
    var text = content.getValue().trim();
    if (text.length > 0) {
      return text;
    } else {
      return false;
    }
  }
  if (content.getType().name() !== "ELEMENT") {
    return false;
  }
  var nodeElement = {};
  content = content.asElement();
  const tags =
    "a|aside|b|blockquote|br|code|em|figcaption|figure|h3|h4|hr|i|iframe|img|li|ol|p|pre|s|strong|u|ul|video";
  if (content.getName() === "h2") {
    nodeElement.tag = "h3";
  } else if (content.getName() === "h3") {
    nodeElement.tag = "h4";
  } else if (tags.includes(content.getName())) {
    nodeElement.tag = content.getName();
  } else {
    nodeElement.tag = "p";
  }
  // var attributes = content.getAttributes();
  // attributes.forEach(a => {
  //   if (a.getName() === 'href' || a.getName() === 'src') {
  //     if (!nodeElement.attrs) {
  //       nodeElement.attrs = {};
  //     }
  //     nodeElement.attrs[a.getName()] = a.getValue();
  //   }
  // })
  var childContents = content.getAllContent();
  if (childContents.length > 0) {
    nodeElement.children = [];
    childContents.forEach((child) => {
      node = parseDOMContent(child);
      if (node) {
        nodeElement.children.push(node);
      }
    });
    if (callsite === "AO3" && content.getName() === "p") {
      nodeElement.children.push(emptyParagraphNode);
      nodeElement.children.push(breakNode);
    }
  }
  return nodeElement;
}
