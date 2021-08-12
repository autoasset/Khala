import * as config from "./config.json";
import path from "path";

class IconOutputs {

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

    constructor(gif2x: string,
        gif3x: string,
        icon2x: string,
        icon3x: string,
        other: string,
        pdf: string,
        svg: string,
        svg2pdf: string,
        svg2xml: string,
        svg2iconfont: string) {

        const filePath = (value: string): string => {
            value = value.trim()

            if (!value) {
                return value
            } else {
                return path.resolve(value)
            }
        }

        this.gif2x = filePath(gif2x)
        this.gif3x = filePath(gif3x)
        this.icon2x = filePath(icon2x)
        this.icon3x = filePath(icon3x)
        this.other = filePath(other)
        this.pdf = filePath(pdf)
        this.svg = filePath(svg)
        this.svg2pdf = filePath(svg2pdf)
        this.svg2xml = filePath(svg2xml)
        this.svg2iconfont = filePath(svg2iconfont)

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
    outputs: IconOutputs

    constructor(inputs: string[], outputs: IconOutputs) {
        this.inputs = inputs
        this.outputs = outputs
    }

}

const iconOutputs = new IconOutputs(
    config.outputs.gif2x,
    config.outputs.gif3x,
    config.outputs.icon2x,
    config.outputs.icon3x,
    config.outputs.other,
    config.outputs.pdf,
    config.outputs.svg,
    config.outputs.svg2pdf,
    config.outputs.svg2xml,
    config.outputs.svg2iconfont,
    )

export = new IconConfig(config.inputs, iconOutputs)