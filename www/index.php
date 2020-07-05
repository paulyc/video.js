<?php
$playfile = null;
$video = null;
$audio = null;
$mimetype = null;
if (isset($_GET['file'])) {
	$file = $_GET['file'];
	$pathparts = pathinfo($file);
	switch ($pathparts['extension']) {
	case 'mp4':
		$playfile = $file;
		$mimetype = 'video/mp4';
		break;
	case 'webm':
		$playfile = $file;
		$mimetype = 'video/webm';
		break;
	case 'flac':
		$playfile = $file;
		$mimetype = 'audio/flac';
		break;
	case 'mp3':
		$playfile = $file;
		$mimetype = 'audio/mp3';
		break;
	case 'aac':
	case 'm4a':
		$playfile = $file;
		$mimetype = 'audio/mp4';
		break;
	case 'ogg':
		$playfile = $file;
		$mimetype = 'audio/ogg';
		break;
	default:
		$playfile = $file;
		$mimetype = 'video/mp4'; // ?? best guess ??
		break;
	}
}

function scan_files($path = '.') {
	$media = [];
	$files = scandir($path);
	foreach ($files as &$fname) {
		if ($fname === '.' || $fname === '..') {
			continue;
		}
		$filepath = $path === '.' ? $fname : $path . '/' . $fname;
		if (is_dir($filepath)) {
			$media = array_merge($media, scan_files($filepath));
		} else if (is_file($filepath)) {
			$pathparts = pathinfo($filepath);
			if (
				$pathparts['extension'] === 'mp4' || 
				$pathparts['extension'] === 'ogg' || 
				$pathparts['extension'] === 'webm' ||
				$pathparts['extension'] === 'flac' ||
				$pathparts['extension'] === 'mp3' ||
				$pathparts['extension'] === 'aac' ||
				$pathparts['extension'] === 'm4a'
			) {
				$media[] = $filepath;
			}
		}
	}
	return $media;
}

$all_media = scan_files();
?>

<!DOCTYPE html>
<html>
<head>
  <link href="https://vjs.zencdn.net/7.8.3/video-js.css" rel="stylesheet" />

  <!-- If you'd like to support IE8 (for Video.js versions prior to v7) -->
  <script type="text/javascript" src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>
  <script type="text/javascript" src="paulyflix.js"></script>
</head>

<body>
<?php
if ($mimetype !== null) { ?>
  <video
    id="my-video"
    class="video-js"
    controls
    autoplay
    preload="auto"
    width="640"
    height="264"
    data-setup="{liveui:true}"
  >
  <source src="<?php echo($playfile); ?>" type="<?php echo($mimetype); ?>" />
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank"
        >supports HTML5 video</a
      >
    </p>
  </video>

<?php } ?>

<script src="https://vjs.zencdn.net/7.8.3/video.js"></script>

<?php
foreach ($all_media as &$f) {
	$pathparts = pathinfo($f);
	echo('<a href="/index.php?file=' . urlencode($f) . '">' . $pathparts['basename'] . '</a><br/>' . "\n");
}

?>

</body>
</html>
