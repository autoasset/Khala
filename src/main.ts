import IconCoverter from './IconCoverter'
import SVGCoverter from "./SVGCoverter"
import SVG2FontConverter from "./SVG2FontConverter"
import ProductsCoverter from './ProductsCoverter';
import config from "./config";
import FilePath from "./FilePath"
import svg2ttf from "svg2ttf"
import fs from "fs/promises"

class Asset {

    name: string
    file: string

    constructor(name: string, file: string) {
        this.name = name
        this.file = file
    }

}

const svgCoverter = new SVGCoverter();
const svg2FontConverter = new SVG2FontConverter();

var svgs: Asset[] = [];

(async () => {
    try {
        await IconCoverter.run(async (file, name) => {
            svgs.push(new Asset(name, file))
           await svgCoverter.run(file, name)
        });

        /// svg to svgfont
        for (const item of config.outputs.svg2fonts) {
            await svg2FontConverter.createStreams(item.fontname, item.svgfont)
            for (const file of svgs) {
                await svg2FontConverter.add(file.file, file.name)
            }
            svg2FontConverter.end()

            const svgfont = await fs.readFile(item.svgfont)
            const ttf = svg2ttf(svgfont.toString(),{})
            FilePath.write(item.ttf, ttf.buffer)
        }

        await ProductsCoverter.run()
    } catch (error) {
       console.log(error)
    }
})();