
const player = videojs('my-video');

const playhash = document.getElementById('playhash').getAttribute('value');
if (files.by_hash.hasOwnProperty(playhash)) {
	const file = files.by_hash[playhash];
	player.src(file.p);
};

player.ready(function() {
    return player.play();
});
