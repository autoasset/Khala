import { KLJSON } from "./KLJSON"

export = class Report {

    mode: 'json' | 'human' = 'json'
    path: string = ""

    static init(json: KLJSON): Report | undefined {
        const path = json.stringValue("path")
        if (path === "") {
            return undefined
        }

        const model = new Report(path)

        if (json.stringValue('mode') == 'human') {
            model.mode = 'human'
        }

        return model
    }

    private constructor(path: string) {
        this.path = path
    }

}