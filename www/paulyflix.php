<?php
$playhash = isset($_GET['hash']) ? $_GET['hash'] : '';
$playfile = isset($_GET['file']) ? $_GET['file'] : null;
$mimetype = isset($_GET['mimetype']) ? $_GET['mimetype'] : null;
?>

<!DOCTYPE html>
<html>
<head>
  <!--link href="https://vjs.zencdn.net/7.8.3/video-js.css" rel="stylesheet" /-->
  <link href="/video-js.min.css" rel="stylesheet"></link>

  <!-- If you'd like to support IE8 (for Video.js versions prior to v7) -->
  <!--script type="text/javascript" src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script-->
  <!--script type="text/javascript" src="/videojs.min.js"></script-->
  <script type="text/javascript" async src="/files.js"></script>
  <script type="text/javascript">
    const player = videojs('my-video');
    player.ready(function() {
      return player.play();
    });

<?php
if ($playhash) {
?>
    player.on('ended', function() {
      //player.src({type: 'video/mp4', src: 'http://www.example.com/path/to/video.mp4'});
	    const next = FileMgr.getNextAfterHash('<?php echo($playhash); ?>');
	    if (next !== null) {
		    player.src({type: next.mimetype, src: encodeURIComponent(p)});
	    }
	}
    });
<?php
}
?>
  </script>
</head>

<body>
  <video
    id="my-video"
    class="video-js"
    controls
    autoplay
    preload="auto"
    width="640"
    data-setup="{}"
  >
<?php if ($playfile !== null) { ?>
    <source
      src="<?php echo($playfile); ?>"
<?php if ($mimetype !== null) { ?>
      type="<?php echo($mimetype); ?>"
<?php } ?>
    >
<?php } ?>
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank"
        >supports HTML5 video</a
      >
    </p>
  </video>

<!--script src="https://vjs.zencdn.net/7.8.3/video.js"></script-->
<script src="/video.min.js"></script>

<?php
	require_once('urlcache');
?>

</body>
</html>
