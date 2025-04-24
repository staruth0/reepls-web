import { t } from "i18next";


const slides = [
  {
    text: 'slidetext',
    description: 'slide1_description',
  },
  {
    text: 'slide2_text',
    description: 'slide2_description',
  },
  {
    text: 'slide3_text',
    description: 'slide3_description',
  },
];



const interests = [
  t("science"),
  t("politics"),
  t("healthWellness"),
  t("technology"),
  t("art"),
  t("music"),
  t("literature"),
  t("sports"),
  t("travel"),
  t("history"),
  t("philosophy"),
  t("environment"),
  t("engineering")
];
const sampleArticle = `<h1 style="text-align: center">Rich Text Editor</h1><p>A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> for Reactjs</p><p></p><p style="text-align: center"></p><div style="text-align: center;" class="image"><img height="auto" src="https://picsum.photos/1920/1080.webp?t=1" align="center" width="500"></div><p></p><div data-type="horizontalRule"><hr></div><h2>Demo</h2><p>👉<a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://reactjs-tiptap-editor.vercel.app/">Demo</a></p><h2>Features</h2><ul><li><p>Use <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> components</p></li><li><p>Markdown support</p></li><li><p>TypeScript support</p></li><li><p>I18n support (vi, en, zh, pt)</p></li><li><p>React support</p></li><li><p>Slash Commands</p></li><li><p>Multi Column</p></li><li><p>TailwindCss</p></li><li><p>Support emoji</p></li><li><p>Support iframe</p></li><li><p>Support mermaid</p></li></ul><h2>Installation</h2><pre><code class="language-bash">pnpm add reactjs-tiptap-editor</code></pre><p></p>`;
const sampleArticle2 = `

<h1 dir="auto" style="text-align: center">Rich Text Editor</h1><p dir="auto">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> for Reactjs</p><p dir="auto"></p><p dir="auto" style="text-align: center"></p><p dir="auto"><div style="text-align: center;" class="image"><img height="auto" style="" src="https://picsum.photos/1920/1080.webp?t=1" flipx="false" flipy="false" width="500" align="center" inline="false"></div></p><p dir="auto"></p><div data-type="horizontalRule"><hr></div><h2 dir="auto">Demo</h2><p dir="auto">👉<a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://reactjs-tiptap-editor.vercel.app/">Demo</a></p><h2 dir="auto">Features</h2><ul><li><p dir="auto">Use <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> components</p></li><li><p dir="auto">Markdown support</p></li><li><p dir="auto">TypeScript support</p></li><li><p dir="auto">I18n support (vi, en, zh, pt)</p></li><li><p dir="auto">React support</p></li><li><p dir="auto">Slash Commands</p></li><li><p dir="auto">Multi Column</p></li><li><p dir="auto">TailwindCss</p></li><li><p dir="auto">Support emoji</p></li><li><p dir="auto">Support iframe</p></li><li><p dir="auto">Support mermaid</p></li></ul><h2 dir="auto">Installation</h2><pre><code class="language-bash">pnpm add reactjs-tiptap-editor</code></pre><p dir="auto"></p>
`;
export { interests, sampleArticle, sampleArticle2, slides };
