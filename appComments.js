// App.js With Comments

// Create the loop on play
class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll('.pad');
    this.playButton = document.querySelector('.play');
    this.currentKick = './sounds/kick-classic.wav';
    this.currentSnare = './sounds/snare-acoustic01.wav';
    this.currentHihat = './sounds/hihat-acoustic01.wav';
    this.kickAudio = document.querySelector('.kick-sound');
    this.snareAudio = document.querySelector('.snare-sound');
    this.hihatAudio = document.querySelector('.hihat-sound');
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
    this.selects = document.querySelectorAll('select');
    this.muteButtons = document.querySelectorAll('.mute');
    this.tempoSlider = document.querySelector('.tempo-slider');
  }
  activePad() {
    this.classList.toggle('active');
  }
  repeat() {
    let step = this.index % 8; // Remainder returns to 0 and repeats the loop
    // Select each track's pad (kick, snare, hihat)
    const activeBars = document.querySelectorAll(`.b${step}`);
    // Loop over the pads
    activeBars.forEach(bar => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out`;
      // Check if pads are active and if so play sound
      if (bar.classList.contains('active')) {
        // check each sound
        if (bar.classList.contains('kick-pad')) {
          // Restart audio time on play 
          this.kickAudio.currentTime = 0;
          // Allows us to play the next beat despite not finishing one prior
          this.kickAudio.play();
        }
        if (bar.classList.contains('snare-pad')) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (bar.classList.contains('hihat-pad')) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }
  start() {
    // Set a BPM:
    const interval = (60 / this.bpm) * 1000; // 60 (seconds) ÷ bpm value x 1000ms (requires ms).
    // check if it's playing
    if (this.isPlaying) {
      // clear the interval
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    } else {
      this.isPlaying = setInterval(() => { // Arrow function stops redirection of 'this'
        this.repeat(); // continuously invoke repeat:
      }, interval);
    }
  }
  updateBtn() {
    if (this.isPlaying) {
      this.playButton.innerText = 'Stop';
      this.playButton.classList.add('active');
    } else {
      this.playButton.innerText = 'Play';
      this.playButton.classList.remove('active');
    }
  }
  changeSound(e) {
    const selectionName = e.target.name;
    const selectionValue = e.target.value;
    // console.log(selectionName, selectionValue);
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }
  mute(e) {
    const muteIndex = e.target.getAttribute('data-track');
    e.target.classList.toggle('active');
    if (e.target.classList.contains('active')) {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }
  changeTempo(e){
    const tempoText = document.querySelector('.tempo-nr');
    this.bpm = e.target.value;
    tempoText.innerText = e.target.value;
  }
  updateTempo(){
    clearInterval(this.isPlaying); // clear interval
    this.isPlaying = null; // set it to null
    const playButton = document.querySelector('.play');
    if(playButton.classList.contains('active')){ // if play button is active
      this.start(); // run the start function again
    } // If play button is not active, don't start.
  }
}
// we clear the interval so we can update it and re-run with the new value
// It wouldn't update the value if we didn't do this.


const drumKit = new DrumKit();

// Event Listeners
drumKit.pads.forEach(pad => {
  pad.addEventListener('click', drumKit.activePad);
  pad.addEventListener('animationend', function () {
    this.style.animation = ""; // 'this' refers to pad
  });
});

drumKit.playButton.addEventListener('click', function () {
  drumKit.start();
  drumKit.updateBtn();
})

drumKit.selects.forEach(select => {
  select.addEventListener('change', function (e) {
    drumKit.changeSound(e); // within a function so we can use a callback
    // Without the callback, we would invoke the function
  })
});

drumKit.muteButtons.forEach(button => {
  button.addEventListener('click', function (e) {
    drumKit.mute(e);
  });
});

// Update tempo text:
// Input tracks every change in value on the slider. Input will be used to update tempo text.
drumKit.tempoSlider.addEventListener('input', function(e){ 
  drumKit.changeTempo(e);
});

// Change bpm interval on slide and stop from playing:
// Change doesn't track changes as you slide. It only changes after user has let go of slider.
drumKit.tempoSlider.addEventListener('change', function(e){ 
  drumKit.updateTempo(e);
});