import config from "./config";
import * as fs from "fs/promises";
import svg2vectordrawable from "svg2vectordrawable";
import FilePath from "./FilePath"

class Glyphs {
    name: string
    font_class: string
    unicode_value: string
    unicode: string

    constructor(name: string, font_class: string, unicode_value: string, unicode: string) {
        this.name = name
        this.font_class = font_class
        this.unicode = unicode
        this.unicode_value = unicode_value
    }
}

class SVGCoverter {

    iconfont: any = (() => {
        var font = require('font-carrier').create();
        const ttfOptions = font.getFontface().options;
        ttfOptions.fontFamily = 'iconfont';
        font.setFontface(ttfOptions);
        return font;
    })()

    glyphs: Glyphs[] = []

    async vectordrawable(coverter: SVGCoverter, file: string, name: string, data: Buffer) {

        const options = {
            floatPrecision: 3, // 数值精度，默认为 2
            fillBlack: true, // 为无填充变成填充黑色，默认为 false
            xmlTag: true // 添加 XML 文档声明标签，默认为 false
        }

        const xml = await svg2vectordrawable(data.toString(), options)
        const filename = FilePath.filename(name, 'xml')
        const path = FilePath.path(config.outputs.svg2xml, filename)
        await fs.writeFile(path, xml)
    }

    async run(coverter: SVGCoverter, file: string, name: string) {
        const data = await fs.readFile(file)
        await coverter.pdf(coverter, file, name, data)
        await coverter.vectordrawable(coverter, file, name, data)
        await coverter.iconfontGlyphs(coverter, file, name, data)
    }

    async iconfontGlyphs(coverter: SVGCoverter, file: string, name: string, data: Buffer) {
        const unicode = String.fromCharCode(0xe000 + coverter.glyphs.length)
        const unicodeHex = unicode.charCodeAt(0).toString(16)
        coverter.iconfont.setSvg(unicode, String(data))
        coverter.glyphs.push(new Glyphs(FilePath.filename(name, ""), "iconfont", unicode, unicodeHex))
    }

    async iconfontTTF(coverter: SVGCoverter) {
        const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", ""))
        coverter.iconfont.output({ path: path, types: ['ttf'] })
    }

    async iconfontJSON(coverter: SVGCoverter) {
        const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", "json"))
        await fs.writeFile(path, JSON.stringify({
            font_family: 'iconfont',
            glyphs: coverter.glyphs,
        }, null, 2))
    }

    async iconfontHtml(coverter: SVGCoverter) {
        var html = `<style type="text/css">
        @font-face {
          font-family: 'iconfont';
          src: url('iconfont.eot'); /* IE9 */
          src: url('iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
          url('iconfont.woff') format('woff2'),
          url('iconfont.woff') format('woff'), /* chrome、firefox */
          url('iconfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
          url('iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
        }
      
        .iconfont {
          font-family: "iconfont";
          font-size: 16px;
          font-style: normal;
        }
      </style>`

        for (const glyphs of coverter.glyphs) {
            html = html + '<span class="iconfont">' + glyphs.unicode_value + '</span>'
        }
        const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", "html"))
        await fs.writeFile(path, html)
    }

    async pdf(coverter: SVGCoverter, file: string, name: string, data: Buffer) {
        const path = FilePath.path(config.outputs.svg2pdf, FilePath.filename(name, "pdf"))
        require('shelljs').exec('inkscape ' + file + ' --export-type=pdf --export-filename=' + path)
    }

    async finish(coverter: SVGCoverter) {
       await coverter.iconfontTTF(coverter)
       await coverter.iconfontHtml(coverter)
       await coverter.iconfontJSON(coverter)
    }
}


export = new SVGCoverter();