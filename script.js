document.addEventListener("DOMContentLoaded", function () {
    const youtubeForm = document.getElementById("youtubeForm");
    const youtubeUrlInput = document.getElementById("youtubeUrl");
    const playerContainer = document.getElementById("playerContainer");
    let player;
    let playerInterval;

    youtubeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const youtubeUrl = youtubeUrlInput.value;
        if (youtubeUrl) {
            const videoId = extractVideoId(youtubeUrl);
            if (videoId) {
                // Remove the form
                youtubeForm.style.display = "none";

                // Load the YouTube video
                loadYouTubeVideo(videoId);
            }
        }
    });
    // Play button
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function (event) {
        console.log("play");
        event.preventDefault();
        player.playVideo();
    });
    // Pause button
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', function (event) {
        console.log("pause");
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
        });
    }

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

    progressContainer.addEventListener('click', function (event) {
        const progressBar = document.getElementById('progressBar');
        const progressContainer = document.getElementById('progressContainer');
        const progressBarWidth = progressBar.offsetWidth; // current progress
        const offsetX = event.offsetX; // x off set from the left
        const totalBarWidth = progressContainer.offsetWidth; // total width of the bar
        const duration = player.getDuration(); // total time of the video in sec
        const progressPercent = offsetX / totalBarWidth * 100; // percent progress
        const seekTime = duration * progressPercent / 100;

        player.seekTo(seekTime, true);
    });

});
