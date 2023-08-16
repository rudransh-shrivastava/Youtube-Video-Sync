document.addEventListener("DOMContentLoaded", function() {
    const youtubeForm = document.getElementById("youtubeForm");
    const youtubeUrlInput = document.getElementById("youtubeUrl");
    const playerContainer = document.getElementById("playerContainer");
    let player;

    youtubeForm.addEventListener("submit", function(event) {
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
    playButton.addEventListener('click', function(event) {
        console.log("play");
        event.preventDefault();
        player.playVideo();   
    });
    // Pause button
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', function(event) {
        console.log("pause");
        event.preventDefault();
        player.pauseVideo();
    });
    // Progress bar and seeking
    const progressBar = document.getElementById('progressBar');

    // Update progress bar as the video plays
    player.addEventListener('onStateChange', function(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        setInterval(function() {
            console.log("playing");
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = `${progress}%`;
        }, 1000); // Update every second
    }
    });

    function extractVideoId(url) {
    // Extract the video ID from the YouTube URL
    // You can use regular expressions or other methods to extract the ID
    // URL format: https://www.youtube.com/watch?v=VIDEO_ID
        const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|\/v\/|https:\/\/youtu.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }
    function loadYouTubeVideo(videoId) {
        playerContainer.innerHTML = ""; // Clear any previous content
        player = new YT.Player("playerContainer", {
            height: "315",
            width: "560",
            videoId: videoId,
            // events: {
            //     onReady: onPlayerReady,
            // },
        });
    }
    function onPlayerReady(event) {
    event.target.playVideo();
    }
});
