
class FilePath {

    static filename(name: string, extension: string): string {
        const index = name.indexOf('.')
        var list: string[] = []
        if (index == -1) {
            list = [name, extension]
        } else {
            list = [name.substring(0, index), extension]
        }
        return list.filter(item => item).join(".")
    }
    
    static path(folder: string, filename: string): string {
        var paths = folder.split('/')
        paths.push(filename)
        return paths.join('/')
    }

}



export = FilePath