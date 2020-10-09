/// <reference types="node" />
export interface TesseractOptions {
    /** Will log the command line to console.debug */
    debug?: boolean;
    /** the path to tesseract binary, if needed */
    binary?: string;
    /**
     * Additional configfiles to add to the command line.
     * @see [Tesseract man page](https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc)
    */
    presets?: Array<string>;
}
export declare class TesseractShell {
    /**
     * Launches tesseract and pipe a javascript buffer containing image data to it.
     * @see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
     * @param data Buffer of image data
     * @param config TesseractOptions object
     */
    static recognizePipe(data: Buffer, config?: TesseractOptions): Promise<string>;
    /**
     * Launch Tesseract to read an image file.
     * @see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
     * @param filename The image file to read
     * @param config TesseractOptions object
     */
    static recognizeFile(filename: string, config?: TesseractOptions): Promise<unknown>;
    /**
     * @ignore
     */
    private static getSpawnOpts;
    /**
     * @ignore
     */
    private static getExecOptions;
}
