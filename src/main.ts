import iconCoverter from './IconCoverter'
import svgCoverter from "./SVGCoverter"

(async () => {
    try {
        await iconCoverter.run(async (file, name) => {
           await svgCoverter.run(svgCoverter, file, name)
        });
        await svgCoverter.finish(svgCoverter)
    } catch (error) {
       console.log(error)
    }
})();