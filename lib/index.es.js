import { createFilter } from '@rollup/pluginutils';
import * as defaultTs from 'typescript';
import { readFileSync, readFile } from 'fs';
import { join } from 'path';
import resolveId from 'resolve';

function getDefaultOptions() {
    return {
        noEmitHelpers: true,
        module: 'ESNext',
        sourceMap: true,
        importHelpers: true
    };
}
function readTsConfig(ts, tsconfigPath) {
    if (tsconfigPath && !ts.sys.fileExists(tsconfigPath)) {
        throw new Error("Could not find specified tsconfig.json at " + tsconfigPath);
    }
    var existingTsConfig = tsconfigPath || ts.findConfigFile(process.cwd(), ts.sys.fileExists);
    if (!existingTsConfig) {
        return {};
    }
    var tsconfig = ts.readConfigFile(existingTsConfig, function (path) { return readFileSync(path, 'utf8'); });
    if (!tsconfig.config || !tsconfig.config.compilerOptions)
        return { compilerOptions: {} };
    var extendedTsConfig = tsconfig.config.extends;
    if (tsconfigPath && extendedTsConfig) {
        tsconfig.config.extends = join(process.cwd(), existingTsConfig, '..', extendedTsConfig);
    }
    return tsconfig.config;
}
function adjustCompilerOptions(options) {
    var opts = Object.assign({}, options);
    // Set `sourceMap` to `inlineSourceMap` if it's a boolean
    // under the assumption that both are never specified simultaneously.
    if (typeof opts.inlineSourceMap === 'boolean') {
        opts.sourceMap = opts.inlineSourceMap;
        delete opts.inlineSourceMap;
    }
    // Delete some options to prevent compilation error.
    // See: https://github.com/rollup/rollup-plugin-typescript/issues/45
    // See: https://github.com/rollup/rollup-plugin-typescript/issues/142
    delete opts.declaration;
    // Delete the `declarationMap` option, as it will cause an error, because we have
    // deleted the `declaration` option.
    delete opts.declarationMap;
    delete opts.incremental;
    delete opts.tsBuildInfoFile;
    return opts;
}
function parseCompilerOptions(ts, tsConfig) {
    var _a, _b;
    var parsed = ts.convertCompilerOptionsFromJson(tsConfig.compilerOptions, process.cwd());
    // let typescript load inheritance chain if there are base configs
    var extendedConfig = tsConfig.extends
        ? ts.parseJsonConfigFileContent(tsConfig, ts.sys, process.cwd(), parsed.options)
        : null;
    return {
        options: ((_a = extendedConfig) === null || _a === void 0 ? void 0 : _a.options) || parsed.options,
        errors: parsed.errors.concat(((_b = extendedConfig) === null || _b === void 0 ? void 0 : _b.errors) || [])
    };
}
/**
 * Verify that we're targeting ES2015 modules.
 * @param moduleType `tsConfig.compilerOptions.module`
 */
function validateModuleType(moduleType) {
    var esModuleTypes = new Set(['ES2015', 'ES6', 'ESNEXT', 'COMMONJS']);
    if (!esModuleTypes.has(moduleType.toUpperCase())) {
        throw new Error("@rollup/plugin-typescript: The module kind should be 'ES2015' or 'ESNext, found: '" + moduleType + "'");
    }
}

// `Cannot compile modules into 'es6' when targeting 'ES5' or lower.`
var CANNOT_COMPILE_ESM = 1204;
/**
 * For each type error reported by Typescript, emit a Rollup warning or error.
 */
function emitDiagnostics(ts, context, diagnostics) {
    if (!diagnostics)
        return;
    diagnostics
        .filter(function (diagnostic) { return diagnostic.code !== CANNOT_COMPILE_ESM; })
        .forEach(function (diagnostic) {
        // Build a Rollup warning object from the diagnostics object.
        var warning = diagnosticToWarning(ts, diagnostic);
        // Errors are fatal. Otherwise emit warnings.
        if (diagnostic.category === ts.DiagnosticCategory.Error) {
            context.error(warning);
        }
        else {
            context.warn(warning);
        }
    });
}
/**
 * Converts a Typescript type error into an equivalent Rollup warning object.
 */
