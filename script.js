document.addEventListener("DOMContentLoaded", function() {
    const youtubeForm = document.getElementById("youtubeForm");
    const youtubeUrlInput = document.getElementById("youtubeUrl");

    youtubeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const youtubeUrl = youtubeUrlInput.value;
        if (youtubeUrl) {
            // Call a function to handle the YouTube URL
            handleYouTubeUrl(youtubeUrl);
        }
    });

    function handleYouTubeUrl(url) {
        // Here you can implement the logic to process the YouTube URL
        // For now, let's just log the URL to the console
        const videoID = extractVideoId(url)
        if(videoID == null){
            // send a message that error
            console.log("error");
        }else {
            // handle 
            console.log(videoID);
        }
    }
    function extractVideoId(url) {
    // Extract the video ID from the YouTube URL
    // You can use regular expressions or other methods to extract the ID
    // URL format: https://www.youtube.com/watch?v=VIDEO_ID
        const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|\/v\/|https:\/\/youtu.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }
});
