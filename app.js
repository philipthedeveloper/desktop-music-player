const list = document.querySelector(".list");
const volumeRange = document.querySelector(".volume_controls input");
const durationRange = document.querySelector('.lower input[type="range"]');
const totalDuration = document.querySelector(".lower #total_duration");
const currentDuration = document.querySelector(".lower #current_duration");
const playBtn = document.querySelector(".top_controls #play");
const favBtn = document.querySelector(".upper #favIcon");
const favIcon = document.querySelector(".upper #favIcon span");
const prevBtn = document.querySelector(".top_controls #prev");
const nextBtn = document.querySelector(".top_controls #next");
const repeatBtn = document.querySelector(".top_controls #repeat");
const shufBtn = document.querySelector(".top_controls #shuffle");
const track = document.createElement("audio");
const volumeUp = document.createElement("span");
volumeUp.innerHTML = `volume_ups`;
volumeUp.classList.add("material-icons-outlined");

let index = 0;
let repeat_all = false;
let repeat_one = false;
let shuffle_songs = false;
let trackCurrentTime;

const All_song = [
  {
    name: "Player",
    path: "audio/Fireboy-DML-Playboy.mp3",
    img: "imgs/Fireboy-DML-Playboy.jpeg",
    artist: "Fireboy",
    fav: true,
    album: "Single",
  },
  {
    name: "Live Forever",
    path: "audio/Kayode - Live_Forever.mp3",
    img: "imgs/kayode-live-forever.jpg",
    artist: "Kayode",
    fav: false,
    album: "Single",
  },
  {
    name: "Side Guy",
    path: "audio/Kayode - Side_Guy.mp3",
    img: "imgs/kayode-siderguy.jpg",
    artist: "Kayode",
    fav: false,
    album: "Single",
  },
  {
    name: "Thinking",
    path: "audio/NF - Thinking.mp3",
    img: "imgs/nf-thinking.jpg",
    artist: "NF",
    fav: false,
    album: "Single",
  },
  {
    name: "Time",
    path: "audio/NF - Time.mp3",
    img: "imgs/nf-time.jpg",
    artist: "NF",
    fav: false,
    album: "Single",
  },
  {
    name: "Trauma",
    path: "audio/NF - Trauma.mp3",
    img: "imgs/nf-trauma-2.jpg",
    artist: "NF",
    fav: false,
    album: "Single",
  },
  {
    name: "Why",
    path: "audio/NF - Why.mp3",
    img: "imgs/nf-why.jpg",
    artist: "NF",
    fav: false,
    album: "Single",
  },
];

