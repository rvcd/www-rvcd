import 'clsx';

const HYDRATION_START = '[';
const HYDRATION_END = ']';

const ATTR_REGEX = /[&"<]/g;

/**
 * @template V
 * @param {V} value
 * @param {boolean} [is_attr]
 */
function escape_html(value, is_attr) {
	const str = String(value ?? '');

	const pattern = ATTR_REGEX ;
	pattern.lastIndex = 0;

	let escaped = '';
	let last = 0;

	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : ch === '"' ? '&quot;' : '&lt;');
		last = i + 1;
	}

	return escaped + str.substring(last);
}

const whitespace = [...' \t\n\r\f\u00a0\u000b\ufeff'];

/**
 * @param {any} value
 * @param {string | null} [hash]
 * @param {Record<string, boolean>} [directives]
 * @returns {string | null}
 */
function to_class(value, hash, directives) {
	var classname = '' + value;

	if (directives) {
		for (var key in directives) {
			if (directives[key]) {
				classname = classname ? classname + ' ' + key : key;
			} else if (classname.length) {
				var len = key.length;
				var a = 0;

				while ((a = classname.indexOf(key, a)) >= 0) {
					var b = a + len;

					if (
						(a === 0 || whitespace.includes(classname[a - 1])) &&
						(b === classname.length || whitespace.includes(classname[b]))
					) {
						classname = (a === 0 ? '' : classname.substring(0, a)) + classname.substring(b + 1);
					} else {
						a = b;
					}
				}
			}
		}
	}

	return classname === '' ? null : classname;
}

const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;

/** @import { ComponentType, SvelteComponent } from 'svelte' */
/** @import { Component, Payload, RenderOutput } from '#server' */
/** @import { Store } from '#shared' */

/**
 * Array of `onDestroy` callbacks that should be called at the end of the server render function
 * @type {Function[]}
 */
let on_destroy = [];

/**
 * Creates an ID generator
 * @param {string} prefix
 * @returns {() => string}
 */
function props_id_generator(prefix) {
	let uid = 1;
	return () => `${prefix}s${uid++}`;
}

/**
 * Only available on the server and when compiling with the `server` option.
 * Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
 * @template {Record<string, any>} Props
 * @param {import('svelte').Component<Props> | ComponentType<SvelteComponent<Props>>} component
 * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} [options]
 * @returns {RenderOutput}
 */
function render(component, options = {}) {
	const uid = props_id_generator(options.idPrefix ? options.idPrefix + '-' : '');
	/** @type {Payload} */
	const payload = {
		out: '',
		css: new Set(),
		head: { title: '', out: '', css: new Set(), uid },
		uid
	};

	const prev_on_destroy = on_destroy;
	on_destroy = [];
	payload.out += BLOCK_OPEN;

	if (options.context) {
		push();
		/** @type {Component} */ (current_component).c = options.context;
	}

	// @ts-expect-error
	component(payload, options.props ?? {}, {}, {});

	if (options.context) {
		pop();
	}

	payload.out += BLOCK_CLOSE;
	for (const cleanup of on_destroy) cleanup();
	on_destroy = prev_on_destroy;

	let head = payload.head.out + payload.head.title;

	for (const { hash, code } of payload.css) {
		head += `<style id="${hash}">${code}</style>`;
	}

	return {
		head,
		html: payload.out,
		body: payload.out
	};
}

/**
 * @param {any} value
 * @param {string | undefined} [hash]
 * @param {Record<string, boolean>} [directives]
 */
function attr_class(value, hash, directives) {
	var result = to_class(value, hash, directives);
	return result ? ` class="${escape_html(result)}"` : '';
}

/**
 * Legacy mode: If the prop has a fallback and is bound in the
 * parent component, propagate the fallback value upwards.
 * @param {Record<string, unknown>} props_parent
 * @param {Record<string, unknown>} props_now
 */
function bind_props(props_parent, props_now) {
	for (const key in props_now) {
		const initial_value = props_parent[key];
		const value = props_now[key];
		if (
			initial_value === undefined &&
			value !== undefined &&
			Object.getOwnPropertyDescriptor(props_parent, key)?.set
		) {
			props_parent[key] = value;
		}
	}
}

/** @import { Component } from '#server' */

/** @type {Component | null} */
var current_component = null;

/**
 * @param {Function} [fn]
 */
function push(fn) {
	current_component = { p: current_component, c: null, d: null };
}

function pop() {
	var component = /** @type {Component} */ (current_component);

	var ondestroy = component.d;

	if (ondestroy) {
		on_destroy.push(...ondestroy);
	}

	current_component = component.p;
}

/** @import { Snippet } from 'svelte' */
/** @import { Payload } from '#server' */
/** @import { Getters } from '#shared' */

/**
 * Create a snippet programmatically
 * @template {unknown[]} Params
 * @param {(...params: Getters<Params>) => {
 *   render: () => string
 *   setup?: (element: Element) => void | (() => void)
 * }} fn
 * @returns {Snippet<Params>}
 */
function createRawSnippet(fn) {
	// @ts-expect-error the types are a lie
	return (/** @type {Payload} */ payload, /** @type {Params} */ ...args) => {
		var getters = /** @type {Getters<Params>} */ (args.map((value) => () => value));
		payload.out += fn(...getters)
			.render()
			.trim();
	};
}

function check(Component) {
	if (typeof Component !== 'function') return false;
	// Svelte 5 generated components always accept a `$$payload` prop.
	// This assumes that the SSR build does not minify it (which Astro enforces by default).
	// This isn't the best check, but the only other option otherwise is to try to render the
	// component, which is taxing. We'll leave it as a last resort for the future for now.
	return Component.toString().includes('$$payload');
}

function needsHydration(metadata) {
	// Adjust how this is hydrated only when the version of Astro supports `astroStaticSlot`
	return metadata.astroStaticSlot ? !!metadata.hydrate : true;
}

async function renderToStaticMarkup(Component, props, slotted, metadata) {
	const tagName = needsHydration(metadata) ? 'astro-slot' : 'astro-static-slot';

	let children = undefined;
	let $$slots = undefined;
	const renderProps = {};

	for (const [key, value] of Object.entries(slotted)) {
		// Legacy slot support
		$$slots ??= {};
		if (key === 'default') {
			$$slots.default = true;
			children = createRawSnippet(() => ({
				render: () => `<${tagName}>${value}</${tagName}>`,
			}));
		} else {
			$$slots[key] = createRawSnippet(() => ({
				render: () => `<${tagName} name="${key}">${value}</${tagName}>`,
			}));
		}
		// @render support for Svelte ^5.0
		const slotName = key === 'default' ? 'children' : key;
		renderProps[slotName] = createRawSnippet(() => ({
			render: () => `<${tagName}${key !== 'default' ? ` name="${key}"` : ''}>${value}</${tagName}>`,
		}));
	}

	const result = render(Component, {
		props: {
			...props,
			children,
			$$slots,
			...renderProps,
		},
	});
	return { html: result.body };
}

const _renderer0 = {
	name: '@astrojs/svelte',
	check,
	renderToStaticMarkup,
	supportsAstroStaticSlot: true,
};

const renderers = [Object.assign({"name":"@astrojs/svelte","clientEntrypoint":"@astrojs/svelte/client.js","serverEntrypoint":"@astrojs/svelte/server.js"}, { ssr: _renderer0 }),];

export { attr_class as a, bind_props as b, renderers as r };
