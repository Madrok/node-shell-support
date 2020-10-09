"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesseractShell = void 0;
/*
MIT License

Copyright (c) 2019-2020 zapolnoch, Russell Weir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * TesseractShell provides methods to run [Tesseract Optical Character Recognition](https://github.com/tesseract-ocr/tesseract)
 * package.
 * @author zapolnoch
 * @author Russell Weir
 * @packageDocumentation
 */
var child_process_1 = require("child_process");
var log = console.debug;
var TesseractShell = /** @class */ (function () {
    function TesseractShell() {
    }
    /**
     * Launches tesseract and pipe a javascript buffer containing image data to it.
     * @see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
     * @param data Buffer of image data
     * @param config TesseractOptions object
     */
    TesseractShell.recognizePipe = function (data, config) {
        if (config === void 0) { config = {}; }
        var options = TesseractShell.getSpawnOpts(config);
        var binary = config.binary || "tesseract";
        var args = [
            "-",
            "stdout",
        ];
        args = args.concat(options);
        if (config.debug) {
            log("command", binary, args.join(' '));
            log(args);
        }
        return new Promise(function (resolve, reject) {
            var child = child_process_1.spawn(binary, args);
            var res = "";
            child.on('close', function (code, signal) {
                //log("spawn closed", code, signal);
                resolve(res);
            });
            child.on('error', function (err) {
                //log("spawn error", err.message);
                reject(err);
            });
            child.stdout.on('data', function (data) {
                //log(`child stdout: ${data}`);
                res += data.toString().trim();
            });
            child.stderr.on('data', function (data) {
                console.error("child stderr: " + data);
            });
            try {
                child.stdin.write(data, function () {
                    child.stdin.end();
                });
            }
            catch (e) {
                console.error("Unable to write to tesseract pipe");
                reject(e);
            }
        });
    };
    /**
     * Launch Tesseract to read an image file.
     * @see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
     * @param filename The image file to read
     * @param config TesseractOptions object
     */
    TesseractShell.recognizeFile = function (filename, config) {
        if (config === void 0) { config = {}; }
        var options = TesseractShell.getExecOptions(config);
        var binary = config.binary || "tesseract";
        var command = __spreadArrays([binary, "\"" + filename + "\"", "stdout"], options).join(" ");
        if (config.debug)
            log("command", command);
        return new Promise(function (resolve, reject) {
            child_process_1.exec(command, function (error, stdout, stderr) {
                if (config.debug)
                    log(stderr);
                if (error)
                    reject(error);
                resolve(stdout);
            });
        });
    };
    /**
     * @ignore
     */
    TesseractShell.getSpawnOpts = function (config) {
        if (config === void 0) { config = {}; }
        var ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"];
        var opts = [];
        for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            log(key + ": " + value);
            if (key === "lang") {
                opts.push("-l");
                opts.push("" + value);
            }
            else if (!["binary", "debug", "presets"].includes(key)) {
                if (ocrOptions.includes(key)) {
                    opts.push("--" + key);
                    opts.push("" + value);
                }
                else {
                    opts.push('-c');
                    opts.push(key + "=" + value);
                }
            }
        }
        if (config.presets)
            opts.concat(config.presets);
        return opts;
    };
    /**
     * @ignore
     */
    TesseractShell.getExecOptions = function (config) {
        var ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"];
        return Object.entries(config)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            if (["debug", "presets", "binary"].includes(key))
                return;
            if (key === "lang")
                return "-l " + value;
            if (ocrOptions.includes(key))
                return "--" + key + " " + value;
            return "-c " + key + "=" + value;
        })
            .concat(config.presets)
            .filter(Boolean);
    };
    return TesseractShell;
}());
exports.TesseractShell = TesseractShell;
