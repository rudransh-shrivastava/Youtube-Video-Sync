document.addEventListener("DOMContentLoaded", function () {
    const socket = io('ws://localhost:8080');
    const formContainer = document.getElementById('form-container');
    const youtubeForm = document.getElementById("youtube-form");
    const youtubeUrlInput = document.getElementById("youtube-url");
    const playerContainer = document.getElementById("player-container");
    // const videoTitle = "Youtube Video Title Comes Here";
    const playPauseButton = document.getElementById('play-pause-button');
    const progressBar = document.getElementById('progress-bar');
    let player;
    let playerInterval;
    let isPlaying;

    youtubeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const youtubeUrl = youtubeUrlInput.value;
        const playerItems = document.getElementsByClassName('player-items');
        if (youtubeUrl) {
            const videoId = extractVideoId(youtubeUrl);
            if (videoId) {
                // document.getElementById('title').style.display = "block";
                formContainer.style.display = "none";
                loadYouTubeVideo(videoId);
                // set title
                // document.getElementById('title').innerText = videoTitle;

                // make the controls visible
                for (i = 0; i < playerItems.length; i++) {
                    playerItems[i].style.display = "inline";
                }
                document.getElementById('progress-bar').style.display = 'block';
            }
        }
    });

    function sendPlay() {
        socket.emit("playingStatus", {
            isPlaying: YT.PlayerState.PLAYING,
        })
    }

    function sendPause() {
        socket.emit("playingStatus", {
            isPlaying: YT.PlayerState.PAUSED,
        })
    }

    playPauseButton.addEventListener('click', function (event) {
        // This is what the play / pause button will do when clicked.
        // This sends a message to the backend to play/pause the video.
        event.preventDefault();

        // 1
        if (isPlaying == YT.PlayerState.PLAYING) {
            sendPause();
        } else {
            sendPlay();
        }
    });

    // 3
    socket.on("playingStatus", text => {
        // Listening for playing status i.e. playing or paused.
        if (text.isPlaying == YT.PlayerState.PAUSED) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    function extractVideoId(url) {
        // Extract the video ID from the YouTube URL
        // We can use regular expressions or other methods to extract the ID
        // URL format: https://www.youtube.com/watch?v=VIDEO_ID
        const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|\/v\/|https:\/\/youtu.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    function loadYouTubeVideo(videoId) {
        // this function loads the youtube video with appropriate player variables, height, and width,  we remove the normal youtube controls, autoplay the video, and disable the keyboard shortcuts.
        playerContainer.innerHTML = ""; // Clear any previous content
        player = new YT.Player("player-container", {
            height: "315",
            width: "560",
            videoId: videoId,
            events: {
                onStateChange: onStateChange,
            },
            playerVars: {
                'controls': 0,
                'rel': 1,
                'disablekb': 1,
                'origin': 1,
                "autoplay": 1,
            },
        });
    }

    function onStateChange(event) {
        /* In this function we are handing everything when the state of the player changes.
        First we change the width of the progress bar according to the duration.
        */
        isPlaying = event.data;
        if (event.data === YT.PlayerState.PLAYING) {
            const interval = setInterval(function () {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${progress}%`;
            }, 250);

            // Store the interval ID so we can clear it later
            playerInterval = interval;
        } else {
            // Clear the interval when the video is paused or ended
            clearInterval(playerInterval);
        }

        /* If the user pauses or plays the video by clicking on it, we handle it here.
        Then set appropriate background images to the buttons by changing their class
        */
        if (event.data === YT.PlayerState.PAUSED) {
            playPauseButton.classList.remove('pause');
            playPauseButton.classList.add('play');
            sendPause();
        } else if (event.data === YT.PlayerState.PLAYING) {
            playPauseButton.classList.remove('play');
            playPauseButton.classList.add('pause');
            sendPlay();
        }
    }

    const progressContainer = document.getElementById('progress-container');
    // 1
    // makes the progress bar clickkable
    progressContainer.addEventListener('click', function (event) {
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.getElementById('progress-container');
        const offsetX = event.offsetX; // x off set from the left
        const totalBarWidth = progressContainer.offsetWidth; // total width of the bar
        const duration = player.getDuration(); // total time of the video in sec
        const progressPercent = offsetX / totalBarWidth * 100; // percent progress
        const seekTime = duration * progressPercent / 100;
        socket.emit("durationChange", {
            seconds: seekTime,
        })
    });

    // 3
    socket.on("durationChange", seekTime => {
        player.seekTo(seekTime.seconds, true); // seek to the clicked time
    })

    // text hover
    // Sync
    document.querySelector('#sync-text').onmouseover = event => {
        hoverEffect(event.target);
    };
    // Watch
    document.querySelector('#watch-text').onmouseover = event => {
        hoverEffect(event.target);
    };

    // hover effect
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    function hoverEffect(text) {
        let i = 0;
        const interval = setInterval(() => {
            text.innerText = text.innerText.split("")
                .map((letter, index) => {
                    if (index < i) {
                        return text.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");
            if (i > text.dataset.value.length) {
                clearInterval(interval);
            }
            i += 1 / 4;
        }, 40);
    }

});
