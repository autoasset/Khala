import CoverterOutputType from "./CoverterOutputType"
import { KLJSON } from "./KLJSON"

export = class CoverterOutput {
    /// 输出类型选项
    type: CoverterOutputType
    path: string

    /// [iconfont] family 名
    iconfont_family_name: string
    /// [iconfont] font 名
    iconfont_font_name: string

    /// [icon] 缩放倍率
    icon_scale: number
    /// [icon] 文件后缀
    icon_suffix: string

    constructor(json: KLJSON) {
        this.type = CoverterOutputType.init(json.stringValue("type"))
        this.path = json.stringValue("path")

        this.icon_scale = json.numberValue("icon_scale", 3)
        this.icon_suffix = json.stringValue("icon_suffix")

        this.iconfont_family_name = json.stringValue("iconfont_family_name", "iconfont")
        this.iconfont_font_name = json.stringValue("iconfont_font_name", "iconfont")
    }
}