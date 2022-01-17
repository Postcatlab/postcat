/* eslint-disable no-shadow, no-invalid-this */
/* global vm, host, Contextify, Decontextify, VMError */

'use strict';

const {Script} = host.require('vm');
const fs = host.require('fs');
const pa = host.require('path');
const {match} = host.require('../lib/wildcard');

const BUILTIN_MODULES = host.process.binding('natives');
const parseJSON = JSON.parse;

/**
 * @param {Object} host Hosts's internal objects.
 */

return ((vm, host) => {
	'use strict';

	const global = this;

	const TIMERS = new host.WeakMap(); // Contains map of timers created inside sandbox
	const BUILTINS = {};
	const CACHE = {};
	const EXTENSIONS = {
		['.json'](module, filename) {
			try {
				const code = fs.readFileSync(filename, 'utf8');
				module.exports = parseJSON(code);
			} catch (e) {
				throw Contextify.value(e);
			}
		},
		['.node'](module, filename) {
			if (vm.options.require.context === 'sandbox') throw new VMError('Native modules can be required only with context set to \'host\'.');

			try {
				module.exports = Contextify.readonly(host.require(filename));
			} catch (e) {
				throw Contextify.value(e);
			}
		}
	};

	for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
		const ext = vm.options.sourceExtensions[i];

		EXTENSIONS['.' + ext] = (module, filename, dirname) => {
			if (vm.options.require.context !== 'sandbox') {
				try {
					module.exports = Contextify.readonly(host.require(filename));
				} catch (e) {
					throw Contextify.value(e);
				}
			} else {
				let closure;

				try {
					// Load module
					let contents = fs.readFileSync(filename, 'utf8');
					if (typeof vm.options.compiler === 'function') {
						contents = vm.options.compiler(contents, filename);
					}

					const code = `(function (exports, require, module, __filename, __dirname) { 'use strict'; ${contents} \n});`;

					// Precompile script
					const script = new Script(code, {
						filename: filename || 'vm.js',
						displayErrors: false
					});

					closure = script.runInContext(global, {
						filename: filename || 'vm.js',
						displayErrors: false
					});
				} catch (ex) {
					throw Contextify.value(ex);
				}

				// run the script
				closure(module.exports, module.require, module, filename, dirname);
			}
		};
	}

	const _parseExternalOptions = (options) => {
		if (Array.isArray(options)) {
			return {
				external: options,
				transitive: false
			};
		}

		return {
			external: options.modules,
			transitive: options.transitive
		};
	};

	/**
	 * Resolve filename.
	 */

	const _resolveFilename = (path) => {
		if (!path) return null;
		path = pa.resolve(path);

		const exists = fs.existsSync(path);
		const isdir = exists ? fs.statSync(path).isDirectory() : false;

		// direct file match
		if (exists && !isdir) return path;

		// load as file

		for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
			const ext = vm.options.sourceExtensions[i];
			if (fs.existsSync(`${path}.${ext}`)) return `${path}.${ext}`;
		}
		if (fs.existsSync(`${path}.json`)) return `${path}.json`;
		if (fs.existsSync(`${path}.node`)) return `${path}.node`;

		// load as module

		if (fs.existsSync(`${path}/package.json`)) {
			let pkg;
			try {
				pkg = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
			} catch (ex) {
				throw new VMError(`Module '${path}' has invalid package.json`, 'EMODULEINVALID');
			}

			let main;
			if (pkg && pkg.main) {
				main = _resolveFilename(`${path}/${pkg.main}`);
				if (!main) main = _resolveFilename(`${path}/index`);
			} else {
				main = _resolveFilename(`${path}/index`);
			}

			return main;
		}

		// load as directory

		for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
			const ext = vm.options.sourceExtensions[i];
			if (fs.existsSync(`${path}/index.${ext}`)) return `${path}/index.${ext}`;
		}

		if (fs.existsSync(`${path}/index.json`)) return `${path}/index.json`;
		if (fs.existsSync(`${path}/index.node`)) return `${path}/index.node`;

		return null;
	};

	/**
	 * Builtin require.
	 */

	const _requireBuiltin = (moduleName) => {
		if (moduleName === 'buffer') return ({Buffer});
		if (BUILTINS[moduleName]) return BUILTINS[moduleName].exports; // Only compiled builtins are stored here

		if (moduleName === 'util') {
			return Contextify.readonly(host.require(moduleName), {
				// Allows VM context to use util.inherits
				inherits: (ctor, superCtor) => {
					ctor.super_ = superCtor;
					Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
				}
			});
		}

		if (moduleName === 'events' || moduleName === 'internal/errors') {
			try {
				const script = new Script(`(function (exports, require, module, process, internalBinding) {
						'use strict';
						const primordials = global;
						${BUILTIN_MODULES[moduleName]}
						\n
					});`, {
					filename: `${moduleName}.vm.js`
				});

				// setup module scope
				const module = BUILTINS[moduleName] = {
					exports: {},
					require: _requireBuiltin
				};

				// run script
				script.runInContext(global)(module.exports, module.require, module, host.process, host.process.binding);

				return module.exports;
			} catch (e) {
				throw Contextify.value(e);
			}
		}

		return Contextify.readonly(host.require(moduleName));
	};

	/**
	 * Prepare require.
	 */

	const _prepareRequire = (currentDirname, parentAllowsTransitive = false) => {
		const _require = moduleName => {
			if (vm.options.nesting && moduleName === 'vm2') return {VM: Contextify.readonly(host.VM), NodeVM: Contextify.readonly(host.NodeVM)};
			if (!vm.options.require) throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');
			if (moduleName == null) throw new VMError("Module '' not found.", 'ENOTFOUND');
			if (typeof moduleName !== 'string') throw new VMError(`Invalid module name '${moduleName}'`, 'EINVALIDNAME');

			let filename;
			let allowRequireTransitive = false;

			// Mock?

			if (vm.options.require.mock && vm.options.require.mock[moduleName]) {
				return Contextify.readonly(vm.options.require.mock[moduleName]);
			}

			// Builtin?

			if (BUILTIN_MODULES[moduleName]) {
				if (host.Array.isArray(vm.options.require.builtin)) {
					if (vm.options.require.builtin.indexOf('*') >= 0) {
						if (vm.options.require.builtin.indexOf(`-${moduleName}`) >= 0) {
							throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');
						}
					} else if (vm.options.require.builtin.indexOf(moduleName) === -1) {
						throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');
					}
				} else if (vm.options.require.builtin) {
					if (!vm.options.require.builtin[moduleName]) {
						throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');
					}
				} else {
					throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');
				}

				return _requireBuiltin(moduleName);
			}

			// External?

			if (!vm.options.require.external) throw new VMError(`Access denied to require '${moduleName}'`, 'EDENIED');

			if (/^(\.|\.\/|\.\.\/)/.exec(moduleName)) {
				// Module is relative file, e.g. ./script.js or ../script.js

				if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

				filename = _resolveFilename(`${currentDirname}/${moduleName}`);
			} else if (/^(\/|\\|[a-zA-Z]:\\)/.exec(moduleName)) {
				// Module is absolute file, e.g. /script.js or //server/script.js or C:\script.js

				filename = _resolveFilename(moduleName);
			} else {
				// Check node_modules in path

				if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

				if (typeof vm.options.require.external === 'object') {
					const { external, transitive } = _parseExternalOptions(vm.options.require.external);

					const isWhitelisted = external.some(ext => match(ext, moduleName)) || (transitive && parentAllowsTransitive);
					if (!isWhitelisted) {
						throw new VMError(`The module '${moduleName}' is not whitelisted in VM.`, 'EDENIED');
					}

					allowRequireTransitive = true;
				}

				const paths = currentDirname.split(pa.sep);

				while (paths.length) {
					const path = paths.join(pa.sep);

					// console.log moduleName, "#{path}#{pa.sep}node_modules#{pa.sep}#{moduleName}"

					filename = _resolveFilename(`${path}${pa.sep}node_modules${pa.sep}${moduleName}`);
					if (filename) break;

					paths.pop();
				}
			}

			if (!filename && vm.options.require.resolve) {
				filename = _resolveFilename(vm.options.require.resolve(moduleName, currentDirname));
			}
			if (!filename) throw new VMError(`Cannot find module '${moduleName}'`, 'ENOTFOUND');

			// return cache whenever possible
			if (CACHE[filename]) return CACHE[filename].exports;

			const dirname = pa.dirname(filename);
			const extname = pa.extname(filename);

			if (vm.options.require.root) {
				const rootPaths = Array.isArray(vm.options.require.root) ? vm.options.require.root : [vm.options.require.root];
				const allowedModule = rootPaths.some(path => dirname.startsWith(pa.resolve(path)));

				if (!allowedModule) {
					throw new VMError(`Module '${moduleName}' is not allowed to be required. The path is outside the border!`, 'EDENIED');
				}
			}

			const module = CACHE[filename] = {
				filename,
				exports: {},
				require: _prepareRequire(dirname, allowRequireTransitive)
			};

			// lookup extensions
			if (EXTENSIONS[extname]) {
				EXTENSIONS[extname](module, filename, dirname);
				return module.exports;
			}

			throw new VMError(`Failed to load '${moduleName}': Unknown type.`, 'ELOADFAIL');
		};

		return _require;
	};

	/**
	 * Prepare sandbox.
	 */

	global.setTimeout = (callback, delay, ...args) => {
		const tmr = host.setTimeout(Decontextify.value(() => {
			callback(...args);
		}), Decontextify.value(delay));

		const local = {
			ref: () => tmr.ref(),
			unref: () => tmr.unref()
		};

		TIMERS.set(local, tmr);
		return local;
	};

	global.setInterval = (callback, interval, ...args) => {
		const tmr = host.setInterval(Decontextify.value(() => {
			callback(...args);
		}), Decontextify.value(interval));

		const local = {
			ref: () => tmr.ref(),
			unref: () => tmr.unref()
		};

		TIMERS.set(local, tmr);
		return local;
	};

	global.setImmediate = (callback, ...args) => {
		const tmr = host.setImmediate(Decontextify.value(() => {
			callback(...args);
		}));

		const local = {
			ref: () => tmr.ref(),
			unref: () => tmr.unref()
		};

		TIMERS.set(local, tmr);
		return local;
	};

	global.clearTimeout = (local) => {
		host.clearTimeout(TIMERS.get(local));
		return null;
	};

	global.clearInterval = (local) => {
		host.clearInterval(TIMERS.get(local));
		return null;
	};

	global.clearImmediate = (local) => {
		host.clearImmediate(TIMERS.get(local));
		return null;
	};

	global.process = {
		argv: [],
		title: host.process.title,
		version: host.process.version,
		versions: Contextify.readonly(host.process.versions),
		arch: host.process.arch,
		platform: host.process.platform,
		env: {},
		pid: host.process.pid,
		features: Contextify.readonly(host.process.features),
		nextTick(callback, ...args) {
			if (typeof callback !== 'function') {
				throw new Error('Callback must be a function.');
			}

			try {
				return host.process.nextTick(Decontextify.value(() => {
					callback(...args);
				}));
			} catch (e) {
				throw Contextify.value(e);
			}
		},
		hrtime() {
			try {
				return host.process.hrtime();
			} catch (e) {
				throw Contextify.value(e);
			}
		},
		cwd() {
			try {
				return host.process.cwd();
			} catch (e) {
				throw Contextify.value(e);
			}
		},
		on(name, handler) {
			if (name !== 'beforeExit' && name !== 'exit') {
				throw new Error(`Access denied to listen for '${name}' event.`);
			}

			try {
				host.process.on(name, Decontextify.value(handler));
			} catch (e) {
				throw Contextify.value(e);
			}

			return this;
		},

		once(name, handler) {
			if (name !== 'beforeExit' && name !== 'exit') {
				throw new Error(`Access denied to listen for '${name}' event.`);
			}

			try {
				host.process.once(name, Decontextify.value(handler));
			} catch (e) {
				throw Contextify.value(e);
			}

			return this;
		},

		listeners(name) {
			// Filter out listeners, which were not created in this sandbox (isVMProxy is undefined)
			return Contextify.value(host.process.listeners(name).filter(listener => !Contextify.value(listener).isVMProxy));
		},

		removeListener(name, handler) {
			try {
				host.process.removeListener(name, Decontextify.value(handler));
			} catch (e) {
				throw Contextify.value(e);
			}

			return this;
		},

		umask() {
			if (arguments.length) {
				throw new Error('Access denied to set umask.');
			}

			try {
				return host.process.umask();
			} catch (e) {
				throw Contextify.value(e);
			}
		}
	};

	if (vm.options.console === 'inherit') {
		global.console = Contextify.readonly(host.console);
	} else if (vm.options.console === 'redirect') {
		global.console = {
			debug(...args) {
				vm.emit('console.debug', ...Decontextify.arguments(args));
				return null;
			},
			log(...args) {
				vm.emit('console.log', ...Decontextify.arguments(args));
				return null;
			},
			info(...args) {
				vm.emit('console.info', ...Decontextify.arguments(args));
				return null;
			},
			warn(...args) {
				vm.emit('console.warn', ...Decontextify.arguments(args));
				return null;
			},
			error(...args) {
				vm.emit('console.error', ...Decontextify.arguments(args));
				return null;
			},
			dir(...args) {
				vm.emit('console.dir', ...Decontextify.arguments(args));
				return null;
			},
			time: () => {},
			timeEnd: () => {},
			trace(...args) {
				vm.emit('console.trace', ...Decontextify.arguments(args));
				return null;
			}
		};
	}

	/*
	Return contextized require.
	*/

	return _prepareRequire;
})(vm, host);
