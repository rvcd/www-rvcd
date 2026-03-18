import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { o as NOOP_MIDDLEWARE_HEADER, p as decodeKey } from './chunks/astro/server_BTMk7Z7V.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/dvantuyl/ws/www-rvcd/","cacheDir":"file:///Users/dvantuyl/ws/www-rvcd/node_modules/.astro/","outDir":"file:///Users/dvantuyl/ws/www-rvcd/dist/","srcDir":"file:///Users/dvantuyl/ws/www-rvcd/src/","publicDir":"file:///Users/dvantuyl/ws/www-rvcd/public/","buildClientDir":"file:///Users/dvantuyl/ws/www-rvcd/dist/","buildServerDir":"file:///Users/dvantuyl/ws/www-rvcd/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"community/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/community","isIndex":false,"type":"page","pattern":"^\\/community\\/?$","segments":[[{"content":"community","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/community.astro","pathname":"/community","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"donate/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/donate","isIndex":false,"type":"page","pattern":"^\\/donate\\/?$","segments":[[{"content":"donate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/donate.astro","pathname":"/donate","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"events/day-of-cultivation/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/events/day-of-cultivation","isIndex":false,"type":"page","pattern":"^\\/events\\/day-of-cultivation\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"day-of-cultivation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/day-of-cultivation.astro","pathname":"/events/day-of-cultivation","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"events/magic-hour/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/events/magic-hour","isIndex":false,"type":"page","pattern":"^\\/events\\/magic-hour\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"magic-hour","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/magic-hour.astro","pathname":"/events/magic-hour","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"events/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/events","isIndex":true,"type":"page","pattern":"^\\/events\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/index.astro","pathname":"/events","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"involved/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/involved","isIndex":false,"type":"page","pattern":"^\\/involved\\/?$","segments":[[{"content":"involved","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/involved.astro","pathname":"/involved","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"press/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/press","isIndex":false,"type":"page","pattern":"^\\/press\\/?$","segments":[[{"content":"press","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/press.astro","pathname":"/press","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://rainiervalleycreativedistrict.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/dvantuyl/ws/www-rvcd/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/community.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/donate.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/events/day-of-cultivation.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/events/index.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/events/magic-hour.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/involved.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/press.astro",{"propagation":"none","containsHead":true}],["/Users/dvantuyl/ws/www-rvcd/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/community@_@astro":"pages/community.astro.mjs","\u0000@astro-page:src/pages/donate@_@astro":"pages/donate.astro.mjs","\u0000@astro-page:src/pages/events/day-of-cultivation@_@astro":"pages/events/day-of-cultivation.astro.mjs","\u0000@astro-page:src/pages/events/magic-hour@_@astro":"pages/events/magic-hour.astro.mjs","\u0000@astro-page:src/pages/events/index@_@astro":"pages/events.astro.mjs","\u0000@astro-page:src/pages/involved@_@astro":"pages/involved.astro.mjs","\u0000@astro-page:src/pages/press@_@astro":"pages/press.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bjehih2G.mjs","/Users/dvantuyl/ws/www-rvcd/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_D57FxhB8.mjs","/Users/dvantuyl/ws/www-rvcd/src/components/InfoBtn.svelte":"_astro/InfoBtn.448mSyvJ.js","/Users/dvantuyl/ws/www-rvcd/src/components/Header.svelte":"_astro/Header.DX-Nm4UE.js","@astrojs/svelte/client.js":"_astro/client.svelte.BK0Q9bHJ.js","/Users/dvantuyl/ws/www-rvcd/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.e7vEs6x6.js","/Users/dvantuyl/ws/www-rvcd/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_1_lang.CdEAproe.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/dvantuyl/ws/www-rvcd/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","window.dataLayer=window.dataLayer||[];function a(){dataLayer.push(arguments)}a(\"js\",new Date);a(\"config\",\"G-3VXE8WRK27\");"],["/Users/dvantuyl/ws/www-rvcd/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts","(function(e,n,r,t,m){e[t]=e[t]||[],e[t].push({\"gtm.start\":new Date().getTime(),event:\"gtm.js\"});var g=n.getElementsByTagName(r)[0],a=n.createElement(r),s=\"\";a.async=!0,a.src=\"https://www.googletagmanager.com/gtm.js?id=\"+m+s,g.parentNode.insertBefore(a,g)})(window,document,\"script\",\"dataLayer\",\"GTM-MPG7W3J\");"]],"assets":["/_astro/4Culture-Logo.DshlmoUK.png","/_astro/about.ChcuYl0a.css","/CNAME","/android-chrome-192x192.png","/android-chrome-512x512.png","/apple-touch-icon.png","/favicon-16x16.png","/favicon-32x32.png","/favicon.ico","/site.webmanifest","/_astro/Header.DX-Nm4UE.js","/_astro/InfoBtn.448mSyvJ.js","/_astro/client.svelte.BK0Q9bHJ.js","/_astro/index.BFvGoWfL.js","/_astro/render.BLxp8OUP.js","/assets/fonts/GlacialIndifference-Bold.otf","/assets/fonts/GlacialIndifference-Italic.otf","/assets/fonts/GlacialIndifference-Regular.otf","/assets/fonts/Prata-Regular.ttf","/assets/pdfs/RVCD_Press_Announce.pdf","/assets/pdfs/magic-hour-event.pdf","/assets/pdfs/rvcd-mural-map.pdf","/assets/pdfs/volunteer-pizza-party.pdf","/assets/images/supporters/4Culture-Logo.png","/assets/images/community/206-zulu.jpg","/assets/images/community/adefua.png","/assets/images/community/hfw.png","/assets/images/community/khmer.png","/assets/images/community/mas.jpg","/assets/images/community/rac.png","/assets/images/community/rbac.png","/assets/images/community/seed-arts.png","/assets/images/community/swps.jpg","/assets/images/community/syso.png","/assets/images/community/wanawari.jpg","/about/index.html","/community/index.html","/donate/index.html","/events/day-of-cultivation/index.html","/events/magic-hour/index.html","/events/index.html","/involved/index.html","/press/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"NaH0IAuhIvBZUJjUozZUCtnCHSMwVFKSRY/BIILYiCU="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
