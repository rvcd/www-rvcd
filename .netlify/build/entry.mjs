import { r as renderers } from './chunks/_@astro-renderers_DIrcUCWk.mjs';
import { a as actions } from './chunks/_noop-actions_CfKMStZn.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_Bjehih2G.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/about.astro.mjs');
const _page1 = () => import('./pages/community.astro.mjs');
const _page2 = () => import('./pages/donate.astro.mjs');
const _page3 = () => import('./pages/events/day-of-cultivation.astro.mjs');
const _page4 = () => import('./pages/events/magic-hour.astro.mjs');
const _page5 = () => import('./pages/events.astro.mjs');
const _page6 = () => import('./pages/involved.astro.mjs');
const _page7 = () => import('./pages/press.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/about.astro", _page0],
    ["src/pages/community.astro", _page1],
    ["src/pages/donate.astro", _page2],
    ["src/pages/events/day-of-cultivation.astro", _page3],
    ["src/pages/events/magic-hour.astro", _page4],
    ["src/pages/events/index.astro", _page5],
    ["src/pages/involved.astro", _page6],
    ["src/pages/press.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "6c70ba93-4de0-42cc-a5c4-93bdfa337e42"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
