**[Node Shell Support Library - v1.0.0](../README.md)**

> [Globals](../globals.md) / ["TesseractShell"](../modules/_tesseractshell_.md) / TesseractShell

# Class: TesseractShell

## Hierarchy

* **TesseractShell**

## Index

### Methods

* [recognizeFile](_tesseractshell_.tesseractshell.md#recognizefile)
* [recognizePipe](_tesseractshell_.tesseractshell.md#recognizepipe)

## Methods

### recognizeFile

▸ `Static`**recognizeFile**(`filename`: string, `config`: [TesseractOptions](../interfaces/_tesseractshell_.tesseractoptions.md)): Promise\<unknown>

*Defined in [TesseractShell.ts:105](https://github.com/Madrok/node-shell-support/blob/e645dcf/src/TesseractShell.ts#L105)*

Launch Tesseract to read an image file.

**`see`** https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`filename` | string | - | The image file to read |
`config` | [TesseractOptions](../interfaces/_tesseractshell_.tesseractoptions.md) | {} | TesseractOptions object  |

**Returns:** Promise\<unknown>

___

### recognizePipe

▸ `Static`**recognizePipe**(`data`: Buffer, `config`: [TesseractOptions](../interfaces/_tesseractshell_.tesseractoptions.md)): Promise\<string>

*Defined in [TesseractShell.ts:54](https://github.com/Madrok/node-shell-support/blob/e645dcf/src/TesseractShell.ts#L54)*

Launches tesseract and pipe a javascript buffer containing image data to it.

**`see`** https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Buffer | - | Buffer of image data |
`config` | [TesseractOptions](../interfaces/_tesseractshell_.tesseractoptions.md) | {} | TesseractOptions object  |

**Returns:** Promise\<string>
