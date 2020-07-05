#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootdir = process.argv.length === 3 ? process.argv[2] : '.';

const formats = {
    mp4:'video/mp4', webm:'video/webm',
    flac:'audio/flac', mp3: 'audio/mp3', aac: 'audio/aac', m4a: 'audio/aac',
};

function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

async function parse_paths(root) {
    const files = {
	indexed: [],
	by_hash: {},
    };
    for await (const p of walk(root)) {
        if (p.startsWith('./')) {
            p = p.substr(2);
        }
        const {dir, root, base, name, ext} = path.parse(p);
        if (formats.hasOwnProperty(ext)) {
            const h = crypto.createHash('chacha20').update(p);
            h.update(base);
            const basehash = h.digest('hex');
            const file = {p, dir, root, base, name, ext, basehash};
	    files.indexed.push(file);
	    files.by_hash[basehash] = file;
            process.stdout.write(`<a id="${basehash}" href="/index.php?file=${p}">${base}</a>\n`);
        }
    }
}

function write_parsed_paths(strm, paths) {
    for (const {basehash, p, base} of paths) {
        strm.write(`<a id="${basehash}" href="/index.php?file=${encodeURIComponent(p)}">${base}</a>\n`);
    }
}
const files = await parse_paths(rootdir);
write_parsed_paths(process.stdout, files.indexed);
/*
main(rootdir)
.then(r => console.log(r, 'ok'))
.catch(e => console.error(e, 'error'))
.finally(() => console.log('bye'));
*/
var player = videojs('my-video');
player.ready(function() {
  var promise = player.play().then().finally();
});
