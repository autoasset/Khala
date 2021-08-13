import config from "./config";
import * as fs from "fs/promises";
import sharp from 'sharp';
import FilePath from "./FilePath";

class IconCoverter {

    async run(svgCoverter: (file: string, filename: string) => void) {
        const outputs = config.outputs
        const inputs = config.inputs

        for (const folder of outputs.allPaths.filter(item => item)) {
            await fs.rmdir(folder, { recursive: true })
            await fs.mkdir(folder, { recursive: true })
        }

        for (const input of inputs) {
            for (const file of await fs.readdir(input)) {
                if (file.startsWith('.')) {
                    continue
                }
                const path = FilePath.path(input, file);
                const metadata = await sharp(path).metadata()
                if (metadata.width == undefined) {
                    continue
                }
                if (metadata.format == 'gif') {
                    await sharp(path)
                        .resize(Math.round(metadata.width * 0.6))
                        .toFile(FilePath.path(outputs.gif2x, file))
                    fs.copyFile(path, FilePath.path(outputs.gif3x, file))
                } else if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
                    await sharp(path)
                        .resize(Math.round(metadata.width * 0.6))
                        .toFile(FilePath.path(outputs.icon2x, file))
                    fs.copyFile(path, FilePath.path(outputs.icon3x, file))
                } else if (metadata.format == 'svg') {
                    fs.copyFile(path, FilePath.path(outputs.svg, file))
                    await svgCoverter(path, file)
                } else {
                    fs.copyFile(path, FilePath.path(outputs.other, file))
                }
            }
        }

    }

}

export = new IconCoverter();