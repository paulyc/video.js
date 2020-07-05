#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootdir = process.argv.length === 3 ? process.argv[2] : '.';

const formats = {
    mp4:'video/mp4', webm:'video/webm',
    flac:'audio/flac', mp3: 'audio/mp3', aac: 'audio/aac', m4a: 'audio/aac',
};

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
	const stat = fs.statSync(entry);
        if (stat.isDirectory()) yield* walk(entry);
        else if (stat.isFile()) yield entry;
    }
}

function insensitiveStringSorter(a,b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	} else {
		return 0;
	}
}

async function parse_paths(root) {
    const indexed = [];
    const by_hash = {};
    for await (const p of walk(root)) {
        const {dir, root, base, name, ext} = path.parse(p);
        if (formats.hasOwnProperty(ext.substr(1))) {
            // should be playable
	    const mimetype = formats[ext.substr(1)];
            const h = crypto.createHash('shake256').update(p);
            h.update(base);
            const basehash = h.digest('hex');
            const file = {p, dir, root, base, name, ext, basehash, mimetype};
	    indexed.push(file);
	    by_hash[basehash] = file;
        }
    }
    indexed.sort((a,b) => insensitiveStringSorter(a.p, b.p));
    indexed.forEach(f => process.stdout.write(`<a id="${f.basehash}" href="/index.php?file=${f.p}&mimetype=${f.mimetype}&hash=${f.basehash}">${f.base}</a><br/>\n`));
    
    return {indexed, by_hash};
}

parse_paths(rootdir)
.then(res => console.error(`const files = ${JSON.stringify(res, null, '  ')};`))
.catch(e => console.error(e, 'error'))
.finally(() => console.log('\n'));

