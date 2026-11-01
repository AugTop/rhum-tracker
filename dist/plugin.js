const __pluginConfig =  {
  "name": "windy-plugin-rhum-tracker",
  "version": "1.0.0",
  "icon": "⛵",
  "title": "Route du Rhum 2026 · Tracker",
  "description": "Suivi en direct de la Route du Rhum 2026 : flotte complète, historique des traces, replay, classement par classe et fiche bateau.",
  "author": "Augustin",
  "repository": "https://github.com/AugTop/rhum-tracker",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/rhum-tracker",
  "private": true,
  "built": 1793562961147,
  "builtReadable": "2026-11-01T19:56:01.147Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/** @type {typeof globalThis} */
const globals =
	typeof window !== 'undefined'
		? window
		: typeof globalThis !== 'undefined'
		? globalThis
		: // @ts-ignore Node typings have this
		  global;

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} name
 * @returns {SVGElement}
 */
function svg_element(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @returns {(event: any) => any} */
function stop_propagation(fn) {
	return function (event) {
		event.stopPropagation();
		// @ts-ignore
		return fn.call(this, event);
	};
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @type {Outro}
 */
let outros;

/**
 * @returns {void} */
function group_outros() {
	outros = {
		r: 0,
		c: [],
		p: outros // parent group
	};
}

/**
 * @returns {void} */
function check_outros() {
	if (!outros.r) {
		run_all(outros.c);
	}
	outros = outros.p;
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} local
 * @param {0 | 1} [detach]
 * @param {() => void} [callback]
 * @returns {void}
 */
function transition_out(block, local, detach, callback) {
	if (block && block.o) {
		if (outroing.has(block)) return;
		outroing.add(block);
		outros.c.push(() => {
			outroing.delete(block);
			if (callback) {
				if (detach) block.d(1);
				callback();
			}
		});
		block.o(local);
	} else if (callback) {
		callback();
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

// keyed each functions:

/** @returns {void} */
function destroy_block(block, lookup) {
	block.d(1);
	lookup.delete(block.key);
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
}

/** @returns {void} */
function create_component(block) {
	block && block.c();
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    title: 'Route du Rhum 2026 · Tracker'};

/* src/components/Sparkline.svelte generated by Svelte v4.2.20 */

function add_css$1(target) {
	append_styles(target, "svelte-3mwn2d", ".spark.svelte-3mwn2d{width:100%;height:46px;display:block}.cursor.svelte-3mwn2d{stroke:rgba(255, 255, 255, 0.55);stroke-width:1;stroke-dasharray:2 2;vector-effect:non-scaling-stroke}");
}

// (2:4) {#if path}
function create_if_block$1(ctx) {
	let defs;
	let linearGradient;
	let stop0;
	let stop1;
	let path0;
	let path0_d_value;
	let path1;
	let if_block_anchor;
	let if_block = /*cursorX*/ ctx[2] !== null && create_if_block_1$1(ctx);

	return {
		c() {
			defs = svg_element("defs");
			linearGradient = svg_element("linearGradient");
			stop0 = svg_element("stop");
			stop1 = svg_element("stop");
			path0 = svg_element("path");
			path1 = svg_element("path");
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(stop0, "offset", "0");
			attr(stop0, "stop-color", /*color*/ ctx[0]);
			attr(stop0, "stop-opacity", "0.35");
			attr(stop1, "offset", "1");
			attr(stop1, "stop-color", /*color*/ ctx[0]);
			attr(stop1, "stop-opacity", "0");
			attr(linearGradient, "id", "g-" + /*uid*/ ctx[3]);
			attr(linearGradient, "x1", "0");
			attr(linearGradient, "x2", "0");
			attr(linearGradient, "y1", "0");
			attr(linearGradient, "y2", "1");
			attr(path0, "d", path0_d_value = "" + (/*path*/ ctx[1] + " L" + VW + "," + VH + " L0," + VH + " Z"));
			attr(path0, "fill", "url(#g-" + /*uid*/ ctx[3] + ")");
			attr(path1, "d", /*path*/ ctx[1]);
			attr(path1, "fill", "none");
			attr(path1, "stroke", /*color*/ ctx[0]);
			attr(path1, "stroke-width", "1.6");
			attr(path1, "vector-effect", "non-scaling-stroke");
		},
		m(target, anchor) {
			insert(target, defs, anchor);
			append(defs, linearGradient);
			append(linearGradient, stop0);
			append(linearGradient, stop1);
			insert(target, path0, anchor);
			insert(target, path1, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*color*/ 1) {
				attr(stop0, "stop-color", /*color*/ ctx[0]);
			}

			if (dirty & /*color*/ 1) {
				attr(stop1, "stop-color", /*color*/ ctx[0]);
			}

			if (dirty & /*path*/ 2 && path0_d_value !== (path0_d_value = "" + (/*path*/ ctx[1] + " L" + VW + "," + VH + " L0," + VH + " Z"))) {
				attr(path0, "d", path0_d_value);
			}

			if (dirty & /*path*/ 2) {
				attr(path1, "d", /*path*/ ctx[1]);
			}

			if (dirty & /*color*/ 1) {
				attr(path1, "stroke", /*color*/ ctx[0]);
			}

			if (/*cursorX*/ ctx[2] !== null) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(defs);
				detach(path0);
				detach(path1);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

// (11:8) {#if cursorX !== null}
function create_if_block_1$1(ctx) {
	let line;

	return {
		c() {
			line = svg_element("line");
			attr(line, "x1", /*cursorX*/ ctx[2]);
			attr(line, "x2", /*cursorX*/ ctx[2]);
			attr(line, "y1", "0");
			attr(line, "y2", VH);
			attr(line, "class", "cursor svelte-3mwn2d");
		},
		m(target, anchor) {
			insert(target, line, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*cursorX*/ 4) {
				attr(line, "x1", /*cursorX*/ ctx[2]);
			}

			if (dirty & /*cursorX*/ 4) {
				attr(line, "x2", /*cursorX*/ ctx[2]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(line);
			}
		}
	};
}

function create_fragment$1(ctx) {
	let svg;
	let if_block = /*path*/ ctx[1] && create_if_block$1(ctx);

	return {
		c() {
			svg = svg_element("svg");
			if (if_block) if_block.c();
			attr(svg, "class", "spark svelte-3mwn2d");
			attr(svg, "viewBox", "0 0 " + VW + " " + VH);
			attr(svg, "preserveAspectRatio", "none");
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			if (if_block) if_block.m(svg, null);
		},
		p(ctx, [dirty]) {
			if (/*path*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(svg, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(svg);
			}

			if (if_block) if_block.d();
		}
	};
}

const VW = 300;
const VH = 46;

function instance$1($$self, $$props, $$invalidate) {
	let { data = [] } = $$props;
	let { color = '#3ea8ff' } = $$props;
	let { invert = false } = $$props;
	let { tMin = null } = $$props;
	let { tMax = null } = $$props;
	let { cursor = null } = $$props;
	const uid = Math.random().toString(36).slice(2, 8);
	let path = '';
	let cursorX = null;

	$$self.$$set = $$props => {
		if ('data' in $$props) $$invalidate(4, data = $$props.data);
		if ('color' in $$props) $$invalidate(0, color = $$props.color);
		if ('invert' in $$props) $$invalidate(5, invert = $$props.invert);
		if ('tMin' in $$props) $$invalidate(6, tMin = $$props.tMin);
		if ('tMax' in $$props) $$invalidate(7, tMax = $$props.tMax);
		if ('cursor' in $$props) $$invalidate(8, cursor = $$props.cursor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data, tMin, tMax, invert, cursor*/ 496) {
			{
				$$invalidate(1, path = '');
				$$invalidate(2, cursorX = null);

				if (data.length > 1) {
					const t0 = tMin ?? data[0][0];
					const t1 = tMax ?? data[data.length - 1][0];
					let lo = Infinity;
					let hi = -Infinity;

					for (const [,v] of data) {
						lo = Math.min(lo, v);
						hi = Math.max(hi, v);
					}

					if (hi === lo) hi = lo + 1;
					const x = t => (t - t0) / Math.max(1, t1 - t0) * VW;

					const y = v => {
						const n = (v - lo) / (hi - lo);
						return 3 + (invert ? n : 1 - n) * (VH - 6);
					};

					$$invalidate(1, path = data.map(([t, v], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(' '));
					if (cursor !== null) $$invalidate(2, cursorX = x(cursor));
				}
			}
		}
	};

	return [color, path, cursorX, uid, data, invert, tMin, tMax, cursor];
}

class Sparkline extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				data: 4,
				color: 0,
				invert: 5,
				tMin: 6,
				tMax: 7,
				cursor: 8
			},
			add_css$1
		);
	}
}

// Métadonnées des bateaux (id Geovoile → nom, skipper, classe, couleur officielle).
// Les bateaux absents de cette liste reçoivent leur classe par déduction (voir data.ts)
// et un nom générique : complète la liste au besoin.
const CLASSES = [
    {
        name: 'Ultim',
        short: 'ULT',
        color: '#ff4d5e'
    },
    {
        name: 'Ocean Fifty',
        short: 'O50',
        color: '#ffb020'
    },
    {
        name: 'IMOCA',
        short: 'IMO',
        color: '#3ea8ff'
    },
    {
        name: 'Class40',
        short: 'C40',
        color: '#2ee6a6'
    },
    {
        name: 'Vintage Multi',
        short: 'VMU',
        color: '#c084fc'
    },
    {
        name: 'Vintage Mono',
        short: 'VMO',
        color: '#f472b6'
    }
];
const MULTIHULLS = new Set([
    'Ultim',
    'Ocean Fifty',
    'Vintage Multi'
]);
const b = (id, name, className, color, skipper, nat = 'FRA')=>({
        id,
        name,
        skipper,
        className,
        color,
        nat
    });
const BOATS = [
    // Ultim
    b('7', 'ACTUAL Ultim 4', 'Ultim', '#DD272F', 'Anthony Marchand'),
    b('1', 'IDEC Sport - CIC', 'Ultim', '#EF4030', 'Alexia Barrier'),
    b('8', 'LIAMM', 'Ultim', '#D24813', 'Guirec Soudée'),
    b('6', 'Maxi Banque Populaire XI', 'Ultim', '#4ACFFA', "Armel Le Cléac'h"),
    b('3', 'Maxi Edmond de Rothschild', 'Ultim', '#FFCE21', 'Charles Caudrelier'),
    b('4', 'SODEBO Ultim 3', 'Ultim', '#78C648', 'Thomas Coville'),
    b('5', 'SVR-Lazartigue', 'Ultim', '#31AFE9', 'Tom Laperche'),
    b('2', 'Ultim Armand Thiery', 'Ultim', '#F256A2', 'Louis Burton'),
    // Ocean Fifty
    b('10', 'Edenred 5', 'Ocean Fifty', '#FF0000', 'Basile Bourgnon'),
    b('17', 'Elvest', 'Ocean Fifty', '#DD4A29', 'Matthieu Perraut'),
    b('11', 'La French Fab', 'Ocean Fifty', '#02ACFC', 'Laurent Bourgues'),
    b('14', 'Lazare x Hellio', 'Ocean Fifty', '#F15C94', 'Erwan Le Draoulec'),
    b('9', 'Le Rire Medecin - Lamotte', 'Ocean Fifty', '#E30038', 'Luke Berry'),
    b('16', 'Sodebo Fifty', 'Ocean Fifty', '#EE7658', 'Léonard Legrand'),
    b('19', 'Solidaires En Peloton by Delanchy', 'Ocean Fifty', '#E74D14', 'Thibaut Vauchel-Camus'),
    b('13', 'Upwind By Merconcept', 'Ocean Fifty', '#F3694E', 'Anne-Claire Le Berre'),
    b('12', 'Viabilis Oceans', 'Ocean Fifty', '#A8D698', 'Baptiste Hulin'),
    b('18', 'Wewise', 'Ocean Fifty', '#F7ED37', 'Pierre Quiroga'),
    // IMOCA
    b('27', '11th Hour Racing', 'IMOCA', '#F68A33', 'Francesca Clapcich', 'ITA'),
    b('23', 'Allagrande Mapei', 'IMOCA', '#00B3E3', 'Ambrogio Beccaria', 'ITA'),
    b('30', 'Anett - Kalhyge', 'IMOCA', '#CCCCCC', 'Jean-Baptiste Daramy'),
    b('25', 'April Marine + Recherche Co-partenaire', 'IMOCA', '#38FF00', 'Arnaud Boissières'),
    b('26', 'Association Petits Princes Queguiner', 'IMOCA', '#D33826', 'Elodie Bonafous'),
    b('22', 'Bureau Vallée', 'IMOCA', '#000000', 'Davy Beaudart'),
    b('29', 'Café Joyeux', 'IMOCA', '#FFE333', "Nicolas D'estais"),
    b('24', 'Charal', 'IMOCA', '#181A27', 'Jérémie Beyou'),
    b('28', 'Coup de Pouce', 'IMOCA', '#EA9440', 'Manuel Cousin'),
    b('37', 'Demain c’est loin', 'IMOCA', '#FF1A1C', 'Nicolas Rouger'),
    b('20', 'FDJ United', 'IMOCA', '#3BA3E7', 'Fabrice Amedeo'),
    b('36', 'Foussier', 'IMOCA', '#C55327', 'Sébastien Marsset'),
    b('38', 'Groupe Dubreuil - Air Caraïbes', 'IMOCA', '#E5DD45', 'Sébastien Simon'),
    b('31', 'Initiatives Coeur', 'IMOCA', '#8C1515', 'Violette Dorange'),
    b('41', "Les P'tits Doudous", 'IMOCA', '#C52264', 'Armel Tripon'),
    b('32', 'Macif Santé Prévoyance', 'IMOCA', '#265BB2', 'Sam Goodchild', 'FRA GBR'),
    b('34', 'MACSF', 'IMOCA', '#BD3A36', 'Corentin Horeau'),
    b('33', 'Malizia 4', 'IMOCA', '#A9A5A4', 'Boris Herrmann', 'GER'),
    b('40', 'Milai - Furuno', 'IMOCA', '#FFFFFF', 'Masa Suzuki', 'JPN'),
    b('21', 'Resilient', 'IMOCA', '#1EABE3', 'Pierre-louis Attwell'),
    b('35', 'Respire', 'IMOCA', '#FF982C', 'Robin Marais'),
    b('39', 'Vaincre la Mucoviscidose', 'IMOCA', '#545454', 'Maxime Sorel'),
    // Class40
    b('90', 'Afterdara-Elcia', 'Class40', '#FF9700', 'Alexis Thomas'),
    b('61', 'Alderan', 'Class40', '#5F6477', 'Sasha Lanièce'),
    b('42', 'Alice Milliat Foundation', 'Class40', '#CFFF00', 'Aina Bauza Roig', 'ESP'),
    b('60', 'Alternative Sailing - Constructions Du Belon', 'Class40', '#FFD457', "Guillaume L'hostis"),
    b('72', 'Amarris', 'Class40', '#5BB8DD', 'Achille Nebout'),
    b('88', 'BARCO BRESIL', 'Class40', '#F2D21B', 'Gaëtan THOMAS', 'BEL'),
    b('55', 'Belgium Ocean Racing - Curium', 'Class40', '#F6543D', 'Jonas Gerckens', 'BEL'),
    b('63', 'Bleu Blanc Planète Location', 'Class40', '#FEFFFF', 'Quentin Le Nabour'),
    b('66', 'Crédit Mutuel', 'Class40', '#DE2521', 'Ian Lipinski'),
    b('86', 'Djemila Sailing - Belgium Ocean Racing', 'Class40', '#5AAEC2', 'Djemila Tassin', 'BEL'),
    b('73', 'Drépavoile', 'Class40', '#00FF5E', 'Kéni Piperol'),
    b('51', "Défi Solidaire - avec Ellye et l'Arche", 'Class40', '#6D6E72', 'Sophie Faguet'),
    b('84', 'Ekinox', 'Class40', '#F3B82C', 'Benoit Sineau'),
    b('65', '#EMPOWHER', 'Class40', '#41C1BA', 'Pamela Lee', 'IRL'),
    b('81', 'Eora', 'Class40', '#23AEE7', 'Rupert Henry', 'AUS'),
    b('89', 'Exalt', 'Class40', '#00FFF5', 'Axel Trehin'),
    b('62', 'Fondation ARC', 'Class40', '#D1E0F3', 'Mateo Le Calvic'),
    b('52', 'Funae', 'Class40', '#FFFFFF', 'Loïc Fequet'),
    b('67', 'Groupe Réel', 'Class40', '#FFFFFF', 'Alexis Loison'),
    b('77', 'Gustave Roussy', 'Class40', '#C91E2C', 'Christophe Rateau'),
    b('71', 'Hirsch - Centrakor', 'Class40', '#D1E0F3', 'Mikael Mergui'),
    b('56', 'Imagin’ Act-SOCOMEC', 'Class40', '#FFFFFF', 'Marco Guerra', 'ITA'),
    b('54', 'Influence 2', 'Class40', '#FFFFFF', 'Andrea Fornaro', 'ITA'),
    b('46', 'Inherent-phare 40', 'Class40', '#FFA000', 'Mathieu Claveau'),
    b('59', 'Inland Roots, Ocean Soul', 'Class40', '#FFFFFF', 'Milan Kolacek', 'CZE'),
    b('64', 'Institut Imagine', 'Class40', '#FF00AA', 'Pierre Leboucher'),
    b('49', 'Legallais', 'Class40', '#F5E208', 'Fabien Delahaye'),
    b('83', 'Lucente', 'Class40', '#092A50', 'Matteo Sericano', 'ITA'),
    b('80', 'Maccaferri Futura', 'Class40', '#D1E0F3', 'Luca Rosetti', 'ITA'),
    b('87', 'Mic Odyssey', 'Class40', '#FFFFFF', 'Jean-baptiste Ternon'),
    b('78', 'Mussulo40', 'Class40', '#FFFFFF', 'Yanick Rebuffat'),
    b('48', 'OceanConnect', 'Class40', '#F68D2A', 'Yves Courbon'),
    b('70', 'Patapain - Les Invincibles', 'Class40', '#D1E0F3', 'William Mathelin Moreaux'),
    b('79', 'Pierreval - Fondation GoodPlanet', 'Class40', '#AABF16', 'Vincent Riou'),
    b('45', 'Plastic Odyssey', 'Class40', '#D1E0F3', 'Jules Bonnier'),
    b('69', 'Qwanza', 'Class40', '#E47200', 'Goulven Marie'),
    b('76', 'Renovatec Sailing Team', 'Class40', '#FFFFFF', 'Ulysse Pozzoli'),
    b('85', 'Réauté Chocolat', 'Class40', '#D1E0F3', 'Lomano Takasi'),
    b('82', 'Rêve De Large 5', 'Class40', '#F4B719', 'Rodolphe Sepho'),
    b('68', 'Sireco', 'Class40', '#D1E0F3', 'Thomas Lurton'),
    b('50', 'SNSM, faites un don !', 'Class40', '#FFFFFF', 'Corentin Douguet'),
    b('74', 'Sogestran - Seafrigo', 'Class40', '#018A70', 'Guillaume Pirouelle'),
    b('53', 'Solano', 'Class40', '#D1E0F3', 'Robin Follin'),
    b('75', 'Team Zeiss', 'Class40', '#DDDB01', 'Thimoté Polet'),
    b('57', 'Viranga', 'Class40', '#E84487', 'Emmanuel Hamez'),
    b('47', 'VSF Sports', 'Class40', '#65D037', 'Pep Costa', 'ESP'),
    b('44', 'Wasabiii', 'Class40', '#FFFFFF', 'Stéphane Bodin'),
    b('58', 'Woman of Course', 'Class40', '#E71100', 'Théa Khelif'),
    b('43', 'Yoda', 'Class40', '#1695B5', 'Yohan Bertrand'),
    // Vintage Multi
    b('92', "Acapella - Proludic - La Chaine de l'Espoir", 'Vintage Multi', '#F2D21B', 'Charlie Capelle'),
    b('104', 'Arkea - Handicap International', 'Vintage Multi', '#FFFFFF', 'Damien Seguin'),
    b('91', 'Des Enfants Et Des Arbres', 'Vintage Multi', '#FFFFFF', 'Christophe Bogrand'),
    b('94', 'Fifty Fifty', 'Vintage Multi', '#0071FF', 'Laurent Etheimer'),
    b('101', 'French Touch Oceans Club', 'Vintage Multi', '#FFFFFF', 'Eric Peron'),
    b('95', 'Graine De Courage', 'Vintage Multi', '#2500FF', 'Florian Gueguen'),
    b('99', 'Groupe GCA', 'Vintage Multi', '#BC00FF', 'Gilles Lamire'),
    b('96', 'MG5-Wellness Training', 'Vintage Multi', '#FF0012', 'Marc Guillemot'),
    b('98', 'Oceans', 'Vintage Multi', '#B26900', 'Francis Joyon'),
    b('103', 'Perros-Guirec', 'Vintage Multi', '#E2D21A', 'Thierry Roger'),
    b('93', 'Trilogik', 'Vintage Multi', '#91B200', 'David Ducosson'),
    b('102', 'Use It Again', 'Vintage Multi', '#27B200', 'Romain Pilliard'),
    b('97', 'We Explore', 'Vintage Multi', '#00B242', 'François Guiffant'),
    // Vintage Mono
    b('113', 'Alegria', 'Vintage Mono', '#CFFF00', 'Jean Le Cam'),
    b('112', 'Armor-Lux - Le Finistère Assurance', 'Vintage Mono', '#FF9700', 'Kieran Le Borgne'),
    b('107', 'Echo-mer', 'Vintage Mono', '#38FF00', 'Wilfried Clerton'),
    b('116', 'Ecolhuma', 'Vintage Mono', '#00FF5E', 'Olivier Nemsguern'),
    b('106', 'Eurvad', 'Vintage Mono', '#00FFF5', 'Tanguy Caradec'),
    b('110', 'Faiaoahe', 'Vintage Mono', '#0071FF', 'Remy Gerin'),
    b('115', 'Feve - Votre Épargne Finance Des Fermes Bio', 'Vintage Mono', '#2500FF', 'Frédéric Mailhos'),
    b('105', 'Grain De Sable', 'Vintage Mono', '#FF00AA', 'Christophe Bachmann'),
    b('111', 'Groupe Cogedis Pour Enfants Du Mékong', 'Vintage Mono', '#FF0012', 'Patrick Isoard'),
    b('114', 'Le Cigare Rouge', 'Vintage Mono', '#C91F2C', 'Sidney Gavignet'),
    b('108', 'Snsm Guilvinec', 'Vintage Mono', '#B26900', 'Gilles Colubi'),
    b('109', 'Tagaroa', 'Vintage Mono', '#91B200', 'Amaury De Jamblinne De Meux', 'BEL'),
    b('117', 'Use It Again For Youth', 'Vintage Mono', '#27B200', 'Titouan Pilliard')
];
const BOATS_BY_ID = new Map(BOATS.map((m)=>[
        m.id,
        m
    ]));
const classColor = (className)=>CLASSES.find((c)=>c.name === className)?.color ?? '#9aa4b2';
// Ligne de départ / arrivée
const START = {
    lat: 48.72,
    lon: -1.84,
    label: 'Départ · Saint-Malo'
};
const FINISH = {
    lat: 16.225,
    lon: -61.53,
    label: 'Arrivée · Pointe-à-Pitre'
};
const RACE_START = Date.UTC(2026, 10, 1, 12, 2) / 1000; // 1er nov. 2026, 13h02 Paris

// ---- Sources -------------------------------------------------------------
// Flux live (relais du tracker officiel Geovoile).
const LIVE_URL = 'https://route-du-rhum-live.andamarco.workers.dev/live.json';
// Historique complet collecté par la GitHub Action du dépôt (voir collector/).
// Laisser vide = historique local uniquement.
const HISTORY_URL = 'https://raw.githubusercontent.com/AugTop/rhum-tracker/main/data/history.json';
const LS_KEY = 'rr2026-history-v1';
const num = (v)=>typeof v === 'number' && isFinite(v) ? v : 0;
function parseLive(raw) {
    const rep = raw?.reports;
    const cols = rep?.columns ?? [];
    const ix = (k)=>cols.indexOf(k);
    const h = rep?.history?.[0];
    if (!h) throw new Error('Rapport vide');
    const g = (line, k)=>num(line[ix(k)]);
    const lines = h.lines.map((line)=>{
        const id = String(line[ix('boat')]);
        const state = {
            status: String(line[ix('racestatus')] ?? ''),
            rank: g(line, 'rank'),
            dtf: g(line, 'dtf'),
            dtl: g(line, 'dtl'),
            heading: g(line, 'heading'),
            speed: g(line, 'speed'),
            vmg: g(line, 'vmg'),
            vitmax4: g(line, 'vitmax4'),
            dog: g(line, 'dog'),
            windDir: g(line, 'winddir'),
            windSpeed: g(line, 'windspeed') / 10,
            windGust: g(line, 'windgust') / 10,
            currentDir: g(line, 'currentdir'),
            currentSpeed: g(line, 'currentspeed') / 10,
            waveDir: g(line, 'wavedir'),
            waveHeight: g(line, 'waveheight') / 10,
            tempAir: g(line, 'tempair') / 10,
            tempWater: g(line, 'tempwater') / 10
        };
        const trackRaw = line[ix('track')] ?? [];
        const track = trackRaw.filter((p)=>Array.isArray(p) && p.length >= 3).map((p)=>[
                num(p[0]),
                num(p[1]),
                num(p[2]),
                num(p[3])
            ]);
        return {
            id,
            state,
            track
        };
    });
    return {
        date: Date.parse(h.date) / 1000,
        state: rep?.state ?? '',
        lines
    };
}
/**
 * Les lignes Geovoile sont groupées par classe, rang 1..n dans chaque groupe.
 * On déduit la classe des bateaux inconnus à partir du groupe auquel ils appartiennent.
 */ function inferClasses(lines) {
    const groups = [];
    let prevRank = Infinity;
    for (const l of lines){
        if (l.state.status !== 'RAC' || !l.state.rank) continue;
        if (l.state.rank <= prevRank && l.state.rank === 1) groups.push([]);
        if (!groups.length) groups.push([]);
        groups[groups.length - 1].push(l.id);
        prevRank = l.state.rank;
    }
    const out = new Map();
    const used = new Set();
    groups.forEach((ids)=>{
        const known = ids.map((id)=>BOATS_BY_ID.get(id)?.className).find(Boolean);
        if (known) {
            used.add(known);
            ids.forEach((id)=>out.set(id, known));
        }
    });
    // Groupes sans aucun bateau connu : on suit l'ordre officiel des classes
    groups.forEach((ids, gi)=>{
        if (out.has(ids[0])) return;
        const cls = CLASSES[gi]?.name ?? CLASSES.find((c)=>!used.has(c.name))?.name ?? 'Autres';
        ids.forEach((id)=>out.set(id, cls));
    });
    return out;
}
// ---- Historique -----------------------------------------------------------
function emptyHistory() {
    return {
        updated: 0,
        tracks: {},
        ranks: {}
    };
}
function mergeSorted(a = [], b = []) {
    if (!b.length) return a;
    const m = new Map();
    for (const p of a)m.set(p[0], p);
    for (const p of b)m.set(p[0], p);
    return [
        ...m.values()
    ].filter((p)=>p[0] >= RACE_START - 3600).sort((x, y)=>x[0] - y[0]);
}
function mergeHistory(base, add) {
    const out = {
        updated: Math.max(base.updated, add.updated),
        tracks: {},
        ranks: {}
    };
    const ids = new Set([
        ...Object.keys(base.tracks),
        ...Object.keys(add.tracks)
    ]);
    ids.forEach((id)=>out.tracks[id] = mergeSorted(base.tracks[id], add.tracks[id]));
    const rids = new Set([
        ...Object.keys(base.ranks),
        ...Object.keys(add.ranks)
    ]);
    rids.forEach((id)=>out.ranks[id] = mergeSorted(base.ranks[id], add.ranks[id]));
    return out;
}
function liveToHistory(live) {
    const h = emptyHistory();
    h.updated = live.date;
    for (const l of live.lines){
        h.tracks[l.id] = l.track;
        if (l.state.rank) h.ranks[l.id] = [
            [
                live.date,
                l.state.rank,
                l.state.dtl
            ]
        ];
    }
    return h;
}
function loadLocal() {
    try {
        const s = localStorage.getItem(LS_KEY);
        return s ? JSON.parse(s) : emptyHistory();
    } catch  {
        return emptyHistory();
    }
}
function saveLocal(h) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(h));
    } catch  {
    /* quota / mode privé : tant pis */ }
}
async function getJSON(url) {
    const sep = url.includes('?') ? '&' : '?';
    const r = await fetch(`${url}${sep}v=${Date.now()}`, {
        cache: 'no-store'
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json();
}
async function fetchRemoteHistory() {
    if (HISTORY_URL.includes('<user>')) return null;
    try {
        return await getJSON(HISTORY_URL);
    } catch (e) {
        console.warn('[Rhum] historique distant indisponible', e);
        return null;
    }
}
async function fetchLive() {
    return parseLive(await getJSON(LIVE_URL));
}
function buildSnapshot(live, hist) {
    const classes = inferClasses(live.lines);
    const boats = live.lines.map((l)=>{
        const meta = BOATS_BY_ID.get(l.id);
        const className = meta?.className ?? classes.get(l.id) ?? 'Autres';
        return {
            id: l.id,
            name: meta?.name ?? `Bateau n°${l.id}`,
            skipper: meta?.skipper ?? '',
            className,
            color: meta?.color ?? '#cfd6e0',
            nat: meta?.nat ?? '',
            state: l.state,
            track: hist.tracks[l.id] ?? l.track,
            ranks: hist.ranks[l.id] ?? []
        };
    });
    return {
        reportDate: live.date,
        state: live.state,
        boats
    };
}

const R_NM = 3440.065;
const rad = (d)=>d * Math.PI / 180;
const deg = (r)=>r * 180 / Math.PI;
function distNm(lat1, lon1, lat2, lon2) {
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}
function bearing(lat1, lon1, lat2, lon2) {
    const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
    const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) - Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
    return (deg(Math.atan2(y, x)) + 360) % 360;
}
/** Index du dernier point dont t <= time (−1 si aucun). */ function indexAt(track, time) {
    let lo = 0;
    let hi = track.length - 1;
    if (hi < 0 || track[0][0] > time) return -1;
    while(lo < hi){
        const mid = lo + hi + 1 >> 1;
        if (track[mid][0] <= time) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
/** Position interpolée à l'instant `time`. */ function positionAt(track, time) {
    const i = indexAt(track, time);
    if (i < 0) return null;
    const a = track[i];
    const b = track[i + 1];
    if (!b) {
        const p = track[i - 1];
        return {
            lat: a[1],
            lon: a[2],
            dtf: a[3],
            heading: p ? bearing(p[1], p[2], a[1], a[2]) : 0,
            speed: p ? segSpeed(p, a) : 0,
            idx: i
        };
    }
    const f = (time - a[0]) / Math.max(1, b[0] - a[0]);
    return {
        lat: a[1] + (b[1] - a[1]) * f,
        lon: a[2] + (b[2] - a[2]) * f,
        dtf: a[3] + (b[3] - a[3]) * f,
        heading: bearing(a[1], a[2], b[1], b[2]),
        speed: segSpeed(a, b),
        idx: i
    };
}
function segSpeed(a, b) {
    const h = (b[0] - a[0]) / 3600;
    return h > 0 ? distNm(a[1], a[2], b[1], b[2]) / h : 0;
}
/** Série vitesse (nœuds) lissée sur la trace : [t, kn][] */ function speedSeries(track, until = Infinity) {
    const out = [];
    for(let i = 1; i < track.length && track[i][0] <= until; i++){
        const s = segSpeed(track[i - 1], track[i]);
        if (s < 60) out.push([
            track[i][0],
            s
        ]);
    }
    return out;
}
/** Distance parcourue sur 24h glissantes jusqu'à `time`. */ function dist24h(track, time) {
    let d = 0;
    for(let i = 1; i < track.length; i++){
        if (track[i][0] > time) break;
        if (track[i][0] < time - 86400) continue;
        d += distNm(track[i - 1][1], track[i - 1][2], track[i][1], track[i][2]);
    }
    return d;
}

const MONO = '<path d="M12 1.5c3.2 4.6 4.6 9.6 4 15.4-.2 1.9-.6 3.5-1.1 5.1H9.1c-.5-1.6-.9-3.2-1.1-5.1-.6-5.8.8-10.8 4-15.4z"/>';
const MULTI = '<path d="M12 1.5c2 3.6 2.6 7.6 2.3 12.6-.1 2.6-.5 5.4-1 7.9h-2.6c-.5-2.5-.9-5.3-1-7.9C9.4 9.1 10 5.1 12 1.5z"/>' + '<path d="M5.2 8.5c1.2 2.4 1.5 5.4 1.2 9.2-.1 1.4-.3 2.8-.6 4.3H4.4c-.3-1.5-.5-2.9-.6-4.3-.3-3.8 0-6.8 1.4-9.2z"/>' + '<path d="M18.8 8.5c1.4 2.4 1.7 5.4 1.4 9.2-.1 1.4-.3 2.8-.6 4.3h-1.4c-.3-1.5-.5-2.9-.6-4.3-.3-3.8 0-6.8 1.2-9.2z"/>' + '<rect x="4.6" y="12.2" width="14.8" height="1.3" rx=".6"/>';
const esc = (s)=>s.replace(/[&<>"]/g, (c)=>`&#${c.charCodeAt(0)};`);
function iconHtml(b, color, heading, sel, fav, label) {
    const shape = MULTIHULLS.has(b.className) ? MULTI : MONO;
    const cls = [
        'rr-boat',
        sel && 'is-sel',
        fav && 'is-fav',
        label && 'has-label'
    ].filter(Boolean).join(' ');
    return `<div class="${cls}" style="--c:${color}">
        ${sel ? '<span class="rr-pulse"></span>' : ''}
        <svg class="rr-hull" viewBox="0 0 24 24" style="transform:rotate(${Math.round(heading)}deg)">${shape}</svg>
        ${label ? `<span class="rr-label">${fav ? '★ ' : ''}${esc(b.name)}</span>` : ''}
    </div>`;
}
function slice(track, from, to) {
    const out = [];
    const end = indexAt(track, to);
    for(let i = 0; i <= end; i++){
        if (track[i][0] >= from) out.push([
            track[i][1],
            track[i][2]
        ]);
    }
    const head = positionAt(track, to);
    if (head && end >= 0 && track[end][0] < to) out.push([
        head.lat,
        head.lon
    ]);
    return out;
}
class RaceLayer {
    onSelect;
    group = new L.LayerGroup();
    items = new Map();
    marks = [];
    constructor(onSelect){
        this.onSelect = onSelect;
        this.group.addTo(map);
        for (const p of [
            START,
            FINISH
        ]){
            const m = new L.Marker([
                p.lat,
                p.lon
            ], {
                icon: new L.DivIcon({
                    className: 'rr-mark-wrap',
                    html: `<div class="rr-mark"><span class="rr-mark-dot"></span><span class="rr-mark-txt">${p.label}</span></div>`,
                    iconSize: [
                        14,
                        14
                    ],
                    iconAnchor: [
                        7,
                        7
                    ]
                }),
                interactive: false
            });
            m.addTo(this.group);
            this.marks.push(m);
        }
    }
    item(b) {
        let it = this.items.get(b.id);
        if (it) return it;
        const halo = new L.Polyline([], {
            color: '#fff',
            weight: 7,
            opacity: 0,
            interactive: false
        });
        const line = new L.Polyline([], {
            color: b.color,
            weight: 1.6,
            opacity: 0.8
        });
        const marker = new L.Marker([
            0,
            0
        ], {
            icon: new L.DivIcon({
                className: 'rr-boat-wrap',
                html: '',
                iconSize: [
                    24,
                    24
                ],
                iconAnchor: [
                    12,
                    12
                ]
            })
        });
        line.on('click', ()=>this.onSelect(b.id));
        marker.on('click', ()=>this.onSelect(b.id));
        it = {
            line,
            halo,
            marker,
            iconKey: '',
            onMap: false
        };
        this.items.set(b.id, it);
        return it;
    }
    render(boats, o) {
        const span = {
            all: Infinity,
            '48h': 48 * 3600,
            '12h': 12 * 3600,
            none: 0
        }[o.trackMode];
        const anySel = !!o.selected;
        for (const b of boats){
            const it = this.item(b);
            const show = o.visible.has(b.id) || b.id === o.selected;
            const pos = show ? positionAt(b.track, o.time) : null;
            if (!pos) {
                if (it.onMap) {
                    this.group.removeLayer(it.line);
                    this.group.removeLayer(it.halo);
                    this.group.removeLayer(it.marker);
                    it.onMap = false;
                }
                continue;
            }
            if (!it.onMap) {
                it.halo.addTo(this.group);
                it.line.addTo(this.group);
                it.marker.addTo(this.group);
                it.onMap = true;
            }
            const sel = b.id === o.selected;
            const fav = o.favorites.has(b.id);
            const color = o.colorBy === 'class' ? classColor(b.className) : b.color;
            const showTrack = span > 0 || sel;
            const from = sel ? -Infinity : o.time - span;
            const pts = showTrack ? slice(b.track, from, o.time) : [];
            it.line.setLatLngs(pts);
            it.halo.setLatLngs(sel ? pts : []);
            it.line.setStyle({
                color,
                weight: sel ? 3.2 : fav ? 2.2 : 1.5,
                opacity: anySel && !sel ? 0.28 : 0.85
            });
            it.halo.setStyle({
                opacity: sel ? 0.25 : 0
            });
            // En direct, on préfère le cap officiel ; en replay, le cap déduit de la trace.
            const live = b.state && o.time >= (b.track[b.track.length - 1]?.[0] ?? 0);
            const heading = live && b.state ? b.state.heading : pos.heading;
            const label = sel || fav || o.labels === 'all' || o.labels === 'leaders' && o.leaders.has(b.id);
            it.marker.setLatLng([
                pos.lat,
                pos.lon
            ]);
            const key = `${color}|${Math.round(heading / 3)}|${sel}|${fav}|${label}|${anySel && !sel}`;
            if (key !== it.iconKey) {
                it.iconKey = key;
                it.marker.setIcon(new L.DivIcon({
                    className: `rr-boat-wrap${anySel && !sel ? ' is-dim' : ''}`,
                    html: iconHtml(b, color, heading, sel, fav, label),
                    iconSize: [
                        24,
                        24
                    ],
                    iconAnchor: [
                        12,
                        12
                    ]
                }));
                it.marker.setZIndexOffset(sel ? 10000 : fav ? 5000 : label ? 1000 : 0);
            }
        }
        if (o.selected) this.items.get(o.selected)?.line.bringToFront();
    }
    destroy() {
        this.group.clearLayers();
        map.removeLayer(this.group);
        this.items.clear();
    }
}

/* src/plugin.svelte generated by Svelte v4.2.20 */

const { Map: Map_1 } = globals;

function add_css(target) {
	append_styles(target, "svelte-9yg79b", ".rr.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#e8edf3;font-size:13px;padding-bottom:8px}.rr.svelte-9yg79b button.svelte-9yg79b.svelte-9yg79b{font:inherit;color:inherit;cursor:pointer}.rr-head.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px}.rr-title.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;gap:6px;cursor:pointer}.rr-title.svelte-9yg79b h1.svelte-9yg79b.svelte-9yg79b{margin:0;font-size:20px;font-weight:800;letter-spacing:-0.02em;line-height:1.1}.rr-title.svelte-9yg79b h1 span.svelte-9yg79b.svelte-9yg79b{background:linear-gradient(90deg, #2ee6a6, #3ea8ff);-webkit-background-clip:text;background-clip:text;color:transparent}.rr-back.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{font-size:22px;line-height:1.6;color:#8a97a8}.rr-kicker.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#8a97a8}.rr-meta.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;flex-direction:column;align-items:flex-end;gap:3px}.rr-badge.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{font-size:10px;font-weight:700;letter-spacing:0.08em;padding:2px 7px;border-radius:20px}.rr-badge.live.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:rgba(255, 77, 94, 0.15);color:#ff6b7a}.rr-badge.live.svelte-9yg79b i.svelte-9yg79b.svelte-9yg79b{display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff4d5e;margin-right:5px;animation:svelte-9yg79b-rr-blink 1.4s infinite}.rr-badge.replay.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:rgba(62, 168, 255, 0.15);color:#6dbdff}.rr-clock.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{font-variant-numeric:tabular-nums;font-weight:700;font-size:12px}.rr-icon.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:none;border:0;font-size:16px;padding:0}.rr-icon.spin.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{animation:svelte-9yg79b-rr-spin 1s linear infinite}.rr-sub.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#8a97a8;font-size:11px;margin-bottom:10px}.rr-warn.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#ffb020}.rr-empty.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{padding:30px 10px;text-align:center;color:#8a97a8}.rr-empty.svelte-9yg79b .rr-btn.svelte-9yg79b.svelte-9yg79b{margin-top:10px}.rr-loader.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:block;margin:0 auto 10px;width:22px;height:22px;border:2px solid rgba(255, 255, 255, 0.08);border-top-color:#2ee6a6;border-radius:50%;animation:svelte-9yg79b-rr-spin 0.8s linear infinite}.rr-btn.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:rgba(255, 255, 255, 0.06);border:1px solid rgba(255, 255, 255, 0.08);border-radius:8px;padding:5px 9px;font-size:12px;white-space:nowrap;transition:background 0.15s}.rr-btn.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b:hover{background:rgba(255, 255, 255, 0.12)}.rr-btn.on.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:rgba(46, 230, 166, 0.16);border-color:rgba(46, 230, 166, 0.5);color:#2ee6a6}.rr-card.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{position:relative;background:linear-gradient(160deg, color-mix(in srgb, var(--c) 18%, #162131), #162131 55%);border:1px solid color-mix(in srgb, var(--c) 35%, transparent);border-radius:14px;padding:12px;margin-bottom:12px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.3)}.rr-card-top.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;justify-content:space-between;gap:8px}.rr-card-top.svelte-9yg79b h2.svelte-9yg79b.svelte-9yg79b{margin:4px 0 1px;font-size:16px;font-weight:800;line-height:1.15}.rr-skipper.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#c3ccd8}.rr-skipper.svelte-9yg79b em.svelte-9yg79b.svelte-9yg79b{font-style:normal;font-size:10px;color:#8a97a8;border:1px solid rgba(255, 255, 255, 0.08);border-radius:4px;padding:0 4px;margin-left:4px}.rr-pill.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--c);background:color-mix(in srgb, var(--c) 15%, transparent);border-radius:20px;padding:1px 8px}.rr-rank.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{text-align:right}.rr-rank.svelte-9yg79b b.svelte-9yg79b.svelte-9yg79b{font-size:30px;font-weight:900;line-height:1}.rr-rank.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{color:#8a97a8}.rr-stats.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin:10px 0 8px}.rr-stats.svelte-9yg79b div.svelte-9yg79b.svelte-9yg79b{background:rgba(0, 0, 0, 0.22);border-radius:9px;padding:6px 8px}.rr-stats.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{display:block;font-size:10px;color:#8a97a8;text-transform:uppercase;letter-spacing:0.05em}.rr-stats.svelte-9yg79b b.svelte-9yg79b.svelte-9yg79b{font-size:17px;font-weight:800;font-variant-numeric:tabular-nums}.rr-stats.svelte-9yg79b i.svelte-9yg79b.svelte-9yg79b{font-style:normal;font-size:10px;color:#8a97a8;margin-left:3px}.rr-wx.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;font-weight:700;margin-bottom:8px}.rr-wx.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{font-weight:400;color:#8a97a8}.rr-arrow.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:inline-block;width:14px;text-align:center;color:#6dbdff}.rr-chart.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{margin-top:6px}.rr-chart-h.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;justify-content:space-between;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#8a97a8}.rr-chart-h.svelte-9yg79b span.svelte-9yg79b.svelte-9yg79b{text-transform:none;letter-spacing:0}.rr-card-actions.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;gap:6px;margin-top:10px}.rr-card-actions.svelte-9yg79b .rr-btn.svelte-9yg79b.svelte-9yg79b:first-child{flex:1}.rr-tabs.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;gap:5px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none}.rr-tabs.svelte-9yg79b button.svelte-9yg79b.svelte-9yg79b{--c:#9aa4b2;flex:none;display:flex;align-items:center;gap:5px;background:rgba(255, 255, 255, 0.05);border:1px solid transparent;border-radius:20px;padding:4px 10px;font-size:12px}.rr-tabs.svelte-9yg79b button i.svelte-9yg79b.svelte-9yg79b{width:7px;height:7px;border-radius:50%;background:var(--c)}.rr-tabs.svelte-9yg79b button small.svelte-9yg79b.svelte-9yg79b{color:#8a97a8;font-size:10px}.rr-tabs.svelte-9yg79b button.on.svelte-9yg79b.svelte-9yg79b{border-color:var(--c);background:color-mix(in srgb, var(--c) 16%, transparent)}.rr-tools.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;gap:6px;margin:4px 0 8px}.rr-search.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{flex:1;min-width:0;background:rgba(255, 255, 255, 0.06);border:1px solid rgba(255, 255, 255, 0.08);border-radius:8px;color:inherit;padding:5px 9px;font-size:12px;outline:none}.rr-search.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b:focus{border-color:rgba(46, 230, 166, 0.5)}.rr-settings.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:rgba(255, 255, 255, 0.03);border:1px solid rgba(255, 255, 255, 0.08);border-radius:10px;padding:8px;margin-bottom:8px;display:grid;gap:6px}.rr-seg.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.rr-seg.svelte-9yg79b span.svelte-9yg79b.svelte-9yg79b{width:62px;font-size:10px;text-transform:uppercase;color:#8a97a8}.rr-seg.svelte-9yg79b button.svelte-9yg79b.svelte-9yg79b{background:none;border:1px solid rgba(255, 255, 255, 0.08);border-radius:6px;padding:2px 7px;font-size:11px}.rr-seg.svelte-9yg79b button.on.svelte-9yg79b.svelte-9yg79b{background:#e8edf3;color:#0f1722;border-color:#e8edf3}.rr-list.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{list-style:none;margin:0;padding:0}.rr-list.svelte-9yg79b li.svelte-9yg79b.svelte-9yg79b{display:grid;grid-template-columns:24px 4px 1fr auto 18px;align-items:center;gap:8px;padding:6px 6px;border-radius:9px;cursor:pointer;transition:background 0.12s}.rr-list.svelte-9yg79b li.svelte-9yg79b.svelte-9yg79b:hover{background:rgba(255, 255, 255, 0.05)}.rr-list.svelte-9yg79b li.sel.svelte-9yg79b.svelte-9yg79b{background:color-mix(in srgb, var(--c) 14%, transparent)}.rr-list.svelte-9yg79b li.out.svelte-9yg79b.svelte-9yg79b{opacity:0.5}.rr-list.svelte-9yg79b li.svelte-9yg79b+li.svelte-9yg79b{border-top:1px solid rgba(255, 255, 255, 0.04)}.rr-none.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#8a97a8;justify-content:center;display:block !important;text-align:center}.rr-pos.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{font-weight:800;text-align:center;font-variant-numeric:tabular-nums;font-size:12px}.rr-swatch.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{width:4px;height:26px;border-radius:2px;background:var(--c)}.rr-who.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{min-width:0}.rr-who.svelte-9yg79b b.svelte-9yg79b.svelte-9yg79b,.rr-who.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rr-who.svelte-9yg79b b.svelte-9yg79b.svelte-9yg79b{font-weight:700}.rr-who.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{color:#8a97a8;font-size:11px}.rr-num.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{text-align:right;font-variant-numeric:tabular-nums}.rr-num.svelte-9yg79b b.svelte-9yg79b.svelte-9yg79b{display:block;font-weight:700}.rr-num.svelte-9yg79b i.svelte-9yg79b.svelte-9yg79b{font-style:normal;font-size:9px;color:#8a97a8;margin-left:2px}.rr-num.svelte-9yg79b small.svelte-9yg79b.svelte-9yg79b{color:#8a97a8;font-size:11px}.rr-star.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{background:none;border:0;padding:0;color:#8a97a8;font-size:14px}.rr-star.on.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{color:#ffce21}.rr-replay.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{position:sticky;bottom:0;margin-top:10px;padding:10px;background:rgba(15, 23, 34, 0.92);backdrop-filter:blur(6px);border:1px solid rgba(255, 255, 255, 0.08);border-radius:12px}.rr-replay-row.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{display:flex;align-items:center;gap:8px}.rr-replay-row.small.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{margin-top:6px;justify-content:space-between;font-size:11px;color:#c3ccd8}.rr-replay-row.svelte-9yg79b input[type='range'].svelte-9yg79b.svelte-9yg79b{flex:1;appearance:none;height:4px;border-radius:2px;background:linear-gradient(90deg, #2ee6a6 var(--p), rgba(255, 255, 255, 0.15) var(--p));outline:none}.rr-replay-row.svelte-9yg79b input[type='range'].svelte-9yg79b.svelte-9yg79b::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(46, 230, 166, 0.35)}.rr-replay-row.svelte-9yg79b input[type='range'].svelte-9yg79b.svelte-9yg79b::-moz-range-thumb{width:14px;height:14px;border:0;border-radius:50%;background:#fff}.rr-play.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{width:32px;height:32px;border-radius:50%;border:0;background:#2ee6a6;color:#0f1722 !important;font-size:12px;font-weight:900;flex:none}.rr-speeds.svelte-9yg79b button.svelte-9yg79b.svelte-9yg79b{background:none;border:0;padding:0 3px;font-size:11px;color:#8a97a8}.rr-speeds.svelte-9yg79b button.on.svelte-9yg79b.svelte-9yg79b{color:#2ee6a6;font-weight:700}.rr-src.svelte-9yg79b.svelte-9yg79b.svelte-9yg79b{margin-top:6px;font-size:10px;color:#8a97a8}@keyframes svelte-9yg79b-rr-blink{50%{opacity:0.25}}@keyframes svelte-9yg79b-rr-spin{to{transform:rotate(360deg)}}.rr-boat-wrap{background:none !important;border:0 !important}.rr-boat-wrap.is-dim{opacity:0.4}.rr-boat{position:relative;width:24px;height:24px;cursor:pointer}.rr-hull{width:24px;height:24px;fill:var(--c);stroke:rgba(0, 0, 0, 0.75);stroke-width:0.9;filter:drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));transition:transform 0.4s}.rr-boat.is-sel .rr-hull{stroke:#fff;stroke-width:1.2;transform-origin:50% 50%;scale:1.35}.rr-pulse{position:absolute;inset:-8px;border-radius:50%;border:2px solid var(--c);animation:rr-pulse 1.8s ease-out infinite}.rr-label{position:absolute;left:22px;top:3px;white-space:nowrap;font:600 11px/1 system-ui, sans-serif;color:#fff;background:rgba(10, 16, 24, 0.78);border-left:3px solid var(--c);padding:3px 6px;border-radius:3px;pointer-events:none}.rr-boat.is-sel .rr-label{font-size:12px;background:var(--c);color:#0b1118;border-left-color:#fff}.rr-mark-wrap{background:none !important;border:0 !important}.rr-mark{position:relative}.rr-mark-dot{display:block;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #0b1118;box-shadow:0 0 0 2px #fff}.rr-mark-txt{position:absolute;left:20px;top:-1px;white-space:nowrap;font:700 11px/1 system-ui, sans-serif;color:#fff;text-shadow:0 1px 3px #000, 0 0 2px #000;text-transform:uppercase;letter-spacing:0.05em}@keyframes rr-pulse{from{transform:scale(0.6);opacity:0.9}to{transform:scale(1.6);opacity:0}}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[79] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[82] = list[i];
	const constants_0 = /*ranking*/ child_ctx[11].get(/*b*/ child_ctx[82].id);
	child_ctx[83] = constants_0;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[86] = list[i][0];
	child_ctx[87] = list[i][1];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[90] = list[i];
	return child_ctx;
}

function get_if_ctx(ctx) {
	const child_ctx = ctx.slice();
	const constants_0 = /*sel*/ child_ctx[14].state;
	child_ctx[93] = constants_0;
	const constants_1 = /*ranking*/ child_ctx[11].get(/*sel*/ child_ctx[14].id);
	child_ctx[83] = constants_1;
	return child_ctx;
}

// (16:12) {:else}
function create_else_block_4(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "REPLAY";
			attr(span, "class", "rr-badge replay svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (14:12) {#if isLive}
function create_if_block_11(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="svelte-9yg79b"></i>DIRECT`;
			attr(span, "class", "rr-badge live svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (31:4) {:else}
function create_else_block(ctx) {
	let div0;
	let t0;
	let t1_value = /*fmtDate*/ ctx[42](/*snapshot*/ ctx[0].reportDate) + "";
	let t1;
	let t2;
	let t3_value = /*snapshot*/ ctx[0].boats.length + "";
	let t3;
	let t4;
	let t5;
	let t6;
	let nav;
	let button0;
	let t8;
	let t9;
	let button1;
	let t10;
	let small;
	let t11_value = /*favorites*/ ctx[5].size + "";
	let t11;
	let t12;
	let div1;
	let input0;
	let t13;
	let button2;
	let t15;
	let button3;
	let t17;
	let t18;
	let ol;
	let each_blocks_1 = [];
	let each1_lookup = new Map_1();
	let t19;
	let footer;
	let div2;
	let button4;
	let t20_value = (/*playing*/ ctx[10] ? '❚❚' : '▶') + "";
	let t20;
	let button4_title_value;
	let t21;
	let input1;
	let t22;
	let button5;
	let t24;
	let div3;
	let span0;
	let t25_value = /*fmtDate*/ ctx[42](/*tView*/ ctx[13]) + "";
	let t25;
	let t26;
	let span1;
	let t27;
	let div4;
	let t28;
	let t29;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*error*/ ctx[17] && create_if_block_10(ctx);
	let if_block1 = /*sel*/ ctx[14] && create_if_block_4(get_if_ctx(ctx));
	let each_value_3 = ensure_array_like(/*presentClasses*/ ctx[26]);
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let if_block2 = /*showSettings*/ ctx[18] && create_if_block_3(ctx);
	let each_value_1 = ensure_array_like(/*rows*/ ctx[20]);
	const get_key = ctx => /*b*/ ctx[82].id;

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each1_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
	}

	let each1_else = null;

	if (!each_value_1.length) {
		each1_else = create_else_block_1();
	}

	let each_value = ensure_array_like([1, 3, 6, 12]);
	let each_blocks = [];

	for (let i = 0; i < 4; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div0 = element("div");
			t0 = text("Rapport du ");
			t1 = text(t1_value);
			t2 = text(" · ");
			t3 = text(t3_value);
			t4 = text(" bateaux\n            ");
			if (if_block0) if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			nav = element("nav");
			button0 = element("button");
			button0.textContent = "Tous";
			t8 = space();

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t9 = space();
			button1 = element("button");
			t10 = text("★");
			small = element("small");
			t11 = text(t11_value);
			t12 = space();
			div1 = element("div");
			input0 = element("input");
			t13 = space();
			button2 = element("button");
			button2.textContent = "⤢";
			t15 = space();
			button3 = element("button");
			button3.textContent = "⚙";
			t17 = space();
			if (if_block2) if_block2.c();
			t18 = space();
			ol = element("ol");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			if (each1_else) {
				each1_else.c();
			}

			t19 = space();
			footer = element("footer");
			div2 = element("div");
			button4 = element("button");
			t20 = text(t20_value);
			t21 = space();
			input1 = element("input");
			t22 = space();
			button5 = element("button");
			button5.textContent = "Direct";
			t24 = space();
			div3 = element("div");
			span0 = element("span");
			t25 = text(t25_value);
			t26 = space();
			span1 = element("span");

			for (let i = 0; i < 4; i += 1) {
				each_blocks[i].c();
			}

			t27 = space();
			div4 = element("div");
			t28 = text("Positions : tracker officiel (Geovoile)");
			t29 = text(/*historyNote*/ ctx[21]);
			attr(div0, "class", "rr-sub svelte-9yg79b");
			attr(button0, "class", "svelte-9yg79b");
			toggle_class(button0, "on", /*tab*/ ctx[1] === 'all');
			attr(small, "class", "svelte-9yg79b");
			attr(button1, "class", "svelte-9yg79b");
			toggle_class(button1, "on", /*tab*/ ctx[1] === 'fav');
			attr(nav, "class", "rr-tabs svelte-9yg79b");
			attr(input0, "class", "rr-search svelte-9yg79b");
			attr(input0, "placeholder", "Bateau, skipper…");
			attr(button2, "class", "rr-btn svelte-9yg79b");
			attr(button2, "title", "Voir les bateaux listés");
			attr(button3, "class", "rr-btn svelte-9yg79b");
			attr(button3, "title", "Affichage");
			toggle_class(button3, "on", /*showSettings*/ ctx[18]);
			attr(div1, "class", "rr-tools svelte-9yg79b");
			attr(ol, "class", "rr-list svelte-9yg79b");
			attr(button4, "class", "rr-play svelte-9yg79b");
			attr(button4, "title", button4_title_value = /*playing*/ ctx[10] ? 'Pause' : 'Lecture');
			attr(input1, "type", "range");
			attr(input1, "min", RACE_START);
			attr(input1, "max", /*tNow*/ ctx[12]);
			attr(input1, "step", "60");
			input1.value = /*tView*/ ctx[13];
			set_style(input1, "--p", (/*tView*/ ctx[13] - RACE_START) / Math.max(1, /*tNow*/ ctx[12] - RACE_START) * 100 + "%");
			attr(input1, "class", "svelte-9yg79b");
			attr(button5, "class", "rr-btn svelte-9yg79b");
			toggle_class(button5, "on", /*isLive*/ ctx[15]);
			attr(div2, "class", "rr-replay-row svelte-9yg79b");
			attr(span1, "class", "rr-speeds svelte-9yg79b");
			attr(div3, "class", "rr-replay-row small svelte-9yg79b");
			attr(div4, "class", "rr-src svelte-9yg79b");
			attr(footer, "class", "rr-replay svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			append(div0, t4);
			if (if_block0) if_block0.m(div0, null);
			insert(target, t5, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t6, anchor);
			insert(target, nav, anchor);
			append(nav, button0);
			append(nav, t8);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				if (each_blocks_2[i]) {
					each_blocks_2[i].m(nav, null);
				}
			}

			append(nav, t9);
			append(nav, button1);
			append(button1, t10);
			append(button1, small);
			append(small, t11);
			insert(target, t12, anchor);
			insert(target, div1, anchor);
			append(div1, input0);
			set_input_value(input0, /*query*/ ctx[2]);
			append(div1, t13);
			append(div1, button2);
			append(div1, t15);
			append(div1, button3);
			insert(target, t17, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, t18, anchor);
			insert(target, ol, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(ol, null);
				}
			}

			if (each1_else) {
				each1_else.m(ol, null);
			}

			insert(target, t19, anchor);
			insert(target, footer, anchor);
			append(footer, div2);
			append(div2, button4);
			append(button4, t20);
			append(div2, t21);
			append(div2, input1);
			append(div2, t22);
			append(div2, button5);
			append(footer, t24);
			append(footer, div3);
			append(div3, span0);
			append(span0, t25);
			append(div3, t26);
			append(div3, span1);

			for (let i = 0; i < 4; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(span1, null);
				}
			}

			append(footer, t27);
			append(footer, div4);
			append(div4, t28);
			append(div4, t29);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_5*/ ctx[56]),
					listen(button1, "click", /*click_handler_7*/ ctx[58]),
					listen(input0, "input", /*input0_input_handler*/ ctx[59]),
					listen(button2, "click", /*fitVisible*/ ctx[31]),
					listen(button3, "click", /*click_handler_8*/ ctx[60]),
					listen(button4, "click", /*togglePlay*/ ctx[35]),
					listen(input1, "input", /*input_handler*/ ctx[71]),
					listen(button5, "click", /*goLive*/ ctx[34])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if ((!current || dirty[0] & /*snapshot*/ 1) && t1_value !== (t1_value = /*fmtDate*/ ctx[42](/*snapshot*/ ctx[0].reportDate) + "")) set_data(t1, t1_value);
			if ((!current || dirty[0] & /*snapshot*/ 1) && t3_value !== (t3_value = /*snapshot*/ ctx[0].boats.length + "")) set_data(t3, t3_value);

			if (/*error*/ ctx[17]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_10(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*sel*/ ctx[14]) {
				if (if_block1) {
					if_block1.p(get_if_ctx(ctx), dirty);

					if (dirty[0] & /*sel*/ 16384) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_4(get_if_ctx(ctx));
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(t6.parentNode, t6);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*tab*/ 2) {
				toggle_class(button0, "on", /*tab*/ ctx[1] === 'all');
			}

			if (dirty[0] & /*presentClasses, tab*/ 67108866 | dirty[1] & /*classCount*/ 128) {
				each_value_3 = ensure_array_like(/*presentClasses*/ ctx[26]);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_3(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(nav, t9);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_3.length;
			}

			if ((!current || dirty[0] & /*favorites*/ 32) && t11_value !== (t11_value = /*favorites*/ ctx[5].size + "")) set_data(t11, t11_value);

			if (!current || dirty[0] & /*tab*/ 2) {
				toggle_class(button1, "on", /*tab*/ ctx[1] === 'fav');
			}

			if (dirty[0] & /*query*/ 4 && input0.value !== /*query*/ ctx[2]) {
				set_input_value(input0, /*query*/ ctx[2]);
			}

			if (!current || dirty[0] & /*showSettings*/ 262144) {
				toggle_class(button3, "on", /*showSettings*/ ctx[18]);
			}

			if (/*showSettings*/ ctx[18]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_3(ctx);
					if_block2.c();
					if_block2.m(t18.parentNode, t18);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (dirty[0] & /*rows, selected, ranking, select, favorites, tab*/ 537921578 | dirty[1] & /*toggleFav, fx, statusLabel*/ 546) {
				each_value_1 = ensure_array_like(/*rows*/ ctx[20]);
				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each1_lookup, ol, destroy_block, create_each_block_1, null, get_each_context_1);

				if (!each_value_1.length && each1_else) {
					each1_else.p(ctx, dirty);
				} else if (!each_value_1.length) {
					each1_else = create_else_block_1();
					each1_else.c();
					each1_else.m(ol, null);
				} else if (each1_else) {
					each1_else.d(1);
					each1_else = null;
				}
			}

			if ((!current || dirty[0] & /*playing*/ 1024) && t20_value !== (t20_value = (/*playing*/ ctx[10] ? '❚❚' : '▶') + "")) set_data(t20, t20_value);

			if (!current || dirty[0] & /*playing*/ 1024 && button4_title_value !== (button4_title_value = /*playing*/ ctx[10] ? 'Pause' : 'Lecture')) {
				attr(button4, "title", button4_title_value);
			}

			if (!current || dirty[0] & /*tNow*/ 4096) {
				attr(input1, "max", /*tNow*/ ctx[12]);
			}

			if (!current || dirty[0] & /*tView*/ 8192) {
				input1.value = /*tView*/ ctx[13];
			}

			if (!current || dirty[0] & /*tView, tNow*/ 12288) {
				set_style(input1, "--p", (/*tView*/ ctx[13] - RACE_START) / Math.max(1, /*tNow*/ ctx[12] - RACE_START) * 100 + "%");
			}

			if (!current || dirty[0] & /*isLive*/ 32768) {
				toggle_class(button5, "on", /*isLive*/ ctx[15]);
			}

			if ((!current || dirty[0] & /*tView*/ 8192) && t25_value !== (t25_value = /*fmtDate*/ ctx[42](/*tView*/ ctx[13]) + "")) set_data(t25, t25_value);

			if (dirty[0] & /*playSpeed*/ 524288) {
				each_value = ensure_array_like([1, 3, 6, 12]);
				let i;

				for (i = 0; i < 4; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(span1, null);
					}
				}

				for (; i < 4; i += 1) {
					each_blocks[i].d(1);
				}
			}

			if (!current || dirty[0] & /*historyNote*/ 2097152) set_data(t29, /*historyNote*/ ctx[21]);
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t5);
				detach(t6);
				detach(nav);
				detach(t12);
				detach(div1);
				detach(t17);
				detach(t18);
				detach(ol);
				detach(t19);
				detach(footer);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d(detaching);
			destroy_each(each_blocks_2, detaching);
			if (if_block2) if_block2.d(detaching);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].d();
			}

			if (each1_else) each1_else.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (29:24) 
function create_if_block_1(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `<span class="rr-loader svelte-9yg79b"></span>Chargement de la flotte…`;
			attr(div, "class", "rr-empty svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (24:4) {#if error && !snapshot}
function create_if_block(ctx) {
	let div;
	let b_1;
	let br;
	let t1;
	let t2;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			b_1 = element("b");
			b_1.textContent = "Données indisponibles";
			br = element("br");
			t1 = text(/*error*/ ctx[17]);
			t2 = space();
			button = element("button");
			button.textContent = "Réessayer";
			attr(button, "class", "rr-btn svelte-9yg79b");
			attr(div, "class", "rr-empty svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, b_1);
			append(div, br);
			append(div, t1);
			append(div, t2);
			append(div, button);

			if (!mounted) {
				dispose = listen(button, "click", /*refresh*/ ctx[28]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*error*/ 131072) set_data(t1, /*error*/ ctx[17]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			mounted = false;
			dispose();
		}
	};
}

// (34:12) {#if error}
function create_if_block_10(ctx) {
	let span;
	let t;

	return {
		c() {
			span = element("span");
			t = text("· ⚠ mise à jour échouée");
			attr(span, "class", "rr-warn svelte-9yg79b");
			attr(span, "title", /*error*/ ctx[17]);
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*error*/ 131072) {
				attr(span, "title", /*error*/ ctx[17]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (38:8) {#if sel}
function create_if_block_4(ctx) {
	let article;
	let div3;
	let div1;
	let span0;
	let t0_value = /*sel*/ ctx[14].className + "";
	let t0;
	let t1;
	let h2;
	let t2_value = /*sel*/ ctx[14].name + "";
	let t2;
	let t3;
	let div0;
	let t4_value = (/*sel*/ ctx[14].skipper || '—') + "";
	let t4;
	let t5;
	let t6;
	let div2;
	let t7;
	let div9;
	let div4;
	let small0;
	let b0;
	let t9_value = /*fx*/ ctx[36](/*selSpeed*/ ctx[25]) + "";
	let t9;
	let i0;
	let t11;
	let div5;
	let small1;
	let b1;
	let t13_value = Math.round(/*selHeading*/ ctx[24]) + "";
	let t13;
	let t14;
	let i1;
	let t15_value = /*cardinal*/ ctx[39](/*selHeading*/ ctx[24]) + "";
	let t15;
	let t16;
	let div6;
	let small2;
	let b2;
	let t18_value = /*fx*/ ctx[36](/*r*/ ctx[83]?.dtf, 0) + "";
	let t18;
	let i2;
	let t20;
	let div7;
	let small3;
	let b3;

	let t22_value = (/*r*/ ctx[83]?.rank === 1
	? '—'
	: /*fx*/ ctx[36](/*r*/ ctx[83]?.dtl, 1)) + "";

	let t22;
	let i3;
	let t23_value = (/*r*/ ctx[83]?.rank === 1 ? 'en tête' : 'mn') + "";
	let t23;
	let t24;
	let div8;
	let small4;
	let b4;
	let t26_value = /*fx*/ ctx[36](/*selD24*/ ctx[22], 0) + "";
	let t26;
	let i4;
	let t28;
	let t29;
	let t30;
	let div11;
	let div10;
	let t31;
	let span1;
	let t32_value = /*fx*/ ctx[36](/*maxOf*/ ctx[37](/*selSpeeds*/ ctx[23])) + "";
	let t32;
	let t33;
	let t34;
	let sparkline;
	let t35;
	let t36;
	let div12;
	let button0;
	let t37_value = (/*follow*/ ctx[4] ? '◉ Suivi actif' : '◎ Suivre') + "";
	let t37;
	let t38;
	let button1;
	let t40;
	let button2;
	let t41_value = (/*favorites*/ ctx[5].has(/*sel*/ ctx[14].id) ? '★' : '☆') + "";
	let t41;
	let t42;
	let button3;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*sel*/ ctx[14].nat && create_if_block_9(ctx);

	function select_block_type_2(ctx, dirty) {
		if (/*r*/ ctx[83]?.rank) return create_if_block_8;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block1 = current_block_type(ctx);

	function select_block_type_3(ctx, dirty) {
		if (/*isLive*/ ctx[15] && /*st*/ ctx[93]) return create_if_block_7;
		return create_else_block_2;
	}

	let current_block_type_1 = select_block_type_3(ctx);
	let if_block2 = current_block_type_1(ctx);
	let if_block3 = /*isLive*/ ctx[15] && /*st*/ ctx[93] && create_if_block_6(ctx);

	sparkline = new Sparkline({
			props: {
				data: /*selSpeeds*/ ctx[23],
				color: /*sel*/ ctx[14].color,
				tMin: RACE_START,
				tMax: /*tNow*/ ctx[12],
				cursor: /*isLive*/ ctx[15] ? null : /*tView*/ ctx[13]
			}
		});

	let if_block4 = /*sel*/ ctx[14].ranks.length > 1 && create_if_block_5(ctx);

	return {
		c() {
			article = element("article");
			div3 = element("div");
			div1 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			h2 = element("h2");
			t2 = text(t2_value);
			t3 = space();
			div0 = element("div");
			t4 = text(t4_value);
			t5 = space();
			if (if_block0) if_block0.c();
			t6 = space();
			div2 = element("div");
			if_block1.c();
			t7 = space();
			div9 = element("div");
			div4 = element("div");
			small0 = element("small");
			small0.textContent = "Vitesse";
			b0 = element("b");
			t9 = text(t9_value);
			i0 = element("i");
			i0.textContent = "nds";
			t11 = space();
			div5 = element("div");
			small1 = element("small");
			small1.textContent = "Cap";
			b1 = element("b");
			t13 = text(t13_value);
			t14 = text("°");
			i1 = element("i");
			t15 = text(t15_value);
			t16 = space();
			div6 = element("div");
			small2 = element("small");
			small2.textContent = "Arrivée";
			b2 = element("b");
			t18 = text(t18_value);
			i2 = element("i");
			i2.textContent = "mn";
			t20 = space();
			div7 = element("div");
			small3 = element("small");
			small3.textContent = "Écart leader";
			b3 = element("b");
			t22 = text(t22_value);
			i3 = element("i");
			t23 = text(t23_value);
			t24 = space();
			div8 = element("div");
			small4 = element("small");
			small4.textContent = "24 h";
			b4 = element("b");
			t26 = text(t26_value);
			i4 = element("i");
			i4.textContent = "mn";
			t28 = space();
			if_block2.c();
			t29 = space();
			if (if_block3) if_block3.c();
			t30 = space();
			div11 = element("div");
			div10 = element("div");
			t31 = text("Vitesse ");
			span1 = element("span");
			t32 = text(t32_value);
			t33 = text(" nds max");
			t34 = space();
			create_component(sparkline.$$.fragment);
			t35 = space();
			if (if_block4) if_block4.c();
			t36 = space();
			div12 = element("div");
			button0 = element("button");
			t37 = text(t37_value);
			t38 = space();
			button1 = element("button");
			button1.textContent = "⌖ Centrer";
			t40 = space();
			button2 = element("button");
			t41 = text(t41_value);
			t42 = space();
			button3 = element("button");
			button3.textContent = "✕";
			attr(span0, "class", "rr-pill svelte-9yg79b");
			set_style(span0, "--c", classColor(/*sel*/ ctx[14].className));
			attr(h2, "class", "svelte-9yg79b");
			attr(div0, "class", "rr-skipper svelte-9yg79b");
			attr(div1, "class", "rr-card-id");
			attr(div2, "class", "rr-rank svelte-9yg79b");
			attr(div3, "class", "rr-card-top svelte-9yg79b");
			attr(small0, "class", "svelte-9yg79b");
			attr(b0, "class", "svelte-9yg79b");
			attr(i0, "class", "svelte-9yg79b");
			attr(div4, "class", "svelte-9yg79b");
			attr(small1, "class", "svelte-9yg79b");
			attr(b1, "class", "svelte-9yg79b");
			attr(i1, "class", "svelte-9yg79b");
			attr(div5, "class", "svelte-9yg79b");
			attr(small2, "class", "svelte-9yg79b");
			attr(b2, "class", "svelte-9yg79b");
			attr(i2, "class", "svelte-9yg79b");
			attr(div6, "class", "svelte-9yg79b");
			attr(small3, "class", "svelte-9yg79b");
			attr(b3, "class", "svelte-9yg79b");
			attr(i3, "class", "svelte-9yg79b");
			attr(div7, "class", "svelte-9yg79b");
			attr(small4, "class", "svelte-9yg79b");
			attr(b4, "class", "svelte-9yg79b");
			attr(i4, "class", "svelte-9yg79b");
			attr(div8, "class", "svelte-9yg79b");
			attr(div9, "class", "rr-stats svelte-9yg79b");
			attr(span1, "class", "svelte-9yg79b");
			attr(div10, "class", "rr-chart-h svelte-9yg79b");
			attr(div11, "class", "rr-chart svelte-9yg79b");
			attr(button0, "class", "rr-btn svelte-9yg79b");
			toggle_class(button0, "on", /*follow*/ ctx[4]);
			attr(button1, "class", "rr-btn svelte-9yg79b");
			attr(button2, "class", "rr-btn svelte-9yg79b");
			toggle_class(button2, "on", /*favorites*/ ctx[5].has(/*sel*/ ctx[14].id));
			attr(button3, "class", "rr-btn svelte-9yg79b");
			attr(div12, "class", "rr-card-actions svelte-9yg79b");
			attr(article, "class", "rr-card svelte-9yg79b");
			set_style(article, "--c", /*sel*/ ctx[14].color);
		},
		m(target, anchor) {
			insert(target, article, anchor);
			append(article, div3);
			append(div3, div1);
			append(div1, span0);
			append(span0, t0);
			append(div1, t1);
			append(div1, h2);
			append(h2, t2);
			append(div1, t3);
			append(div1, div0);
			append(div0, t4);
			append(div0, t5);
			if (if_block0) if_block0.m(div0, null);
			append(div3, t6);
			append(div3, div2);
			if_block1.m(div2, null);
			append(article, t7);
			append(article, div9);
			append(div9, div4);
			append(div4, small0);
			append(div4, b0);
			append(b0, t9);
			append(div4, i0);
			append(div9, t11);
			append(div9, div5);
			append(div5, small1);
			append(div5, b1);
			append(b1, t13);
			append(b1, t14);
			append(div5, i1);
			append(i1, t15);
			append(div9, t16);
			append(div9, div6);
			append(div6, small2);
			append(div6, b2);
			append(b2, t18);
			append(div6, i2);
			append(div9, t20);
			append(div9, div7);
			append(div7, small3);
			append(div7, b3);
			append(b3, t22);
			append(div7, i3);
			append(i3, t23);
			append(div9, t24);
			append(div9, div8);
			append(div8, small4);
			append(div8, b4);
			append(b4, t26);
			append(div8, i4);
			append(div9, t28);
			if_block2.m(div9, null);
			append(article, t29);
			if (if_block3) if_block3.m(article, null);
			append(article, t30);
			append(article, div11);
			append(div11, div10);
			append(div10, t31);
			append(div10, span1);
			append(span1, t32);
			append(span1, t33);
			append(div11, t34);
			mount_component(sparkline, div11, null);
			append(article, t35);
			if (if_block4) if_block4.m(article, null);
			append(article, t36);
			append(article, div12);
			append(div12, button0);
			append(button0, t37);
			append(div12, t38);
			append(div12, button1);
			append(div12, t40);
			append(div12, button2);
			append(button2, t41);
			append(div12, t42);
			append(div12, button3);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_1*/ ctx[52]),
					listen(button1, "click", /*click_handler_2*/ ctx[53]),
					listen(button2, "click", /*click_handler_3*/ ctx[54]),
					listen(button3, "click", /*click_handler_4*/ ctx[55])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if ((!current || dirty[0] & /*sel*/ 16384) && t0_value !== (t0_value = /*sel*/ ctx[14].className + "")) set_data(t0, t0_value);

			if (!current || dirty[0] & /*sel*/ 16384) {
				set_style(span0, "--c", classColor(/*sel*/ ctx[14].className));
			}

			if ((!current || dirty[0] & /*sel*/ 16384) && t2_value !== (t2_value = /*sel*/ ctx[14].name + "")) set_data(t2, t2_value);
			if ((!current || dirty[0] & /*sel*/ 16384) && t4_value !== (t4_value = (/*sel*/ ctx[14].skipper || '—') + "")) set_data(t4, t4_value);

			if (/*sel*/ ctx[14].nat) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_9(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, null);
				}
			}

			if ((!current || dirty[0] & /*selSpeed*/ 33554432) && t9_value !== (t9_value = /*fx*/ ctx[36](/*selSpeed*/ ctx[25]) + "")) set_data(t9, t9_value);
			if ((!current || dirty[0] & /*selHeading*/ 16777216) && t13_value !== (t13_value = Math.round(/*selHeading*/ ctx[24]) + "")) set_data(t13, t13_value);
			if ((!current || dirty[0] & /*selHeading*/ 16777216) && t15_value !== (t15_value = /*cardinal*/ ctx[39](/*selHeading*/ ctx[24]) + "")) set_data(t15, t15_value);
			if ((!current || dirty[0] & /*ranking, sel*/ 18432) && t18_value !== (t18_value = /*fx*/ ctx[36](/*r*/ ctx[83]?.dtf, 0) + "")) set_data(t18, t18_value);

			if ((!current || dirty[0] & /*ranking, sel*/ 18432) && t22_value !== (t22_value = (/*r*/ ctx[83]?.rank === 1
			? '—'
			: /*fx*/ ctx[36](/*r*/ ctx[83]?.dtl, 1)) + "")) set_data(t22, t22_value);

			if ((!current || dirty[0] & /*ranking, sel*/ 18432) && t23_value !== (t23_value = (/*r*/ ctx[83]?.rank === 1 ? 'en tête' : 'mn') + "")) set_data(t23, t23_value);
			if ((!current || dirty[0] & /*selD24*/ 4194304) && t26_value !== (t26_value = /*fx*/ ctx[36](/*selD24*/ ctx[22], 0) + "")) set_data(t26, t26_value);

			if (current_block_type_1 === (current_block_type_1 = select_block_type_3(ctx)) && if_block2) {
				if_block2.p(ctx, dirty);
			} else {
				if_block2.d(1);
				if_block2 = current_block_type_1(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(div9, null);
				}
			}

			if (/*isLive*/ ctx[15] && /*st*/ ctx[93]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_6(ctx);
					if_block3.c();
					if_block3.m(article, t30);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if ((!current || dirty[0] & /*selSpeeds*/ 8388608) && t32_value !== (t32_value = /*fx*/ ctx[36](/*maxOf*/ ctx[37](/*selSpeeds*/ ctx[23])) + "")) set_data(t32, t32_value);
			const sparkline_changes = {};
			if (dirty[0] & /*selSpeeds*/ 8388608) sparkline_changes.data = /*selSpeeds*/ ctx[23];
			if (dirty[0] & /*sel*/ 16384) sparkline_changes.color = /*sel*/ ctx[14].color;
			if (dirty[0] & /*tNow*/ 4096) sparkline_changes.tMax = /*tNow*/ ctx[12];
			if (dirty[0] & /*isLive, tView*/ 40960) sparkline_changes.cursor = /*isLive*/ ctx[15] ? null : /*tView*/ ctx[13];
			sparkline.$set(sparkline_changes);

			if (/*sel*/ ctx[14].ranks.length > 1) {
				if (if_block4) {
					if_block4.p(ctx, dirty);

					if (dirty[0] & /*sel*/ 16384) {
						transition_in(if_block4, 1);
					}
				} else {
					if_block4 = create_if_block_5(ctx);
					if_block4.c();
					transition_in(if_block4, 1);
					if_block4.m(article, t36);
				}
			} else if (if_block4) {
				group_outros();

				transition_out(if_block4, 1, 1, () => {
					if_block4 = null;
				});

				check_outros();
			}

			if ((!current || dirty[0] & /*follow*/ 16) && t37_value !== (t37_value = (/*follow*/ ctx[4] ? '◉ Suivi actif' : '◎ Suivre') + "")) set_data(t37, t37_value);

			if (!current || dirty[0] & /*follow*/ 16) {
				toggle_class(button0, "on", /*follow*/ ctx[4]);
			}

			if ((!current || dirty[0] & /*favorites, sel*/ 16416) && t41_value !== (t41_value = (/*favorites*/ ctx[5].has(/*sel*/ ctx[14].id) ? '★' : '☆') + "")) set_data(t41, t41_value);

			if (!current || dirty[0] & /*favorites, sel*/ 16416) {
				toggle_class(button2, "on", /*favorites*/ ctx[5].has(/*sel*/ ctx[14].id));
			}

			if (!current || dirty[0] & /*sel*/ 16384) {
				set_style(article, "--c", /*sel*/ ctx[14].color);
			}
		},
		i(local) {
			if (current) return;
			transition_in(sparkline.$$.fragment, local);
			transition_in(if_block4);
			current = true;
		},
		o(local) {
			transition_out(sparkline.$$.fragment, local);
			transition_out(if_block4);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(article);
			}

			if (if_block0) if_block0.d();
			if_block1.d();
			if_block2.d();
			if (if_block3) if_block3.d();
			destroy_component(sparkline);
			if (if_block4) if_block4.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (46:69) {#if sel.nat}
function create_if_block_9(ctx) {
	let em;
	let t_value = /*sel*/ ctx[14].nat + "";
	let t;

	return {
		c() {
			em = element("em");
			t = text(t_value);
			attr(em, "class", "svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, em, anchor);
			append(em, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sel*/ 16384 && t_value !== (t_value = /*sel*/ ctx[14].nat + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(em);
			}
		}
	};
}

// (49:95) {:else}
function create_else_block_3(ctx) {
	let b_1;

	return {
		c() {
			b_1 = element("b");
			b_1.textContent = "–";
			attr(b_1, "class", "svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, b_1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(b_1);
			}
		}
	};
}

// (49:24) {#if r?.rank}
function create_if_block_8(ctx) {
	let b_1;
	let t0_value = /*r*/ ctx[83].rank + "";
	let t0;
	let small;
	let t1;
	let t2_value = /*classCount*/ ctx[38](/*sel*/ ctx[14].className) + "";
	let t2;

	return {
		c() {
			b_1 = element("b");
			t0 = text(t0_value);
			small = element("small");
			t1 = text("/");
			t2 = text(t2_value);
			attr(b_1, "class", "svelte-9yg79b");
			attr(small, "class", "svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, b_1, anchor);
			append(b_1, t0);
			insert(target, small, anchor);
			append(small, t1);
			append(small, t2);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*ranking, sel*/ 18432 && t0_value !== (t0_value = /*r*/ ctx[83].rank + "")) set_data(t0, t0_value);
			if (dirty[0] & /*sel*/ 16384 && t2_value !== (t2_value = /*classCount*/ ctx[38](/*sel*/ ctx[14].className) + "")) set_data(t2, t2_value);
		},
		d(detaching) {
			if (detaching) {
				detach(b_1);
				detach(small);
			}
		}
	};
}

// (61:20) {:else}
function create_else_block_2(ctx) {
	let div;
	let small;
	let b_1;
	let t1_value = /*fx*/ ctx[36](/*selD24*/ ctx[22] / 24) + "";
	let t1;
	let i;

	return {
		c() {
			div = element("div");
			small = element("small");
			small.textContent = "Moy. 24 h";
			b_1 = element("b");
			t1 = text(t1_value);
			i = element("i");
			i.textContent = "nds";
			attr(small, "class", "svelte-9yg79b");
			attr(b_1, "class", "svelte-9yg79b");
			attr(i, "class", "svelte-9yg79b");
			attr(div, "class", "svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, small);
			append(div, b_1);
			append(b_1, t1);
			append(div, i);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*selD24*/ 4194304 && t1_value !== (t1_value = /*fx*/ ctx[36](/*selD24*/ ctx[22] / 24) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (59:20) {#if isLive && st}
function create_if_block_7(ctx) {
	let div;
	let small;
	let b_1;
	let t1_value = /*fx*/ ctx[36](/*st*/ ctx[93].vmg) + "";
	let t1;
	let i;

	return {
		c() {
			div = element("div");
			small = element("small");
			small.textContent = "VMG";
			b_1 = element("b");
			t1 = text(t1_value);
			i = element("i");
			i.textContent = "nds";
			attr(small, "class", "svelte-9yg79b");
			attr(b_1, "class", "svelte-9yg79b");
			attr(i, "class", "svelte-9yg79b");
			attr(div, "class", "svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, small);
			append(div, b_1);
			append(b_1, t1);
			append(div, i);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sel*/ 16384 && t1_value !== (t1_value = /*fx*/ ctx[36](/*st*/ ctx[93].vmg) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (66:16) {#if isLive && st}
function create_if_block_6(ctx) {
	let div4;
	let div0;
	let span0;
	let t0;
	let t1;
	let t2_value = /*fx*/ ctx[36](/*st*/ ctx[93].windSpeed, 0) + "";
	let t2;
	let small0;
	let t3;
	let t4_value = /*fx*/ ctx[36](/*st*/ ctx[93].windGust, 0) + "";
	let t4;
	let t5;
	let t6;
	let div1;
	let span1;
	let t7;
	let t8;
	let t9_value = /*fx*/ ctx[36](/*st*/ ctx[93].waveHeight) + "";
	let t9;
	let small1;
	let t11;
	let div2;
	let t12;
	let t13_value = /*fx*/ ctx[36](/*st*/ ctx[93].tempWater, 0) + "";
	let t13;
	let t14;
	let small2;
	let t15;
	let t16_value = /*fx*/ ctx[36](/*st*/ ctx[93].tempAir, 0) + "";
	let t16;
	let t17;
	let t18;
	let div3;
	let t19;
	let t20_value = /*fx*/ ctx[36](/*st*/ ctx[93].vitmax4) + "";
	let t20;
	let small3;

	return {
		c() {
			div4 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text("↑");
			t1 = space();
			t2 = text(t2_value);
			small0 = element("small");
			t3 = text("/");
			t4 = text(t4_value);
			t5 = text(" nds");
			t6 = space();
			div1 = element("div");
			span1 = element("span");
			t7 = text("≈");
			t8 = space();
			t9 = text(t9_value);
			small1 = element("small");
			small1.textContent = "m";
			t11 = space();
			div2 = element("div");
			t12 = text("🌡 ");
			t13 = text(t13_value);
			t14 = text("°");
			small2 = element("small");
			t15 = text("/ ");
			t16 = text(t16_value);
			t17 = text("°");
			t18 = space();
			div3 = element("div");
			t19 = text("⚡ ");
			t20 = text(t20_value);
			small3 = element("small");
			small3.textContent = "nds max 4h";
			attr(span0, "class", "rr-arrow svelte-9yg79b");
			set_style(span0, "transform", "rotate(" + (/*st*/ ctx[93].windDir + 180) + "deg)");
			attr(small0, "class", "svelte-9yg79b");
			attr(div0, "title", "Vent");
			attr(span1, "class", "rr-arrow svelte-9yg79b");
			set_style(span1, "transform", "rotate(" + (/*st*/ ctx[93].waveDir + 180) + "deg)");
			attr(small1, "class", "svelte-9yg79b");
			attr(div1, "title", "Vagues");
			attr(small2, "class", "svelte-9yg79b");
			attr(div2, "title", "Eau / air");
			attr(small3, "class", "svelte-9yg79b");
			attr(div3, "title", "Vitesse max 4 h");
			attr(div4, "class", "rr-wx svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, small0);
			append(small0, t3);
			append(small0, t4);
			append(small0, t5);
			append(div4, t6);
			append(div4, div1);
			append(div1, span1);
			append(span1, t7);
			append(div1, t8);
			append(div1, t9);
			append(div1, small1);
			append(div4, t11);
			append(div4, div2);
			append(div2, t12);
			append(div2, t13);
			append(div2, t14);
			append(div2, small2);
			append(small2, t15);
			append(small2, t16);
			append(small2, t17);
			append(div4, t18);
			append(div4, div3);
			append(div3, t19);
			append(div3, t20);
			append(div3, small3);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*sel*/ 16384) {
				set_style(span0, "transform", "rotate(" + (/*st*/ ctx[93].windDir + 180) + "deg)");
			}

			if (dirty[0] & /*sel*/ 16384 && t2_value !== (t2_value = /*fx*/ ctx[36](/*st*/ ctx[93].windSpeed, 0) + "")) set_data(t2, t2_value);
			if (dirty[0] & /*sel*/ 16384 && t4_value !== (t4_value = /*fx*/ ctx[36](/*st*/ ctx[93].windGust, 0) + "")) set_data(t4, t4_value);

			if (dirty[0] & /*sel*/ 16384) {
				set_style(span1, "transform", "rotate(" + (/*st*/ ctx[93].waveDir + 180) + "deg)");
			}

			if (dirty[0] & /*sel*/ 16384 && t9_value !== (t9_value = /*fx*/ ctx[36](/*st*/ ctx[93].waveHeight) + "")) set_data(t9, t9_value);
			if (dirty[0] & /*sel*/ 16384 && t13_value !== (t13_value = /*fx*/ ctx[36](/*st*/ ctx[93].tempWater, 0) + "")) set_data(t13, t13_value);
			if (dirty[0] & /*sel*/ 16384 && t16_value !== (t16_value = /*fx*/ ctx[36](/*st*/ ctx[93].tempAir, 0) + "")) set_data(t16, t16_value);
			if (dirty[0] & /*sel*/ 16384 && t20_value !== (t20_value = /*fx*/ ctx[36](/*st*/ ctx[93].vitmax4) + "")) set_data(t20, t20_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div4);
			}
		}
	};
}

// (85:16) {#if sel.ranks.length > 1}
function create_if_block_5(ctx) {
	let div1;
	let div0;
	let t0;
	let span;
	let t1;
	let t2_value = Math.min(.../*sel*/ ctx[14].ranks.map(func)) + "";
	let t2;
	let t3;
	let t4;
	let sparkline;
	let current;

	sparkline = new Sparkline({
			props: {
				data: /*sel*/ ctx[14].ranks.map(func_1),
				color: classColor(/*sel*/ ctx[14].className),
				invert: true,
				tMin: RACE_START,
				tMax: /*tNow*/ ctx[12],
				cursor: /*isLive*/ ctx[15] ? null : /*tView*/ ctx[13]
			}
		});

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("Classement ");
			span = element("span");
			t1 = text("meilleur : ");
			t2 = text(t2_value);
			t3 = text("ᵉ");
			t4 = space();
			create_component(sparkline.$$.fragment);
			attr(span, "class", "svelte-9yg79b");
			attr(div0, "class", "rr-chart-h svelte-9yg79b");
			attr(div1, "class", "rr-chart svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(span, t2);
			append(span, t3);
			append(div1, t4);
			mount_component(sparkline, div1, null);
			current = true;
		},
		p(ctx, dirty) {
			if ((!current || dirty[0] & /*sel*/ 16384) && t2_value !== (t2_value = Math.min(.../*sel*/ ctx[14].ranks.map(func)) + "")) set_data(t2, t2_value);
			const sparkline_changes = {};
			if (dirty[0] & /*sel*/ 16384) sparkline_changes.data = /*sel*/ ctx[14].ranks.map(func_1);
			if (dirty[0] & /*sel*/ 16384) sparkline_changes.color = classColor(/*sel*/ ctx[14].className);
			if (dirty[0] & /*tNow*/ 4096) sparkline_changes.tMax = /*tNow*/ ctx[12];
			if (dirty[0] & /*isLive, tView*/ 40960) sparkline_changes.cursor = /*isLive*/ ctx[15] ? null : /*tView*/ ctx[13];
			sparkline.$set(sparkline_changes);
		},
		i(local) {
			if (current) return;
			transition_in(sparkline.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(sparkline.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			destroy_component(sparkline);
		}
	};
}

// (108:12) {#each presentClasses as c}
function create_each_block_3(ctx) {
	let button;
	let i;
	let t0_value = /*c*/ ctx[90].name + "";
	let t0;
	let small;
	let t1_value = /*classCount*/ ctx[38](/*c*/ ctx[90].name) + "";
	let t1;
	let mounted;
	let dispose;

	function click_handler_6() {
		return /*click_handler_6*/ ctx[57](/*c*/ ctx[90]);
	}

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = text(t0_value);
			small = element("small");
			t1 = text(t1_value);
			attr(i, "class", "svelte-9yg79b");
			attr(small, "class", "svelte-9yg79b");
			set_style(button, "--c", /*c*/ ctx[90].color);
			attr(button, "class", "svelte-9yg79b");
			toggle_class(button, "on", /*tab*/ ctx[1] === /*c*/ ctx[90].name);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, small);
			append(small, t1);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_6);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*presentClasses*/ 67108864 && t0_value !== (t0_value = /*c*/ ctx[90].name + "")) set_data(t0, t0_value);
			if (dirty[0] & /*presentClasses*/ 67108864 && t1_value !== (t1_value = /*classCount*/ ctx[38](/*c*/ ctx[90].name) + "")) set_data(t1, t1_value);

			if (dirty[0] & /*presentClasses*/ 67108864) {
				set_style(button, "--c", /*c*/ ctx[90].color);
			}

			if (dirty[0] & /*tab, presentClasses*/ 67108866) {
				toggle_class(button, "on", /*tab*/ ctx[1] === /*c*/ ctx[90].name);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (122:8) {#if showSettings}
function create_if_block_3(ctx) {
	let div4;
	let div0;
	let span0;
	let t1;
	let t2;
	let div1;
	let span1;
	let t4;
	let button0;
	let t6;
	let button1;
	let t8;
	let div2;
	let span2;
	let t10;
	let button2;
	let t12;
	let button3;
	let t14;
	let button4;
	let t16;
	let div3;
	let span3;
	let t18;
	let button5;
	let t20;
	let button6;
	let mounted;
	let dispose;
	let each_value_2 = ensure_array_like([['all', 'Complètes'], ['48h', '48 h'], ['12h', '12 h'], ['none', 'Aucune']]);
	let each_blocks = [];

	for (let i = 0; i < 4; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			div4 = element("div");
			div0 = element("div");
			span0 = element("span");
			span0.textContent = "Traces";
			t1 = space();

			for (let i = 0; i < 4; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			div1 = element("div");
			span1 = element("span");
			span1.textContent = "Couleurs";
			t4 = space();
			button0 = element("button");
			button0.textContent = "Bateau";
			t6 = space();
			button1 = element("button");
			button1.textContent = "Classe";
			t8 = space();
			div2 = element("div");
			span2 = element("span");
			span2.textContent = "Noms";
			t10 = space();
			button2 = element("button");
			button2.textContent = "Aucun";
			t12 = space();
			button3 = element("button");
			button3.textContent = "Leaders";
			t14 = space();
			button4 = element("button");
			button4.textContent = "Tous";
			t16 = space();
			div3 = element("div");
			span3 = element("span");
			span3.textContent = "Carte";
			t18 = space();
			button5 = element("button");
			button5.textContent = "Toute la flotte";
			t20 = space();
			button6 = element("button");
			button6.textContent = "Onglet actif";
			attr(span0, "class", "svelte-9yg79b");
			attr(div0, "class", "rr-seg svelte-9yg79b");
			attr(span1, "class", "svelte-9yg79b");
			attr(button0, "class", "svelte-9yg79b");
			toggle_class(button0, "on", /*colorBy*/ ctx[7] === 'boat');
			attr(button1, "class", "svelte-9yg79b");
			toggle_class(button1, "on", /*colorBy*/ ctx[7] === 'class');
			attr(div1, "class", "rr-seg svelte-9yg79b");
			attr(span2, "class", "svelte-9yg79b");
			attr(button2, "class", "svelte-9yg79b");
			toggle_class(button2, "on", /*labels*/ ctx[8] === 'none');
			attr(button3, "class", "svelte-9yg79b");
			toggle_class(button3, "on", /*labels*/ ctx[8] === 'leaders');
			attr(button4, "class", "svelte-9yg79b");
			toggle_class(button4, "on", /*labels*/ ctx[8] === 'all');
			attr(div2, "class", "rr-seg svelte-9yg79b");
			attr(span3, "class", "svelte-9yg79b");
			attr(button5, "class", "svelte-9yg79b");
			toggle_class(button5, "on", /*mapScope*/ ctx[9] === 'all');
			attr(button6, "class", "svelte-9yg79b");
			toggle_class(button6, "on", /*mapScope*/ ctx[9] === 'tab');
			attr(div3, "class", "rr-seg svelte-9yg79b");
			attr(div4, "class", "rr-settings svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			append(div0, span0);
			append(div0, t1);

			for (let i = 0; i < 4; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append(div4, t2);
			append(div4, div1);
			append(div1, span1);
			append(div1, t4);
			append(div1, button0);
			append(div1, t6);
			append(div1, button1);
			append(div4, t8);
			append(div4, div2);
			append(div2, span2);
			append(div2, t10);
			append(div2, button2);
			append(div2, t12);
			append(div2, button3);
			append(div2, t14);
			append(div2, button4);
			append(div4, t16);
			append(div4, div3);
			append(div3, span3);
			append(div3, t18);
			append(div3, button5);
			append(div3, t20);
			append(div3, button6);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_10*/ ctx[62]),
					listen(button1, "click", /*click_handler_11*/ ctx[63]),
					listen(button2, "click", /*click_handler_12*/ ctx[64]),
					listen(button3, "click", /*click_handler_13*/ ctx[65]),
					listen(button4, "click", /*click_handler_14*/ ctx[66]),
					listen(button5, "click", /*click_handler_15*/ ctx[67]),
					listen(button6, "click", /*click_handler_16*/ ctx[68])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*trackMode*/ 64) {
				each_value_2 = ensure_array_like([
					['all', 'Complètes'],
					['48h', '48 h'],
					['12h', '12 h'],
					['none', 'Aucune']
				]);

				let i;

				for (i = 0; i < 4; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < 4; i += 1) {
					each_blocks[i].d(1);
				}
			}

			if (dirty[0] & /*colorBy*/ 128) {
				toggle_class(button0, "on", /*colorBy*/ ctx[7] === 'boat');
			}

			if (dirty[0] & /*colorBy*/ 128) {
				toggle_class(button1, "on", /*colorBy*/ ctx[7] === 'class');
			}

			if (dirty[0] & /*labels*/ 256) {
				toggle_class(button2, "on", /*labels*/ ctx[8] === 'none');
			}

			if (dirty[0] & /*labels*/ 256) {
				toggle_class(button3, "on", /*labels*/ ctx[8] === 'leaders');
			}

			if (dirty[0] & /*labels*/ 256) {
				toggle_class(button4, "on", /*labels*/ ctx[8] === 'all');
			}

			if (dirty[0] & /*mapScope*/ 512) {
				toggle_class(button5, "on", /*mapScope*/ ctx[9] === 'all');
			}

			if (dirty[0] & /*mapScope*/ 512) {
				toggle_class(button6, "on", /*mapScope*/ ctx[9] === 'tab');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div4);
			}

			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (126:20) {#each [['all', 'Complètes'], ['48h', '48 h'], ['12h', '12 h'], ['none', 'Aucune']] as [v, l]}
function create_each_block_2(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler_9() {
		return /*click_handler_9*/ ctx[61](/*v*/ ctx[86]);
	}

	return {
		c() {
			button = element("button");
			button.textContent = `${/*l*/ ctx[87]}`;
			attr(button, "class", "svelte-9yg79b");
			toggle_class(button, "on", /*trackMode*/ ctx[6] === /*v*/ ctx[86]);
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_9);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*trackMode*/ 64) {
				toggle_class(button, "on", /*trackMode*/ ctx[6] === /*v*/ ctx[86]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (168:12) {:else}
function create_else_block_1(ctx) {
	let li;

	return {
		c() {
			li = element("li");
			li.textContent = "Aucun bateau";
			attr(li, "class", "rr-none svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, li, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(li);
			}
		}
	};
}

// (158:42) {#if tab === 'all' || tab === 'fav'}
function create_if_block_2(ctx) {
	let t_value = (/*b*/ ctx[82].skipper ? ' · ' : '') + /*b*/ ctx[82].className + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*rows*/ 1048576 && t_value !== (t_value = (/*b*/ ctx[82].skipper ? ' · ' : '') + /*b*/ ctx[82].className + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (151:12) {#each rows as b (b.id)}
function create_each_block_1(key_1, ctx) {
	let li;
	let span0;
	let t0_value = (/*r*/ ctx[83]?.rank || /*statusLabel*/ ctx[40](/*b*/ ctx[82].state?.status)) + "";
	let t0;
	let t1;
	let span1;
	let t2;
	let span2;
	let b0;
	let t3_value = /*b*/ ctx[82].name + "";
	let t3;
	let t4;
	let small0;
	let t5_value = /*b*/ ctx[82].skipper + "";
	let t5;
	let t6;
	let span3;
	let b1;
	let t7_value = /*fx*/ ctx[36](/*r*/ ctx[83]?.speed) + "";
	let t7;
	let i;
	let t9;
	let small1;

	let t10_value = (/*r*/ ctx[83]?.rank === 1
	? `${/*fx*/ ctx[36](/*r*/ ctx[83].dtf, 0)} mn`
	: (/*r*/ ctx[83]?.rank)
		? `+${/*fx*/ ctx[36](/*r*/ ctx[83].dtl, 1)}`
		: '') + "";

	let t10;
	let t11;
	let button;
	let t12_value = (/*favorites*/ ctx[5].has(/*b*/ ctx[82].id) ? '★' : '☆') + "";
	let t12;
	let t13;
	let mounted;
	let dispose;
	let if_block = (/*tab*/ ctx[1] === 'all' || /*tab*/ ctx[1] === 'fav') && create_if_block_2(ctx);

	function click_handler_17() {
		return /*click_handler_17*/ ctx[69](/*b*/ ctx[82]);
	}

	function click_handler_18() {
		return /*click_handler_18*/ ctx[70](/*b*/ ctx[82]);
	}

	return {
		key: key_1,
		first: null,
		c() {
			li = element("li");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = space();
			span2 = element("span");
			b0 = element("b");
			t3 = text(t3_value);
			t4 = space();
			small0 = element("small");
			t5 = text(t5_value);
			if (if_block) if_block.c();
			t6 = space();
			span3 = element("span");
			b1 = element("b");
			t7 = text(t7_value);
			i = element("i");
			i.textContent = "nds";
			t9 = space();
			small1 = element("small");
			t10 = text(t10_value);
			t11 = space();
			button = element("button");
			t12 = text(t12_value);
			t13 = space();
			attr(span0, "class", "rr-pos svelte-9yg79b");
			attr(span1, "class", "rr-swatch svelte-9yg79b");
			attr(b0, "class", "svelte-9yg79b");
			attr(small0, "class", "svelte-9yg79b");
			attr(span2, "class", "rr-who svelte-9yg79b");
			attr(i, "class", "svelte-9yg79b");
			attr(b1, "class", "svelte-9yg79b");
			attr(small1, "class", "svelte-9yg79b");
			attr(span3, "class", "rr-num svelte-9yg79b");
			attr(button, "class", "rr-star svelte-9yg79b");
			toggle_class(button, "on", /*favorites*/ ctx[5].has(/*b*/ ctx[82].id));
			set_style(li, "--c", /*b*/ ctx[82].color);
			attr(li, "class", "svelte-9yg79b");
			toggle_class(li, "sel", /*b*/ ctx[82].id === /*selected*/ ctx[3]);
			toggle_class(li, "out", !/*r*/ ctx[83]?.rank);
			this.first = li;
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, span0);
			append(span0, t0);
			append(li, t1);
			append(li, span1);
			append(li, t2);
			append(li, span2);
			append(span2, b0);
			append(b0, t3);
			append(span2, t4);
			append(span2, small0);
			append(small0, t5);
			if (if_block) if_block.m(small0, null);
			append(li, t6);
			append(li, span3);
			append(span3, b1);
			append(b1, t7);
			append(b1, i);
			append(span3, t9);
			append(span3, small1);
			append(small1, t10);
			append(li, t11);
			append(li, button);
			append(button, t12);
			append(li, t13);

			if (!mounted) {
				dispose = [
					listen(button, "click", stop_propagation(click_handler_17)),
					listen(li, "click", click_handler_18)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*ranking, rows*/ 1050624 && t0_value !== (t0_value = (/*r*/ ctx[83]?.rank || /*statusLabel*/ ctx[40](/*b*/ ctx[82].state?.status)) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*rows*/ 1048576 && t3_value !== (t3_value = /*b*/ ctx[82].name + "")) set_data(t3, t3_value);
			if (dirty[0] & /*rows*/ 1048576 && t5_value !== (t5_value = /*b*/ ctx[82].skipper + "")) set_data(t5, t5_value);

			if (/*tab*/ ctx[1] === 'all' || /*tab*/ ctx[1] === 'fav') {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(small0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*ranking, rows*/ 1050624 && t7_value !== (t7_value = /*fx*/ ctx[36](/*r*/ ctx[83]?.speed) + "")) set_data(t7, t7_value);

			if (dirty[0] & /*ranking, rows*/ 1050624 && t10_value !== (t10_value = (/*r*/ ctx[83]?.rank === 1
			? `${/*fx*/ ctx[36](/*r*/ ctx[83].dtf, 0)} mn`
			: (/*r*/ ctx[83]?.rank)
				? `+${/*fx*/ ctx[36](/*r*/ ctx[83].dtl, 1)}`
				: '') + "")) set_data(t10, t10_value);

			if (dirty[0] & /*favorites, rows*/ 1048608 && t12_value !== (t12_value = (/*favorites*/ ctx[5].has(/*b*/ ctx[82].id) ? '★' : '☆') + "")) set_data(t12, t12_value);

			if (dirty[0] & /*favorites, rows*/ 1048608) {
				toggle_class(button, "on", /*favorites*/ ctx[5].has(/*b*/ ctx[82].id));
			}

			if (dirty[0] & /*rows*/ 1048576) {
				set_style(li, "--c", /*b*/ ctx[82].color);
			}

			if (dirty[0] & /*rows, selected*/ 1048584) {
				toggle_class(li, "sel", /*b*/ ctx[82].id === /*selected*/ ctx[3]);
			}

			if (dirty[0] & /*ranking, rows*/ 1050624) {
				toggle_class(li, "out", !/*r*/ ctx[83]?.rank);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(li);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (193:20) {#each [1, 3, 6, 12] as s}
function create_each_block(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler_19() {
		return /*click_handler_19*/ ctx[72](/*s*/ ctx[79]);
	}

	return {
		c() {
			button = element("button");
			button.textContent = `×${/*s*/ ctx[79]}h/s`;
			attr(button, "class", "svelte-9yg79b");
			toggle_class(button, "on", /*playSpeed*/ ctx[19] === /*s*/ ctx[79]);
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_19);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*playSpeed*/ 524288) {
				toggle_class(button, "on", /*playSpeed*/ ctx[19] === /*s*/ ctx[79]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let header;
	let div3;
	let t8;
	let div4;
	let t9;
	let span2;
	let t10_value = /*elapsed*/ ctx[41](/*tView*/ ctx[13]) + "";
	let t10;
	let t11;
	let button;
	let t13;
	let current_block_type_index;
	let if_block1;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isLive*/ ctx[15]) return create_if_block_11;
		return create_else_block_4;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*error*/ ctx[17] && !/*snapshot*/ ctx[0]) return 0;
		if (!/*snapshot*/ ctx[0]) return 1;
		return 2;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[27]}`;
			t1 = space();
			section = element("section");
			header = element("header");
			div3 = element("div");
			div3.innerHTML = `<span class="rr-back svelte-9yg79b">‹</span> <div><div class="rr-kicker svelte-9yg79b">13ᵉ édition · Saint-Malo → Pointe-à-Pitre</div> <h1 class="svelte-9yg79b">Route du Rhum <span class="svelte-9yg79b">2026</span></h1></div>`;
			t8 = space();
			div4 = element("div");
			if_block0.c();
			t9 = space();
			span2 = element("span");
			t10 = text(t10_value);
			t11 = space();
			button = element("button");
			button.textContent = "⟳";
			t13 = space();
			if_block1.c();
			attr(div0, "class", "plugin__mobile-header");
			attr(div3, "class", "rr-title svelte-9yg79b");
			attr(span2, "class", "rr-clock svelte-9yg79b");
			attr(button, "class", "rr-icon svelte-9yg79b");
			attr(button, "title", "Actualiser");
			toggle_class(button, "spin", /*loading*/ ctx[16]);
			attr(div4, "class", "rr-meta svelte-9yg79b");
			attr(header, "class", "rr-head svelte-9yg79b");
			attr(section, "class", "plugin__content rr svelte-9yg79b");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, header);
			append(header, div3);
			append(header, t8);
			append(header, div4);
			if_block0.m(div4, null);
			append(div4, t9);
			append(div4, span2);
			append(span2, t10);
			append(div4, t11);
			append(div4, button);
			append(section, t13);
			if_blocks[current_block_type_index].m(section, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div3, "click", /*click_handler*/ ctx[51]),
					listen(button, "click", /*refresh*/ ctx[28])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div4, t9);
				}
			}

			if ((!current || dirty[0] & /*tView*/ 8192) && t10_value !== (t10_value = /*elapsed*/ ctx[41](/*tView*/ ctx[13]) + "")) set_data(t10, t10_value);

			if (!current || dirty[0] & /*loading*/ 65536) {
				toggle_class(button, "spin", /*loading*/ ctx[16]);
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				} else {
					if_block1.p(ctx, dirty);
				}

				transition_in(if_block1, 1);
				if_block1.m(section, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if_block0.d();
			if_blocks[current_block_type_index].d();
			mounted = false;
			run_all(dispose);
		}
	};
}

const LS_PREFS = 'rr2026-prefs-v1';
const func = x => x[1];
const func_1 = x => [x[0], x[1]];

function instance($$self, $$props, $$invalidate) {
	let boats;
	let tNow;
	let isLive;
	let tView;
	let presentClasses;
	let leaders;
	let rows;
	let visible;
	let sel;
	let selPos;
	let selSpeed;
	let selHeading;
	let selSpeeds;
	let selD24;
	let historyNote;
	const { title } = config;
	const REFRESH_MS = 10 * 60 * 1000;
	let snapshot = null;
	let hist = loadLocal();
	let loading = false;
	let error = '';
	let remoteOk = false;
	let tab = 'all';
	let query = '';
	let selected = null;
	let follow = false;
	let showSettings = false;
	let favorites = new Set();
	let trackMode = 'all';
	let colorBy = 'boat';
	let labels = 'leaders';
	let mapScope = 'all';
	let time = null;
	let playing = false;
	let playSpeed = 3;
	let layer = null;
	let timer = null;
	let raf = 0;

	try {
		const p = JSON.parse(localStorage.getItem(LS_PREFS) || '{}');
		favorites = new Set(p.favorites ?? []);
		trackMode = p.trackMode ?? trackMode;
		colorBy = p.colorBy ?? colorBy;
		labels = p.labels ?? labels;
		mapScope = p.mapScope ?? mapScope;
	} catch {
		
	}

	let ranking = new Map();

	function computeRanking(list, t, live) {
		const out = new Map();

		if (live) {
			for (const b of list) {
				const s = b.state;

				if (s) out.set(b.id, {
					rank: s.status === 'RAC' ? s.rank : 0,
					dtf: s.dtf,
					dtl: s.dtl,
					speed: s.speed
				});
			}

			return out;
		}

		const byClass = new Map();

		for (const b of list) {
			const p = positionAt(b.track, t);
			if (!p) continue;
			const arr = byClass.get(b.className) ?? [];
			arr.push({ b, dtf: p.dtf, speed: p.speed });
			byClass.set(b.className, arr);
		}

		byClass.forEach(arr => {
			arr.sort((x, y) => x.dtf - y.dtf);
			const lead = arr[0]?.dtf ?? 0;

			arr.forEach((x, i) => out.set(x.b.id, {
				rank: i + 1,
				dtf: x.dtf,
				dtl: x.dtf - lead,
				speed: x.speed
			}));
		});

		return out;
	}

	async function refresh() {
		if (loading) return;
		$$invalidate(16, loading = true);

		try {
			const [live, remote] = await Promise.all([fetchLive(), fetchRemoteHistory()]);
			$$invalidate(44, remoteOk = !!remote);
			let h = hist;
			if (remote) h = mergeHistory(h, remote);
			h = mergeHistory(h, liveToHistory(live));
			hist = h;
			saveLocal(h);
			const first = !snapshot;
			$$invalidate(0, snapshot = buildSnapshot(live, h));
			$$invalidate(17, error = '');
			if (first) setTimeout(fitVisible, 50);
		} catch(e) {
			$$invalidate(17, error = e instanceof Error ? e.message : String(e));
			console.warn('[Rhum]', e);
		} finally {
			$$invalidate(16, loading = false);
		}
	}

	function select(id) {
		$$invalidate(3, selected = selected === id ? null : id);
		if (!selected) $$invalidate(4, follow = false);
		const b = boats.find(x => x.id === selected);
		if (b) centerOn(b);
	}

	function centerOn(b) {
		if (!b) return;
		const p = positionAt(b.track, tView);
		if (p) map.setView([p.lat, p.lon], Math.max(map.getZoom(), 6));
	}

	function fitVisible() {
		const pts = rows.map(b => positionAt(b.track, tView)).filter(Boolean).map(p => [p.lat, p.lon]);
		if (!pts.length) return;
		map.fitBounds(new L.LatLngBounds(pts), { padding: [40, 40], maxZoom: 8 });
	}

	function toggleFav(id) {
		favorites.has(id)
		? favorites.delete(id)
		: favorites.add(id);

		$$invalidate(5, favorites = new Set(favorites));
	}

	function scrub(v) {
		$$invalidate(45, time = v >= tNow - 60 ? null : v);
	}

	function goLive() {
		$$invalidate(10, playing = false);
		$$invalidate(45, time = null);
	}

	function togglePlay() {
		if (playing) {
			$$invalidate(10, playing = false);
			return;
		}

		if (time === null || time >= tNow - 60) $$invalidate(45, time = RACE_START);
		$$invalidate(10, playing = true);
		let last = performance.now();
		let acc = 0;

		const step = now => {
			if (!playing) return;
			const dt = (now - last) / 1000;
			last = now;
			acc += dt;

			if (acc > 0.08) {
				const next = (time ?? RACE_START) + playSpeed * 3600 * acc;
				acc = 0;

				if (next >= tNow) {
					goLive();
					return;
				}

				$$invalidate(45, time = next);
			}

			raf = requestAnimationFrame(step);
		};

		raf = requestAnimationFrame(step);
	}

	const fx = (v, d = 1) => v === undefined || v === null || !isFinite(v)
	? '–'
	: v.toFixed(d);

	const maxOf = s => s.length ? Math.max(...s.map(x => x[1])) : 0;
	const classCount = c => boats.filter(b => b.className === c).length;

	const DIRS = [
		'N',
		'NNE',
		'NE',
		'ENE',
		'E',
		'ESE',
		'SE',
		'SSE',
		'S',
		'SSO',
		'SO',
		'OSO',
		'O',
		'ONO',
		'NO',
		'NNO'
	];

	const cardinal = h => DIRS[Math.round((h % 360 + 360) % 360 / 22.5) % 16];

	const statusLabel = s => ({
		ARV: '🏁',
		ABD: 'ABD',
		STM: 'ESC',
		DNS: 'DNS',
		DNF: 'DNF'
	})[s ?? ''] ?? '–';

	function elapsed(t) {
		const s = Math.max(0, t - RACE_START);
		const d = Math.floor(s / 86400);
		const h = Math.floor(s % 86400 / 3600);
		const m = Math.floor(s % 3600 / 60);
		return `J+${d} ${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
	}

	const fmtDate = t => new Date(t * 1000).toLocaleString('fr-FR', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit'
	});

	const onopen = () => {
		if (snapshot) fitVisible();
	};

	onMount(() => {
		$$invalidate(46, layer = new RaceLayer(id => select(id)));
		refresh();
		timer = setInterval(refresh, REFRESH_MS);
	});

	onDestroy(() => {
		$$invalidate(10, playing = false);
		cancelAnimationFrame(raf);
		if (timer) clearInterval(timer);
		layer?.destroy();
		$$invalidate(46, layer = null);
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	const click_handler_1 = () => $$invalidate(4, follow = !follow);
	const click_handler_2 = () => centerOn(sel);
	const click_handler_3 = () => toggleFav(sel.id);
	const click_handler_4 = () => select(null);
	const click_handler_5 = () => $$invalidate(1, tab = 'all');
	const click_handler_6 = c => $$invalidate(1, tab = c.name);
	const click_handler_7 = () => $$invalidate(1, tab = 'fav');

	function input0_input_handler() {
		query = this.value;
		$$invalidate(2, query);
	}

	const click_handler_8 = () => $$invalidate(18, showSettings = !showSettings);
	const click_handler_9 = v => $$invalidate(6, trackMode = v);
	const click_handler_10 = () => $$invalidate(7, colorBy = 'boat');
	const click_handler_11 = () => $$invalidate(7, colorBy = 'class');
	const click_handler_12 = () => $$invalidate(8, labels = 'none');
	const click_handler_13 = () => $$invalidate(8, labels = 'leaders');
	const click_handler_14 = () => $$invalidate(8, labels = 'all');
	const click_handler_15 = () => $$invalidate(9, mapScope = 'all');
	const click_handler_16 = () => $$invalidate(9, mapScope = 'tab');
	const click_handler_17 = b => toggleFav(b.id);
	const click_handler_18 = b => select(b.id);
	const input_handler = e => scrub(+e.currentTarget.value);
	const click_handler_19 = s => $$invalidate(19, playSpeed = s);

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*favorites, trackMode, colorBy, labels, mapScope*/ 992) {
			try {
				localStorage.setItem(LS_PREFS, JSON.stringify({
					favorites: [...favorites],
					trackMode,
					colorBy,
					labels,
					mapScope
				}));
			} catch {
				
			}
		}

		if ($$self.$$.dirty[0] & /*snapshot*/ 1) {
			$$invalidate(47, boats = snapshot?.boats ?? []);
		}

		if ($$self.$$.dirty[0] & /*snapshot*/ 1 | $$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(12, tNow = Math.max(snapshot?.reportDate ?? 0, ...boats.map(b => b.track[b.track.length - 1]?.[0] ?? 0), RACE_START + 60));
		}

		if ($$self.$$.dirty[1] & /*time*/ 16384) {
			$$invalidate(15, isLive = time === null);
		}

		if ($$self.$$.dirty[0] & /*tNow*/ 4096 | $$self.$$.dirty[1] & /*time*/ 16384) {
			$$invalidate(13, tView = time ?? tNow);
		}

		if ($$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(26, presentClasses = CLASSES.filter(c => boats.some(b => b.className === c.name)));
		}

		if ($$self.$$.dirty[0] & /*tView, isLive*/ 40960 | $$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(11, ranking = computeRanking(boats, tView, isLive));
		}

		if ($$self.$$.dirty[0] & /*ranking*/ 2048) {
			$$invalidate(49, leaders = new Set([...ranking].filter(([,r]) => r.rank === 1).map(([id]) => id)));
		}

		if ($$self.$$.dirty[0] & /*tab, favorites, query, ranking*/ 2086 | $$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(20, rows = boats.filter(b => tab === 'all'
			? true
			: tab === 'fav'
				? favorites.has(b.id)
				: b.className === tab).filter(b => {
				const q = query.trim().toLowerCase();
				return !q || `${b.name} ${b.skipper} ${b.nat}`.toLowerCase().includes(q);
			}).sort((a, b) => {
				const ra = ranking.get(a.id);
				const rb = ranking.get(b.id);
				const ca = CLASSES.findIndex(c => c.name === a.className);
				const cb = CLASSES.findIndex(c => c.name === b.className);

				if (tab === 'all' || tab === 'fav') {
					if (ca !== cb) return (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb);
				}

				return (ra?.rank || 999) - (rb?.rank || 999);
			}));
		}

		if ($$self.$$.dirty[0] & /*mapScope, tab, favorites*/ 546 | $$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(50, visible = new Set(boats.filter(b => mapScope === 'all'
				? true
				: tab === 'all'
					? true
					: tab === 'fav'
						? favorites.has(b.id)
						: b.className === tab).map(b => b.id)));
		}

		if ($$self.$$.dirty[0] & /*selected*/ 8 | $$self.$$.dirty[1] & /*boats*/ 65536) {
			$$invalidate(14, sel = boats.find(b => b.id === selected) ?? null);
		}

		if ($$self.$$.dirty[0] & /*sel, tView*/ 24576) {
			$$invalidate(48, selPos = sel ? positionAt(sel.track, tView) : null);
		}

		if ($$self.$$.dirty[0] & /*sel, isLive*/ 49152 | $$self.$$.dirty[1] & /*selPos*/ 131072) {
			$$invalidate(25, selSpeed = sel
			? isLive && sel.state
				? sel.state.speed
				: selPos?.speed ?? 0
			: 0);
		}

		if ($$self.$$.dirty[0] & /*sel, isLive*/ 49152 | $$self.$$.dirty[1] & /*selPos*/ 131072) {
			$$invalidate(24, selHeading = sel
			? isLive && sel.state
				? sel.state.heading
				: selPos?.heading ?? 0
			: 0);
		}

		if ($$self.$$.dirty[0] & /*sel*/ 16384) {
			$$invalidate(23, selSpeeds = sel ? speedSeries(sel.track) : []);
		}

		if ($$self.$$.dirty[0] & /*sel, tView*/ 24576) {
			$$invalidate(22, selD24 = sel ? dist24h(sel.track, tView) : 0);
		}

		if ($$self.$$.dirty[1] & /*remoteOk*/ 8192) {
			$$invalidate(21, historyNote = remoteOk
			? ' · historique complet'
			: ' · historique accumulé localement');
		}

		if ($$self.$$.dirty[0] & /*snapshot, tView, selected, favorites, trackMode, labels, colorBy*/ 8681 | $$self.$$.dirty[1] & /*layer, boats, visible, leaders*/ 884736) {
			if (layer && snapshot) {
				layer.render(boats, {
					time: tView,
					visible,
					selected,
					favorites,
					trackMode,
					labels,
					colorBy,
					leaders
				});
			}
		}

		if ($$self.$$.dirty[0] & /*follow, playing*/ 1040 | $$self.$$.dirty[1] & /*selPos*/ 131072) {
			if (follow && selPos) map.panTo([selPos.lat, selPos.lon], { animate: !playing });
		}
	};

	return [
		snapshot,
		tab,
		query,
		selected,
		follow,
		favorites,
		trackMode,
		colorBy,
		labels,
		mapScope,
		playing,
		ranking,
		tNow,
		tView,
		sel,
		isLive,
		loading,
		error,
		showSettings,
		playSpeed,
		rows,
		historyNote,
		selD24,
		selSpeeds,
		selHeading,
		selSpeed,
		presentClasses,
		title,
		refresh,
		select,
		centerOn,
		fitVisible,
		toggleFav,
		scrub,
		goLive,
		togglePlay,
		fx,
		maxOf,
		classCount,
		cardinal,
		statusLabel,
		elapsed,
		fmtDate,
		onopen,
		remoteOk,
		time,
		layer,
		boats,
		selPos,
		leaders,
		visible,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		input0_input_handler,
		click_handler_8,
		click_handler_9,
		click_handler_10,
		click_handler_11,
		click_handler_12,
		click_handler_13,
		click_handler_14,
		click_handler_15,
		click_handler_16,
		click_handler_17,
		click_handler_18,
		input_handler,
		click_handler_19
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 43 }, add_css, [-1, -1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[43];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
