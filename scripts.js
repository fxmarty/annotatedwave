var RegionsPlugin = window.WaveSurfer.regions;

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

RegionsPlugin.prototype.getRegionAtTime = function (tps){
    let min = null;
    Object.keys(this.list).forEach(id => {
        const cur = this.list[id];
        if (cur.start <= tps && cur.end >= tps) {
            if (!min || cur.end - cur.start < min.end - min.start) {
                min = cur;
            }
        }
    });
    return min;
    }


var phoneme = JSON.parse(data_phoneme);
var phoneme_instru = JSON.parse(data_phonemeInstru);
var phoneme_ungrouped_truevocals = JSON.parse(phoneme_truevocals)
var phoneme_ungrouped_polyphonic = JSON.parse(phoneme_polyphonic)

var phonemeLength = phoneme.length;
var phonemeGroups = ['approximant','fricative','nasal','plosive','vowel','special']
var phoneme_list = ['ɚ', 's', 'ɛ', 'ð', 'j', 'œ', 'k', 'ɔ', 'ɲ', 'ø', 't', 'ʑ', 'd', 'ᵻ', 'ʃ', 'ʋ', 'ɜ', 'p', 'θ', 'ɾ', 'ɡ', 'n', 'ʏ', 'ɨ', 'ç', 'ɒ', 'ə', 'x', 'ʝ', 'ɟ', 'ŋ', 'ʎ', 'i', 'ɵ', 'y', 'ʁ', 'l', 'ʒ', 'ɕ', 'f', 'a', 'ɑ', 'β', 'ɬ', 'ʌ', 'z', 'o', 'r', 'v', 'ɐ', 'ɹ', 'ɣ', 'ɪ', 'w', 'ʔ', 'e', 'ʊ', 'u', 'b', 'h', 'æ', 'm', 'special 1', 'special 2'];
var pauseOnEnd = true;

var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  fillParent: false,
  scrollParent: true,
  hideScrollbar: false,
  minPxPerSec: 200,
  pixelRatio: 1,
  autocenter: true,
  //backend: 'MediaElement',
  plugins: [
        WaveSurfer.regions.create({})
    ],
  waveColor: 'red'
});

//wavesurfer.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
wavesurfer.load('test_vocals_Tom McKenzie - Directions.wav')


wavesurfer.on('ready', function () {
    //console.log("dans ready")
    var currentHighest;
    var currentHighest_prev = indexOfMax(phoneme[0]);
    var start_time = 0;
    var end_time;
    
    var h = 120;
    var s = 100;
    var l = 25;
    var color1 = 'hsla('+h+','+s+'%,'+l+'%,'+'0.1'+')';
    var color2 = 'hsla('+h+','+s+'%,'+l+'%,'+'0.5'+')';
    
    var current_color = color1;
    
    for (var i = 0; i < phonemeLength; i++) {
        currentHighest = indexOfMax(phoneme[i]);
        //console.log(currentHighest)
            
        if (currentHighest != currentHighest_prev || i === phonemeLength - 1) {
            if (current_color === color1) {
            current_color = color2;
            } else {
                current_color = color1;
            }
            
            end_time = i*0.016;
            //console.log(i);
            //console.log(start_time);
            //console.log(end_time);
            wavesurfer.addRegion({
                start: start_time, // time in seconds
                end: end_time, // time in seconds
                color: current_color,
                resize: false,
                drag: false,
                attributes: {
                    label: phonemeGroups[currentHighest_prev]
                }
            });
            start_time = i*0.016;
            //console.log(currentHighest_prev);
            currentHighest_prev = currentHighest;
            //console.log("---")
        }
    }
});

var labelCourant = 'a';
wavesurfer.on('audioprocess', function() {
    if(wavesurfer.isPlaying()) {
        var totalTime = wavesurfer.getDuration(),
            currentTime = wavesurfer.getCurrentTime(),
            remainingTime = totalTime - currentTime;
        
        
        try {
            var currentLabel = wavesurfer.regions.getCurrentRegion().attributes.label;
            document.getElementById('current-region').innerText = currentLabel;
            document.getElementById('current-region-instru').innerText = phonemeGroups[indexOfMax(phoneme_instru[Math.floor( wavesurfer.getCurrentTime()/0.016 )])];
            
            document.getElementById('current-region-ungrouped-truevocals').innerText = phoneme_list[indexOfMax(phoneme_ungrouped_truevocals[Math.floor( wavesurfer.getCurrentTime()/0.016 )])];
            document.getElementById('current-region-ungrouped-polyphonic').innerText = phoneme_list[indexOfMax(phoneme_ungrouped_polyphonic[Math.floor( wavesurfer.getCurrentTime()/0.016 )])];
            
            if (pauseOnEnd) {
                if (labelCourant != wavesurfer.regions.getRegionAtTime(currentTime + 0.016).attributes.label) {
                    wavesurfer.playPause();
                    labelCourant = wavesurfer.regions.getRegionAtTime(currentTime + 0.016).attributes.label;
                }
            }
            
            //console.log("haha");
            
        }
        catch (e) {}
        
        //console.log(wavesurfer.regions.getCurrentRegion().attributes.label);
        document.getElementById('time-total').innerText = totalTime.toFixed(2);
        document.getElementById('time-current').innerText = currentTime.toFixed(2);
        document.getElementById('rate').innerText = wavesurfer.getPlaybackRate().toFixed(2);  
    }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
      e.stopImmediatePropagation();
      e.preventDefault();
      document.getElementById("pause").click();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === "ArrowUp") {
      var currentRate = wavesurfer.getPlaybackRate();
      wavesurfer.setPlaybackRate(currentRate+0.05);
  }
  if (e.code === "ArrowDown") {
      var currentRate = wavesurfer.getPlaybackRate();
      if (currentRate-0.07 > 0) wavesurfer.setPlaybackRate(currentRate-0.05);
  }
  
  if (e.code === "ArrowLeft") {
      var currentTime = wavesurfer.getCurrentTime();
      if (currentTime - 1 > 0) {
          var duration = wavesurfer.getDuration();
          wavesurfer.seekTo((wavesurfer.getCurrentTime() - 1)/duration);
          wavesurfer.play();
      }
  }
  
  if (e.code === "ArrowRight") {
      var currentTime = wavesurfer.getCurrentTime();
      var duration = wavesurfer.getDuration();
      if (currentTime + 1 < duration) {
          wavesurfer.seekTo((wavesurfer.getCurrentTime() + 1)/duration);
          wavesurfer.play();
      }
  }
});
 
function toggleText(button_id) 
{
   var el = document.getElementById(button_id);
   if (el.firstChild.data == "Lock") 
   {
       el.firstChild.data = "Unlock";
   }
   else 
   {
     el.firstChild.data = "Lock";
   }
}

function toggle() { 
    pauseOnEnd = !pauseOnEnd;

    if (pauseOnEnd) {
        document.getElementById("pause-on-change").innerHTML = 'Pause on end: ON';
    }
    else {
        document.getElementById("pause-on-change").innerHTML = 'Pause on end: OFF';
    }
}
