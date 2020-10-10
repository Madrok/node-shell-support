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
import { exec, spawn } from 'child_process';
const log = console.debug;

export interface TesseractOptions {
	/** Will log the command line to console.debug */
	debug?: boolean,
	/** the path to tesseract binary, if needed */
	binary?: string,
	/** 
	 * Additional configfiles to add to the command line.
	 * @see [Tesseract man page](https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc)
	*/
	presets?: Array<string>
}

export class TesseractShell {

	/**
	 * Launches tesseract and pipe a javascript buffer containing image data to it.
	 * 
	 * @param data Buffer of image data
	 * @param config TesseractOptions object
	 */
	static recognizePipe(data: Buffer, config: TesseractOptions = {}): Promise<string> {
		const options = TesseractShell.getSpawnOpts(config);
		const binary = config.binary || "tesseract";

		let args: Array<string> = [
			"-", // use stdin
			"stdout", // return info to stdout
		];
		args = args.concat(options as Array<string>);
		if (config.debug) {
			log("command", binary, args.join(' '));
			log(args);
		}

		return new Promise((resolve, reject) => {
			const child = spawn(binary, args);
			let res = "";
			child.on('close', (code: number, signal: NodeJS.Signals) => {
				//log("spawn closed", code, signal);
				resolve(res);
			});
			child.on('error', (err: Error) => {
				//log("spawn error", err.message);
				reject(err);
			});
			child.stdout.on('data', (data) => {
				//log(`child stdout: ${data}`);
				res += data.toString().trim();
			});

			child.stderr.on('data', (data) => {
				console.error(`child stderr: ${data}`);
			});

			try {
				child.stdin.write(data, () => {
					child.stdin.end();
				});
			} catch (e) {
				console.error("Unable to write to tesseract pipe");
				reject(e);
			}
		});
	}

	/**
	 * Launch Tesseract to read an image file.
	 * 
	 * @param filename The image file to read
	 * @param config TesseractOptions object
	 */
	static recognizeFile(filename: string, config: TesseractOptions = {}) {
		const options = TesseractShell.getExecOptions(config)
		const binary = config.binary || "tesseract"

		const command = [binary, `"${filename}"`, "stdout", ...options].join(" ")
		if (config.debug) log("command", command)

		return new Promise((resolve, reject) => {
			exec(command, (error: any, stdout: string, stderr: string) => {
				if (config.debug) log(stderr)
				if (error) reject(error)
				resolve(stdout)
			})
		})
	}

	/**
	 * @ignore 
	 */
	private static getSpawnOpts(config: TesseractOptions = {}): Array<string> {
		const ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"]
		let opts = [];
		for (const [key, value] of Object.entries(config)) {
			log(`${key}: ${value}`);
			if (key === "lang") {
				opts.push("-l");
				opts.push(`${value}`)
			} else if (!["binary", "debug", "presets"].includes(key)) {
				if (ocrOptions.includes(key)) {
					opts.push(`--${key}`);
					opts.push(`${value}`);
				} else {
					opts.push('-c');
					opts.push(`${key}=${value}`);
				}
			}
		}
		if (config.presets)
			opts.concat(config.presets);
		return opts;
	}



	/**
	 * @ignore
	 */
	private static getExecOptions(config: TesseractOptions) {
		const ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"]

		return Object.entries(config)
			.map(([key, value]) => {
				if (["debug", "presets", "binary"].includes(key)) return
				if (key === "lang") return `-l ${value}`
				if (ocrOptions.includes(key)) return `--${key} ${value}`

				return `-c ${key}=${value}`
			})
			.concat(config.presets)
			.filter(Boolean)
	}
}