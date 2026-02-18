// preview.js

const PostPreview = createClass({
  componentDidMount() {
    setTimeout(window.renderMathJax, 150);
  },

  componentDidUpdate(prevProps) {
     if (prevProps.entry.get('data') !== this.props.entry.get('data')) {
         setTimeout(window.renderMathJax, 150);
     }
  },

  render() {
    const { entry } = this.props;
    const bodyValue = entry.getIn(["data", "body"]) || "";
    const title = entry.getIn(["data", "title"]);
    const date = entry.getIn(["data", "date"]);
    const tags = entry.getIn(["data", "tags"]) || Immutable.List(); // 默认为空列表

    // 使用 h() 直接创建 react-markdown 组件
    const processedBodyElement = window.MarkdownComponent ? 
      h(window.MarkdownComponent, {
          children: bodyValue,
          remarkPlugins: window.MarkdownPlugins?.remarkPlugins,
          rehypePlugins: window.MarkdownPlugins?.rehypePlugins,
      })
      : bodyValue; // Fallback to raw text

    return h(
      "div", { className: "main-inner" },
      h("div", { className: "content-wrap" },
        h("div", { className: "content" },
          h("article", { className: "post-block" },
            [
              h("header", { className: "post-header" },
                [ h("h1", { className: "post-title" }, title),
                  h("div", { className: "post-meta" }, date) ]
              ),
              h("div", { className: "post-body" }, processedBodyElement),
              h("footer", { className: "post-footer" },
                 tags.map(tag => h("span", { className: "post-tag" }, tag)).toArray()
              )
            ]
          )
        )
      )
    );
  }
});

CMS.registerPreviewTemplate("post", PostPreview);