function diagnosticToWarning(ts, diagnostic) {
    var pluginCode = "TS" + diagnostic.code;
    var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    // Build a Rollup warning object from the diagnostics object.
    var warning = {
        pluginCode: pluginCode,
        message: "@rollup/plugin-typescript " + pluginCode + ": " + message
    };
    // Add information about the file location
    if (diagnostic.file) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        warning.loc = {
            column: character + 1,
            line: line + 1,
            file: diagnostic.file.fileName
        };
    }
    return warning;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var TSLIB_ID = '\0tslib';
var readFileAsync = function (file) {
    return new Promise(function (fulfil, reject) {
        return readFile(file, 'utf-8', function (err, contents) { return (err ? reject(err) : fulfil(contents)); });
    });
};
var resolveIdAsync = function (file, opts) {
    return new Promise(function (fulfil, reject) {
        return resolveId(file, opts, function (err, contents) { return (err ? reject(err) : fulfil(contents)); });
    });
};
/**
 * Returns code asynchronously for the tslib helper library.
 * @param opts.tslib Overrides the injected helpers with a custom version.
 */
function getTsLibCode(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (opts.tslib)
                        return [2 /*return*/, opts.tslib];
                    return [4 /*yield*/, resolveIdAsync('tslib/tslib.es6.js', { basedir: __dirname })];
                case 1:
                    defaultPath = _a.sent();
                    return [2 /*return*/, readFileAsync(defaultPath)];
            }
        });
    });
}

function typescript(options) {
    if (options === void 0) { options = {}; }
    var opts = Object.assign({}, options);
    var filter = createFilter(opts.include || ['*.ts+(|x)', '**/*.ts+(|x)'], opts.exclude || ['*.d.ts', '**/*.d.ts']);
    delete opts.include;
    delete opts.exclude;
    // Allow users to override the TypeScript version used for transpilation and tslib version used for helpers.
    var ts = opts.typescript || defaultTs;
    delete opts.typescript;
    var tslib = getTsLibCode(opts);
    delete opts.tslib;
    // Load options from `tsconfig.json` unless explicitly asked not to.
    var tsConfig = opts.tsconfig === false ? { compilerOptions: {} } : readTsConfig(ts, opts.tsconfig);
    delete opts.tsconfig;
    // Since the CompilerOptions aren't designed for the Rollup
    // use case, we'll adjust them for use with Rollup.
    tsConfig.compilerOptions = adjustCompilerOptions(tsConfig.compilerOptions);
    Object.assign(tsConfig.compilerOptions, getDefaultOptions(), adjustCompilerOptions(opts));
    // Verify that we're targeting ES2015 modules.
    validateModuleType(tsConfig.compilerOptions.module);
    var _a = parseCompilerOptions(ts, tsConfig), compilerOptions = _a.options, errors = _a.errors;
    return {
        name: 'typescript',
        buildStart: function () {
            var _this = this;
            if (errors.length > 0) {
                errors.forEach(function (error) { return _this.warn(diagnosticToWarning(ts, error)); });
                this.error("@rollup/plugin-typescript: Couldn't process compiler options");
            }
        },
        resolveId: function (importee, importer) {
            if (importee === 'tslib') {
                return TSLIB_ID;
            }
            if (!importer)
                return null;
            var containingFile = importer.split('\\').join('/');
            var result = ts.nodeModuleNameResolver(importee, containingFile, compilerOptions, ts.sys);
            if (result.resolvedModule && result.resolvedModule.resolvedFileName) {
                if (result.resolvedModule.resolvedFileName.endsWith('.d.ts')) {
                    return null;
                }
                return result.resolvedModule.resolvedFileName;
            }
            return null;
        },
        load: function (id) {
            if (id === TSLIB_ID) {
                return tslib;
            }
            return null;
        },
        transform: function (code, id) {
            if (!filter(id))
                return null;
            var transformed = ts.transpileModule(code, {
                fileName: id,
                reportDiagnostics: true,
                compilerOptions: compilerOptions
            });
            emitDiagnostics(ts, this, transformed.diagnostics);
            return {
                code: transformed.outputText,
                // Rollup expects `map` to be an object so we must parse the string
                map: transformed.sourceMapText ? JSON.parse(transformed.sourceMapText) : null
            };
        }
    };
}

export default typescript;
