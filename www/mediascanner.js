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

async function parse_paths(root) {
    const indexed = [];
    const by_hash = {};
    for await (const p of walk(root)) {
 //       if (p.startsWith('./')) {
   //         p = p.substr(2);
     //   }
        const {dir, root, base, name, ext} = path.parse(p);
      if (formats.hasOwnProperty(ext.substr(1))) {
	    const mimetype = formats[ext.substr(1)];
            const h = crypto.createHash('shake256').update(p);
            h.update(base);
            const basehash = h.digest('hex');
            const file = {p, dir, root, base, name, ext, basehash, mimetype};
	    indexed.push(file);
	    by_hash[basehash] = file;
            process.stdout.write(`<a id="${basehash}" href="/index.php?file=${encodeURIComponent(p)}&mimetype=${encodeURIComponent(mimetype)}&hash=${basehash}">${base}</a><br/>\n`);
        }
    }
    
    return {indexed, by_hash};
}

parse_paths(rootdir)
.then(res => console.error(JSON.stringify(res, null, '  ')))
.catch(e => console.error(e, 'error'))
.finally(() => console.log('\n'));

