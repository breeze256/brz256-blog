/*== Dynamically Load MathJax in PJAX ==*/
(() => {
  const CDN = 'https://s4.zstatic.net/npm/mathjax@4.1.0/tex-mml-chtml.js';

  const config = {
    loader: { load: ['[tex]/tagformat', '[tex]/mhchem'] },
    output: { font: 'mathjax-fira' },
    options: {
      enableMenu: false,
      menuOptions: { settings: { enrich: false } }
    },
    tex: {
      packages: { '[+]': ['tagformat', 'mhchem'] },
      macros: { e: "\\mathrm{e}", i: "\\mathrm{i}", d: "\\mathrm{d}" }
    }
  };

  const post = () => document.querySelector('.post');

  const hasMath = el =>
    el && /\\\(|\\\[|\$\$|\$/.test(el.textContent);

  const load = () =>
    window.MathJax?.startup
      ? Promise.resolve()
      : new Promise(r => {
          window.MathJax = config;
          const s = document.createElement('script');
          s.src = CDN;
          s.async = true;
          s.onload = r;
          document.head.appendChild(s);
        });

  const render = async () => {
    const el = post();
    if (!hasMath(el)) return;

    await load();
    await window.MathJax.startup.promise;
    window.MathJax.typesetClear([el]);
    await window.MathJax.typesetPromise([el]);
  };

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('pjax:success', render);
})();