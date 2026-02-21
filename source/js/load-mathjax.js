/*== Dynamically Load MathJax in PJAX ==*/
(() => {
  const CDN = '//s4.zstatic.net/npm/mathjax@4.1.0/tex-mml-chtml.js';
  const SCRIPT_ID = 'mathjax-script';

  const config = {
    loader: { load: ['[tex]/tagformat'] },
    output: { font: 'mathjax-fira' },
    options: {
      enableMenu: false,
      menuOptions: { settings: { enrich: false } }
    },
    tex: {
      packages: { '[+]': ['tagformat'] },
      macros: { e: "\\mathrm{e}", i: "\\mathrm{i}", d: "\\mathrm{d}" }
    }
  };

  const shouldLoad = () => {
    const post = document.querySelector('.post');
    return post && /\\\(|\\\[|\$\$|\$/.test(post.textContent);
  };

  const ensure = async () => {
    if (!shouldLoad()) {
      document.getElementById(SCRIPT_ID)?.remove();
      document.querySelectorAll('mjx-container').forEach(e => e.remove());
      delete window.MathJax;
      return;
    }

    if (!window.MathJax) {
      window.MathJax = config;
      await new Promise(resolve => {
        const s = document.createElement('script');
        s.src = CDN;
        s.id = SCRIPT_ID;
        s.async = true;
        s.onload = resolve;
        document.head.appendChild(s);
      });
    }

    await window.MathJax.startup.promise;
    await window.MathJax.typesetPromise([document.querySelector('.post')]);
  };

  document.addEventListener('DOMContentLoaded', ensure);
  document.addEventListener('pjax:success', ensure);
})();