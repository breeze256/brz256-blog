// 1️⃣ 加载 NexT 主样式
CMS.registerPreviewStyle("/css/main.css");
CMS.registerPreviewStyle("/admin/preview.css");

// 3️⃣ 注册 Preview 模板
const PostPreview = createClass({
  render() {
    const entry = this.props.entry;
    const body = this.props.widgetFor("body");

    const title = entry.getIn(["data", "title"]);
    const date = entry.getIn(["data", "date"]);
    const tags = entry.getIn(["data", "tags"]) || [];

    return h(
      "div",
      { className: "main-inner" },
      h(
        "div",
        { className: "content-wrap" },
        h(
          "div",
          { className: "content" },
          h(
            "article",
            { className: "post-block" },
            [
              h("header", { className: "post-header" }, [
                h("h1", { className: "post-title" }, title),
                h("div", { className: "post-meta" }, date)
              ]),
              h("div", { className: "post-body" }, body),
              h("footer", { className: "post-footer" },
                tags.map(tag =>
                  h("span", { className: "post-tag" }, tag)
                )
              )
            ]
          )
        )
      )
    );
  }
});

CMS.registerPreviewTemplate("post", PostPreview);
