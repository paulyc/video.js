var player = videojs('my-video');
player.ready(function() {
    return player.play()
        .then(r=>console.log('play fired'))
        .catch(ex=>console.err(`play ex ${ex} ${ex.toString}`);
	//.finally(r=>console.log('play finally'));
~ });
