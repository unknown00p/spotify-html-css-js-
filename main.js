let currentSong = new Audio()
let song;
let cFolder;

function secondsToMinutesAndSeconds(seconds) {
    // Ensure the input is a positive number
    if (typeof seconds !== 'number' || seconds < 0) {
        throw new Error('Input must be a non-negative number');
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the result
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the result as a string in the "mm:ss" format
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function allsongs(folder) {
    cFolder = folder;
    let url = await fetch(`http://127.0.0.1:5500/${cFolder}/`)
    let responce = await url.text()
    let div = document.createElement("div")
    div.innerHTML = responce
    let as = div.getElementsByTagName("a")
    song = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith("m4a")) {
            song.push(element.href.split(`/${cFolder}/`)[1])
        }
    }
    let element = document.getElementsByClassName("scroll-bar")[0]
    element.innerHTML=""
    for (songItem of song) {
        element.innerHTML = element.innerHTML + `
        <div id="allbox" class="box1 d-flex item-center justify-between font-roboto padding rounded gap">
        <img class="invert" src="/img-comp/music.svg" alt="" srcset="">
        <p class="songName">${songItem.replaceAll("%2B" && "%20", " ")}</p>
        <img id="sidePlay" class="invert pointer" src="/img-comp/play.svg" alt="" srcset="">
    </div>
    `
    }
    Array.from(document.querySelector(".scroll-bar").getElementsByTagName("div")).forEach(elem => {
        elem.addEventListener("click", element => {
            PlayMusic(elem.querySelector(".songName").innerHTML.trim())
            play.src = "/img-comp/pause.svg"
        })
    })
}


allsongs()

const PlayMusic = (track, pause = false) => {
    currentSong.src = `/${cFolder}/` + track
    currentSong.addEventListener('loadedmetadata', function () {
        if (!pause) {
            currentSong.play();
            play.src = "/img-comp/pause.svg";
        }
        document.querySelector(".songInfo").innerHTML = track;
        document.querySelector(".songTime").innerHTML = "00:00 / " + secondsToMinutesAndSeconds(currentSong.duration);
    });
}

async function playnow() {
    await allsongs(`songs/ncs`)
    PlayMusic(song[0], true)
    let audio = new Audio(song[0]);

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img-comp/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/img-comp/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = persent + "%";
        currentSong.currentTime = ((currentSong.duration) * persent) / 100
    })

    previous.addEventListener("click", () => {
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            PlayMusic(song[index - 1])
            play.src = "/img-comp/pause.svg"
        }
    })


    next.addEventListener("click", () => {
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < song.length) {
            PlayMusic(song[index + 1])
            play.src = "/img-comp/pause.svg"
        }
    })
    range1.addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

   Array.from(document.getElementsByClassName("box-container")).forEach(e=>{
    e.addEventListener("click",async item=>{
        console.log(item.currentTarget.dataset.folder);
        song = await allsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
   })
}

playnow()