function durationObject(value) {
  let minute = Math.floor(value / 60);
  let seconds = Math.round(value % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return { seconds, minute };
}

function loadTrackToDom(track, index, duration) {
  const { name, artist, path, fav, album } = track;
  let { seconds, minute } = durationObject(duration);
  list.innerHTML += `
  <div class="song" id="${index}">
    <div class="number_grid">
      <p id="track_number">0${index + 1}</p>
    </div>
    <div class="track_details">
      <p id="track_title">${name}</p>
      <p id="artist_name">${artist}</p>
      <p id="track_duration">0${minute} : ${seconds}</p>
      <p id="album_name">${album}</p>
    </div>
  </div>`;
  let newIndex = index + 1;
  if (newIndex < All_song.length) {
    getFullDuration(newIndex);
  } else {
    loadtrack(0);
    const allAudio = document.querySelectorAll(".song");
    allAudio.forEach((track) => {
      track.addEventListener("click", (e) => self(e));
    });
  }
}

function self(e) {
  index = Number(e.target.closest(".song").id);
  loadtrack(index);
  playTrack();
}

function getFullDuration(value) {
  if (value < All_song.length) {
    let audio = All_song[value];
    const track = new Audio();
    const { path } = audio;
    track.src = path;
    loadedListener(track, audio, value);
  }
}

function loadedListener(track, audio, index) {
  track.addEventListener("loadedmetadata", (e) => {
    let duration = track.duration;
    loadTrackToDom(audio, index, duration);
  });
}

getFullDuration(0);

function callback() {
  let { seconds, minute } = durationObject(track.duration);
  totalDuration.textContent = `0${minute} : ${seconds}`;
  const allAudio = document.querySelectorAll(".song");
  All_song.forEach((track, i) => {
    if (i === index) {
      allAudio[i].classList.add("played");
      allAudio[i].querySelector(
        ".number_grid"
      ).innerHTML = `<p id="track_number">0${
        i + 1
      }</p><span class="material-icons-outlined"> volume_up </span>`;
    } else {
      allAudio[i].classList.remove("played");
      allAudio[i].querySelector(
        ".number_grid"
      ).innerHTML = `<p id="track_number">0${i + 1}</p>
      `;
    }
  });
}

function modifyPlayedSong(value) {
  value.addEventListener("loadedmetadata", callback);
}

function loadtrack(value) {
  durationRange.value = 0;
  clearInterval(trackCurrentTime);
  const { path, fav } = All_song[value];
  track.src = path;
  track.volume = volumeRange.value / 100;
  track.load();
  modifyPlayedSong(track);
  checkFav(fav);
}

function playTrack() {
  track.play();
  playBtn.innerHTML = '<span class="material-icons-round"> pause </span>';
  trackCurrentTime = setInterval(trackDuration, 1000);
}

function pauseTrack() {
  track.pause();
  playBtn.innerHTML = '<span class="material-icons-round"> play_arrow </span>';
  clearInterval(trackCurrentTime);
}

function changePlayMode() {
  if (track.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function checkFav(value) {
  if (value) {
    favBtn.innerHTML = `<span class="material-icons-round">
    favorite
    </span>`;
    favBtn.classList.add("fav");
  } else {
    favBtn.innerHTML = `<span class="material-icons-round"> favorite_border </span>`;
    favBtn.classList.remove("fav");
  }
}

function favourite() {
  All_song[index].fav = !All_song[index].fav;
  const { fav } = All_song[index];
  checkFav(fav);
}

function changeVolume() {
  track.volume = this.value / 100;
}

function prev() {
  let newIndex;
  if (repeat_one || repeat_all) {
    repeater(previouser);
  } else if (shuffle_songs) {
    shuffler();
  } else {
    previouser();
  }
}

function previouser() {
  if (index > 0) {
    index -= 1;
    loadtrack(index);
    playTrack();
  } else {
    index = All_song.length - 1;
    loadtrack(index);
    playTrack();
  }
}

function next() {
  let newIndex;
  if (repeat_one || repeat_all) {
    repeater(nexter);
  } else if (shuffle_songs) {
    shuffler();
  } else {
    nexter();
  }
}

function nexter() {
  if (index < All_song.length - 1) {
    index += 1;
    loadtrack(index);
    playTrack();
  } else {
    index = 0;
    loadtrack(index);
    playTrack();
  }
}

function repeater(func) {
  if (repeat_one) {
    loadtrack(index);
    playTrack();
  } else if (repeat_all) {
    if (shuffle_songs) {
      shuffler();
    } else {
      func();
    }
  }
}

function shuffler() {
  do {
    newIndex = random();
  } while (newIndex === index);
  index = newIndex;
  loadtrack(index);
  playTrack();
}

function random() {
  return Math.floor(Math.random() * All_song.length);
}

function repeat() {
  if (repeat_one) {
    repeat_one = false;
    repeat_all = false;
    repeatBtn.innerHTML = '<span class="material-icons-round"> repeat </span>';
    repeatBtn.classList.remove("fav");
  } else if (repeat_all) {
    repeat_one = true;
    repeat_all = false;
    repeatBtn.innerHTML =
      '<span class="material-icons-round"> repeat_one </span>';
  } else {
    repeat_all = true;
    repeatBtn.classList.add("fav");
  }
}

function shuffle() {
  shuffle_songs = !shuffle_songs;
  if (shuffle_songs) {
    this.classList.add("fav");
  } else {
    this.classList.remove("fav");
  }
}

function changeCurrentTime() {
  track.currentTime = (durationRange.value / 100) * track.duration;
  let { seconds, minute } = durationObject(track.currentTime);
  currentDuration.innerHTML = `0${minute} : ${seconds}`;
}

function trackDuration() {
  durationRange.value = (track.currentTime / track.duration) * 100;
  let { seconds, minute } = durationObject(track.currentTime);
  currentDuration.innerHTML = `0${minute} : ${seconds}`;
}

playBtn.addEventListener("click", changePlayMode);
favBtn.addEventListener("click", favourite);
volumeRange.addEventListener("change", changeVolume);
volumeRange.addEventListener("mousemove", changeVolume);
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
repeatBtn.addEventListener("click", repeat);
shufBtn.addEventListener("click", shuffle);
durationRange.addEventListener("change", changeCurrentTime);
track.addEventListener("ended", next);
window.onresize = function () {
  const InnerWidth = window.innerWidth;
  if (InnerWidth < 1200) {
    document.write(
      "This web application is only available for device about 1200px width"
    );
  }
};
