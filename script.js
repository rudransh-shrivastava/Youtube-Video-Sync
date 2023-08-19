document.addEventListener("DOMContentLoaded", function () {
    const youtubeForm = document.getElementById("youtubeForm");
    const youtubeUrlInput = document.getElementById("youtubeUrl");
    const playerContainer = document.getElementById("playerContainer");
    let player;
    let playerInterval;
    const formContainer = document.getElementById('formContainer');
    const videoTitle = "Youtube Video";

    youtubeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const youtubeUrl = youtubeUrlInput.value;
        const playerItems = document.getElementsByClassName('player-items');
        if (youtubeUrl) {
            const videoId = extractVideoId(youtubeUrl);
            if (videoId) {
                document.getElementById('title').style.display = "block";
                formContainer.style.display = "none";
                loadYouTubeVideo(videoId);
                // set title
                document.getElementById('title').innerText = videoTitle;

                // make the controls visible
                for (i = 0; i < playerItems.length; i++) {
                    playerItems[i].style.display = "inline";
                }
                document.getElementById('progressBar').style.display = 'block';
            }
        }
    });
    // Play button
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function (event) {
        event.preventDefault();
        player.playVideo();
    });
    // Pause button
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', function (event) {
        event.preventDefault();
        player.pauseVideo();
    });


    function extractVideoId(url) {
        // Extract the video ID from the YouTube URL
        // You can use regular expressions or other methods to extract the ID
        // URL format: https://www.youtube.com/watch?v=VIDEO_ID
        const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|\/v\/|https:\/\/youtu.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }
    // Progress bar and seeking
    const progressBar = document.getElementById('progressBar');

    function loadYouTubeVideo(videoId) {
        playerContainer.innerHTML = ""; // Clear any previous content
        player = new YT.Player("playerContainer", {
            height: "315",
            width: "560",
            videoId: videoId,
            events: {
                onStateChange: onStateChange,
            },
            playerVars: {
                'controls': 0,
                'rel': 0,
                'disablekb': 1,
                'origin': 1,
            },
        });
    }
    // update the progress bar
    function onStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            const interval = setInterval(function () {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${progress}%`;
            }, 250);

            // Store the interval ID so you can clear it later
            playerInterval = interval;
        } else {
            // Clear the interval when the video is paused or ended
            clearInterval(playerInterval);
        }
    }
    const progressContainer = document.getElementById('progressContainer');
    // makes the progress bar clickkable
    progressContainer.addEventListener('click', function (event) {
        const progressBar = document.getElementById('progressBar');
        const progressContainer = document.getElementById('progressContainer');
        const offsetX = event.offsetX; // x off set from the left
        const totalBarWidth = progressContainer.offsetWidth; // total width of the bar
        const duration = player.getDuration(); // total time of the video in sec
        const progressPercent = offsetX / totalBarWidth * 100; // percent progress
        const seekTime = duration * progressPercent / 100;

        player.seekTo(seekTime, true);
    });

});
