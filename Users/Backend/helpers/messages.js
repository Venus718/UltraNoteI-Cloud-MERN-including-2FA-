 const ParseMessage = (msg_body) => {
  let html = msg_body.split("\n");
  let headers = [];
  let length = 0;
  for (let m = 1; m < html.length; m++) {
    var header = html[m - 1];
    header = header.split(": ");
    if (header.length > 1) {
      header_body = header.splice(1, header.length - 1);
      headers.push({
        name: header[0],
        value: header_body.join(": "),
      });
      length++;
    } else {
      break;
    }
  }
  if (html.length > 2) {
    length++;
    var body = html.splice(length, html.length - length);
    html = body.join("\n");
  } else {
    html = msg_body;
  }

  var origin_html = html;
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, "");
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, "");
  html = html.replace(/<\/div>/gi, "");
  html = html.replace(/<\/li>/gi, "");
  html = html.replace(/<li>/gi, "  *  ");
  html = html.replace(/<\/ul>/gi, "");
  html = html.replace(/<\/p>/gi, "");
  html = html.replace(/<br\s*[\/]?>/gi, "");
  html = html.replace(/<[^>]+>/gi, "");
  html = html.replace(/\n\n/, "");

  return { html, origin_html, headers };
};

module.exports= ParseMessage
