// preview.js

const PostPreview = createClass({
  componentDidMount() { setTimeout(window.renderMathJax, 150); },
  componentDidUpdate(p) { if(p.entry.get('data')!==this.props.entry.get('data')){setTimeout(window.renderMathJax, 150);} },

  render() {
    const e = this.props.entry;
    const b = e.getIn(["data", "body"], "") || "";
    const t = e.getIn(["data", "title"], "") || "";
    const d = e.getIn(["data", "date"], "") || "";
    // 健壮地处理 tags
    const tg = e.getIn(["data", "tags"]); 
    const tags = (Array.isArray(tg) ? tg : (tg?.toArray ? tg.toArray() : [])).filter(v => v != null);

    let mdEl = b;
    if (window.MarkdownComponent) {
      try {
        mdEl = h(window.MarkdownComponent, {
          children: b,
          remarkPlugins: window.MarkdownPlugins?.remarkPlugins,
          rehypePlugins: window.MarkdownPlugins?.rehypePlugins,
        });
      } catch (er) { console.error(er); mdEl = `Err: ${er.message}`; }
    }

    return h("div", { className: "main-inner" },
      h("div", { className: "content-wrap" },
        h("div", { className: "content" },
          h("article", { className: "post-block" },
            h("header", { className: "post-header" }, [ h("h1", { className: "post-title" }, t), h("div", { className: "post-meta" }, d) ]),
            h("div", { className: "post-body" }, mdEl),
            h("footer", { className: "post-footer" }, tags.map((v, i) => h("span", { key: i, className: "post-tag" }, v)) )
          )
        )
      )
    );
  }
});

CMS.registerPreviewTemplate("post", PostPreview);