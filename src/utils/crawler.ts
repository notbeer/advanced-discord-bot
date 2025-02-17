import fs from 'fs';
import path from 'path';

/**
 * Find every file in a directory
 * @param {string} dir
 */
function* crawlDir(dir: string, type: string): any {
    if(!fs.existsSync(dir)) throw new Error(`Cannot find directory ${dir}`);
    for(const content of fs.readdirSync(dir, { withFileTypes: true })) {
        content.isDirectory() ? 
        yield* crawlDir(path.join(dir, content.name), type) :
            content.name.endsWith(type) ?
            yield path.join(dir, content.name) :
            null;
    };
};
/**
 * Find every file in a folder
 * @param {string} dir
 * @returns {Array<string>}
 */
function crawlFolder(dir: string, type?: string): Array<string> {
    if(!fs.existsSync(dir)) throw new Error(`Cannot find directory ${dir}`);
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(content => !content.isDirectory() && (type && content.name.endsWith(type)))
        .map(content => path.join(dir, content.name));
};

export { crawlDir, crawlFolder };