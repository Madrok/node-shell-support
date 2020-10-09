**[Node Shell Support Library - v1.0.0](../README.md)**

> [Globals](../globals.md) / ["TesseractShell"](../modules/_tesseractshell_.md) / TesseractOptions

# Interface: TesseractOptions

## Hierarchy

* **TesseractOptions**

## Index

### Properties

* [binary](_tesseractshell_.tesseractoptions.md#binary)
* [debug](_tesseractshell_.tesseractoptions.md#debug)
* [presets](_tesseractshell_.tesseractoptions.md#presets)

## Properties

### binary

• `Optional` **binary**: string

*Defined in [TesseractShell.ts:38](https://github.com/Madrok/node-shell-support/blob/6f684a9/src/TesseractShell.ts#L38)*

the path to tesseract binary, if needed

___

### debug

• `Optional` **debug**: boolean

*Defined in [TesseractShell.ts:36](https://github.com/Madrok/node-shell-support/blob/6f684a9/src/TesseractShell.ts#L36)*

Will log the command line to console.debug

___

### presets

• `Optional` **presets**: Array\<string>

*Defined in [TesseractShell.ts:43](https://github.com/Madrok/node-shell-support/blob/6f684a9/src/TesseractShell.ts#L43)*

Additional configfiles to add to the command line.

**`see`** [Tesseract man page](https://github.com/tesseract-ocr/tesseract/blob/master/doc/tesseract.1.asc)
