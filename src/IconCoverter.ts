import config from "./config";
import * as fs from "fs/promises";
import sharp from 'sharp';

class IconCoverter {

    filePath(folder: string, filename: string): string {
        var paths = folder.split('/')
        paths.push(filename)
        return paths.join('/')
    }

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
                const path = this.filePath(input, file);
                const metadata = await sharp(path).metadata()
                if (metadata.width == undefined) {
                    continue
                }
                if (metadata.format == 'gif') {
                    await sharp(path)
                        .resize(Math.round(metadata.width * 0.6))
                        .toFile(this.filePath(outputs.gif2x, file))
                    fs.copyFile(path, this.filePath(outputs.gif3x, file))
                } else if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
                    await sharp(path)
                        .resize(Math.round(metadata.width * 0.6))
                        .toFile(this.filePath(outputs.icon2x, file))
                    fs.copyFile(path, this.filePath(outputs.icon3x, file))
                } else if (metadata.format == 'svg') {
                    fs.copyFile(path, this.filePath(outputs.svg, file))
                    await svgCoverter(path, file)
                } else {
                    fs.copyFile(path, this.filePath(outputs.other, file))
                }
            }
        }

    }

}

export = new IconCoverter();