import TwingCache from "../cache";

let fs = require('fs-extra');
let path = require('path');
let hashJs = require('hash.js');
let tmp = require('tmp');

/**
 * Implements a cache on the filesystem.
 *
 * @author Andrew Tch <andrew@noop.lv>
 */
export class TwingCacheFilesystem extends TwingCache {
    readonly FORCE_BYTECODE_INVALIDATION = 1;

    private directory: string;
    private options: number;

    /**
     * @param directory {string} The root cache directory
     * @param options {number} A set of options
     */
    constructor(directory: string, options: number = 0) {
        super();

        this.directory = directory;
        this.options = options;
    }

    generateKey(name: string, className: string) {
        let hash: string = hashJs.sha256().update(className).digest('hex');

        return path.join(
            this.directory,
            hash[0] + hash[1],
            hash + '.js'
        );
    }

    load(key: string): any {
        let modulePath: string = path.resolve(key);

        if (fs.pathExistsSync(modulePath)) {
            return require(modulePath);
        }

        return null;
    }

    write(key: string, content: string) {
        let dir = path.dirname(key);

        fs.ensureDirSync(dir);

        let tmpFile = tmp.tmpNameSync({
            dir: dir,
            postfix: path.extname(key, '.js')
        });

        try {
            fs.writeFileSync(tmpFile, content);
            fs.renameSync(tmpFile, key);

            return;
        }
        catch (e) {
            throw new Error(`Failed to write cache file "${key}".`);
        }
    }

    getTimestamp(key: string) {
        if (!fs.pathExistsSync(key)) {
            return 0;
        }

        let stat = fs.statSync(key);

        return stat.mtimeMs;
    }
}

export default TwingCacheFilesystem;