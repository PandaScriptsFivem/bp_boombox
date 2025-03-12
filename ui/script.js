let isPlaying = false;
let currentTime = 0;
let trackName = "Nincs zene";
let timerInterval = null;

const playlist = [
    { name: "Oxygen Music", link: "https://oxygenmusic.hu:8000/oxygenmusic_128" },
    { name: "Rádió 1", link: "https://icast.connectmedia.hu/5202/live.mp3" },
    { name: "Retro Rádió", link: "https://icast.connectmedia.hu/5002/live.mp3" },
    { name: "Sláger FM", link: "https://slagerfm.netregator.hu:7813/slagerfm128.mp3" },
    { name: "Dikh Rádió", link: "https://icast.connectmedia.hu/6121/live.mp3" }
];

let currentTrackIndex = 0;

const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const volUpButton = document.getElementById('vol-up');
const volDownButton = document.getElementById('vol-down');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeDisplay = document.getElementById('current-time');
const trackNameDisplay = document.getElementById('track-name');

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isPlaying) {
            currentTime += 1;
            updateDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    currentTime = 0;
    updateDisplay();
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const boombox = document.getElementById('boombox');
        boombox.style.transition = "opacity 0.5s ease-out";
        boombox.style.opacity = "0";

        setTimeout(() => {
            fetch(`https://${GetParentResourceName()}/close_boombox`);
            boombox.style.display = 'none';
            boombox.style.opacity = "1";
        }, 500);
    }
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'open') {
        const boombox = document.getElementById('boombox');
        boombox.style.display = 'block';
        boombox.style.opacity = "0";
        boombox.style.transition = "opacity 0.5s ease-in";

        setTimeout(() => {
            boombox.style.opacity = "1";
        }, 10);
    }
});

playButton.addEventListener('click', () => {
    isPlaying = true;
    fetch(`https://${GetParentResourceName()}/play`, {
        method: 'POST'
    });
    if (trackName === "Nincs zene") {
        trackName = playlist[currentTrackIndex].name;
    }
    startTimer();
    updateDisplay();
});

pauseButton.addEventListener('click', () => {
    isPlaying = false;
    fetch(`https://${GetParentResourceName()}/pause`, {
        method: 'POST'
    });
    trackName = "Zene szüneteltetve";
    stopTimer();
    updateDisplay();
});

stopButton.addEventListener('click', () => {
    isPlaying = false;
    fetch(`https://${GetParentResourceName()}/stop`, {
        method: 'POST'
    });
    trackName = "Nincs zene";
    stopTimer();
    resetTimer();
    updateDisplay();
});

prevButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const track = playlist[currentTrackIndex];
    SetSong(track.link);
    trackName = track.name;
    resetTimer();
    updateDisplay();
});

nextButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    const track = playlist[currentTrackIndex];
    SetSong(track.link);
    trackName = track.name;
    resetTimer();
    updateDisplay();
});

volUpButton.addEventListener('click', () => {
    const newVolume = Math.min(1.0, parseFloat(volumeSlider.value) + 0.1);
    volumeSlider.value = newVolume;
    updateVolume(newVolume);
});

volDownButton.addEventListener('click', () => {
    const newVolume = Math.max(0.0, parseFloat(volumeSlider.value) - 0.1);
    volumeSlider.value = newVolume;
    updateVolume(newVolume);
});

volumeSlider.addEventListener('input', () => {
    updateVolume(parseFloat(volumeSlider.value));
});

function updateVolume(newVolume) {
    fetch(`https://${GetParentResourceName()}/volume`, {
        method: 'POST',
        body: JSON.stringify({ volume: newVolume })
    });
}

function updateDisplay() {
    currentTimeDisplay.textContent = formatTime(currentTime);
    trackNameDisplay.textContent = trackName;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function SetSong(link) {
    fetch(`https://${GetParentResourceName()}/playsound`, {
        method: "POST",
        body: JSON.stringify({
            link: link
        }),
    });
    isPlaying = true;
    startTimer();
    updateDisplay();
}

document.getElementById('button1').addEventListener('click', () => {
    SetSong("https://oxygenmusic.hu:8000/oxygenmusic_128");
    trackName = "Oxygen Music";
    updateDisplay();
    resetTimer();
});

document.getElementById('button2').addEventListener('click', () => {
    SetSong("https://icast.connectmedia.hu/5202/live.mp3");
    trackName = "Rádió 1";
    updateDisplay();
    resetTimer();
});

document.getElementById('button3').addEventListener('click', () => {
    SetSong("https://icast.connectmedia.hu/5002/live.mp3");
    trackName = "Retro Rádió";
    updateDisplay();
    resetTimer();
});

document.getElementById('button4').addEventListener('click', () => {
    SetSong("https://slagerfm.netregator.hu:7813/slagerfm128.mp3");
    trackName = "Sláger FM";
    updateDisplay();
    resetTimer();
});

document.getElementById('button5').addEventListener('click', () => {
    SetSong("https://icast.connectmedia.hu/6121/live.mp3");
    trackName = "Dikh Rádió";
    updateDisplay();
    resetTimer();
});