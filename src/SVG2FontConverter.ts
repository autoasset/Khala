import SVGIcons2SVGFontStream from 'svgicons2svgfont'
import fs, { PathLike, ReadStream } from 'fs'
import FilePath from "./FilePath";

type SVGIconStream = fs.ReadStream & {
    metadata: {
      name: string,
      unicode: string[]
    }
  }

class SVG2FontConverter {

    offset: number = 1;
    streams: SVGIcons2SVGFontStream[] = [];

    add(file: string, name: string) {
        this.offset += 1;
        const unicode = String.fromCharCode(0xe000 + this.offset)
        const glyph = fs.createReadStream(file, { encoding: 'utf-8' }) as SVGIconStream
        glyph.metadata = {
            unicode: [unicode],
            name: name,
        }
        for (const stream of this.streams) {
            stream.write(glyph);
        }
    }

    async createStreams(fontname: string, path: string): Promise<void> {
        const stream = new SVGIcons2SVGFontStream({
            fontName: fontname,
            fontHeight: 1000,
            normalize: true
        })
        FilePath.mkParentDir(path)
        stream
            .pipe(fs.createWriteStream(path))
            .on('finish', function () {
                return Promise.resolve()
            })
            .on('error', function (err) {
                return Promise.reject(err)
            });
        this.streams.push(stream)
    }

    async end(): Promise<void> {
        for (const stream of this.streams) {
            stream.end();
        }
    }

}

export = SVG2FontConverter