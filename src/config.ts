import * as config from "./config.json";
import path from "path";
import fs from "fs";

function filePath(value: string): string {
    value = value.trim()
    if (!value) {
        return value
    } else {
        return path.resolve(value)
    }
}

function paseArray<T>(json: any, map: (item: any) => T): T[] {
    var list: T[] = []
    if (Array.isArray(json)) {
        for (const item of json) {
            list.push(map(item))
        }
    }
    return list
}

class AndroidProductsBuildSettings {

    copy_2x_inputs: string[]
    copy_3x_inputs: string[]

    constructor(json: any) {
        this.copy_2x_inputs = paseArray(json['copy_2x_inputs'], filePath)
        this.copy_3x_inputs = paseArray(json['copy_3x_inputs'], filePath)
    }

}

class AndroidProducts {

    build_settings: AndroidProductsBuildSettings
    vector_template: string
    x2: string
    x3: string

    constructor(json: any) {
        this.vector_template = filePath(json['vector_template'])
        this.x2 = filePath(json['x2'])
        this.x3 = filePath(json['x3'])
        this.build_settings = new AndroidProductsBuildSettings(json['build_settings'])
    }

}

class FontOutput {

    fontname: string
    path: string

    constructor(fontname: string, path: string) {
     this.fontname = fontname
     this.path = path   
    }

}

class IOSProduct {

    vector_template: string
    icon: string
    gif: string
    fonts: FontOutput[]

    constructor(json: any) {
        this.vector_template = filePath(json["vector_template"])
        this.icon = filePath(json["icon"])
        this.gif = filePath(json["gif"])
        this.fonts = (json["fonts"] as any[]).map((item) => new FontOutput(item["fontname"], filePath(item["path"])))
    }

}

class FlutterProduct {

    fonts: FontOutput[]

    constructor(json: any) {
        this.fonts = (json["fonts"] as any[]).map((item) => new FontOutput(item["fontname"], filePath(item["path"])))
    }

}

class Products {

    ios: IOSProduct
    android: AndroidProducts
    flutter: FlutterProduct

    constructor(json: any) {
        this.ios = new IOSProduct(json["ios"])
        this.android = new AndroidProducts(json["android"])
        this.flutter = new FlutterProduct(json["flutter"])
    }

}

class SVG2Font {

    fontname: string
    svgfont: string
    ttf: string

    constructor(json: any) {
        this.fontname = json["fontname"]
        this.svgfont = filePath(json["svgfont"])
        this.ttf = filePath(json["ttf"])
    }

}

class Outputs {

    gif2x: string
    gif3x: string
    icon2x: string
    icon3x: string
    other: string
    pdf: string
    svg: string
    svg2pdf: string
    svg2xml: string

    svg2fonts: SVG2Font[]

    allPaths: string[]

    constructor(json: any) {
        this.gif2x = filePath(json["gif2x"])
        this.gif3x = filePath(json["gif3x"])
        this.icon2x = filePath(json["icon2x"])
        this.icon3x = filePath(json["icon3x"])
        this.other = filePath(json["other"])
        this.pdf = filePath(json["pdf"])
        this.svg = filePath(json["svg"])
        this.svg2pdf = filePath(json["svg2pdf"])
        this.svg2xml = filePath(json["svg2xml"])
        this.svg2fonts = paseArray(json['svg2fonts'], (item) => {
            return new SVG2Font(item)
        })

        var paths: string[] = []
        paths.concat(this.svg2fonts.map((item) => item.svgfont))
        paths.concat(this.svg2fonts.map((item) => item.ttf))
        paths.concat([this.gif2x, this.gif3x,
        this.icon2x, this.icon3x,
        this.other, this.pdf,
        this.svg, this.svg2pdf, this.svg2xml])
        this.allPaths = paths
    }

}

class IconConfig {

    inputs: string[]
    exclude: string[]
    outputs: Outputs
    products: Products

    constructor() {
        const file = fs.readFileSync(process.cwd() + '/lib/config.json').toString()
        const json = JSON.parse(file)

        this.outputs = new Outputs(json["outputs"])
        this.products = new Products(json["products"])
        this.exclude = paseArray(json['exclude'], filePath)
        this.inputs = paseArray(json['inputs'], filePath)
    }

}

export = new IconConfig()