import * as config from "./config.json";
import path from "path";

class Products {

    ios: { vector_template: string, icon: string, gif: string }
    android: { vector_template: string, x2: string, x3: string }
    flutter: { iconfont: string }

    constructor() {
        const filePath = (value: string): string => {
            value = value.trim()
            if (!value) {
                return value
            } else {
                return path.resolve(value)
            }
        }

        this.ios = {
            vector_template: filePath(config.products.ios.vector_template),
            icon: filePath(config.products.ios.icon),
            gif: filePath(config.products.ios.gif),
        }

        this.android = {
            vector_template: filePath(config.products.android.vector_template),
            x2: filePath(config.products.android.x2),
            x3: filePath(config.products.android.x3),
        }

        this.flutter = {
            iconfont: filePath(config.products.flutter.iconfont)
        }
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
    svg2iconfont: string
    allPaths: string[]

    constructor() {

        const filePath = (value: string): string => {
            value = value.trim()
            if (!value) {
                return value
            } else {
                return path.resolve(value)
            }
        }

        this.gif2x = filePath(config.outputs.gif2x)
        this.gif3x = filePath(config.outputs.gif3x)
        this.icon2x = filePath(config.outputs.icon2x)
        this.icon3x = filePath(config.outputs.icon3x)
        this.other = filePath(config.outputs.other)
        this.pdf = filePath(config.outputs.pdf)
        this.svg = filePath(config.outputs.svg)
        this.svg2pdf = filePath(config.outputs.svg2pdf)
        this.svg2xml = filePath(config.outputs.svg2xml)
        this.svg2iconfont = filePath(config.outputs.svg2iconfont)

        this.allPaths = [this.gif2x,
        this.gif3x,
        this.icon2x,
        this.icon3x,
        this.other,
        this.pdf,
        this.svg,
        this.svg2pdf,
        this.svg2xml,
        this.svg2iconfont,
        ]
    }

}

class IconConfig {

    inputs: string[]
    exclude: string[]
    outputs: Outputs
    products: Products

    constructor() {
        this.inputs = config.inputs.map((item) => path.resolve(item))
        this.exclude = config.exclude.map((item) => path.resolve(item))
        this.outputs = new Outputs()
        this.products = new Products()
    }

}

export = new IconConfig()