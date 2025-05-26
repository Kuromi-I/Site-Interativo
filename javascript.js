document.addEventListener('DOMContentLoaded', () => {
  const song = document.getElementById('song');
  const playPauseBtn = document.getElementById('playPause');
  const rewindBtn = document.getElementById('rewind');
  const forwardBtn = document.getElementById('forward');
  const speedBtn = document.getElementById('speed');
  const volumeBar = document.getElementById('volumeBar');
  const progressBar = document.getElementById('progressBar');

  const playlist = [
    "../Audios/Fullstack.mp3",
    "../Audios/MAIAHMANSER.mp3",
    "../Audios/ugot.mp3"
  ];

  let currentTrack = 0;

  function changeTrack(index, shouldPlay = false) {
    if (index < 0 || index >= playlist.length) return;

    song.src = playlist[index];
    song.load();

    const onCanPlay = () => {
      if (shouldPlay) {
        song.play().then(() => {
          playPauseBtn.textContent = '⏸';
        }).catch((err) => {
          console.warn("Erro ao tentar tocar a música:", err);
          playPauseBtn.textContent = '▶';
        });
      } else {
        playPauseBtn.textContent = '▶';
      }
      song.removeEventListener('canplaythrough', onCanPlay);
    };

    song.addEventListener('canplaythrough', onCanPlay);
  }

  playPauseBtn.addEventListener('click', () => {
    if (song.paused) {
      song.play().then(() => {
        playPauseBtn.textContent = '⏸';
      }).catch(() => {
        console.warn("Não foi possível reproduzir o áudio.");
      });
    } else {
      song.pause();
      playPauseBtn.textContent = '▶';
    }
  });

  rewindBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    changeTrack(currentTrack, true);
  });

  forwardBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    changeTrack(currentTrack, true);
  });

  speedBtn.addEventListener('click', () => {
    if (song.playbackRate === 1) {
      song.playbackRate = 1.5;
      speedBtn.textContent = '1.5x';
    } else if (song.playbackRate === 1.5) {
      song.playbackRate = 2;
      speedBtn.textContent = '2x';
    } else {
      song.playbackRate = 1;
      speedBtn.textContent = '1x';
    }
  });

  song.volume = volumeBar.value / 100;
  volumeBar.addEventListener('input', () => {
    song.volume = volumeBar.value / 100;
  });

  song.addEventListener('timeupdate', () => {
    if (!progressBar.dragging) {
      const progressPercent = (song.currentTime / song.duration) * 100;
      progressBar.value = progressPercent || 0;
    }
  });

  progressBar.dragging = false;

  const handleSeek = () => {
    progressBar.dragging = false;
    const time = (progressBar.value / 100) * song.duration;
    song.currentTime = time;
  };

  progressBar.addEventListener('mousedown', () => {
    progressBar.dragging = true;
  });
  progressBar.addEventListener('mouseup', handleSeek);
  progressBar.addEventListener('touchstart', () => {
    progressBar.dragging = true;
  });
  progressBar.addEventListener('touchend', handleSeek);

song.addEventListener('ended', () => {
  progressBar.value = 0;

  if (currentTrack < playlist.length - 1) {
    currentTrack++;
    changeTrack(currentTrack, true);
  } else {
    // Última música terminou, para tudo
    playPauseBtn.textContent = '▶';
  }
});

  changeTrack(currentTrack, false);
});

// Jogo da Memória

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const overlay = document.getElementById('overlay');
  let winningIndex;

  // 🎵 Áudios
  const audioAcerto = new Audio('../Audios/wow.mp3');
  const audioErroXiu = new Audio('../Audios/dog.mp3');
  const audioErroMamaco = new Audio('../Audios/gta.mp3');

  // Define o volume de todos os áudios para 30%
  [audioAcerto, audioErroXiu, audioErroMamaco].forEach(audio => audio.volume = 0.4);

  function embaralharCartas() {
    cards.forEach(card => card.classList.remove('flipped'));

    setTimeout(() => {
      const imagens = [
        '../Imagens/Blep.jpg',
        '../Imagens/xiu.jpg',
        '../Imagens/mamaco.jpg'
      ];

      for (let i = imagens.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
      }

      winningIndex = imagens.indexOf('../Imagens/Blep.jpg');

      cards.forEach((card, index) => {
        const backImg = card.querySelector('.back img');
        backImg.src = imagens[index];
        backImg.title = imagens[index].includes('Blep') ? 'Bolinha' : 'Errou';
      });
    }, 300);
  }

  function resetarJogo() {
    overlay.classList.remove('show');
    embaralharCartas();
  }

  function mostrarMensagem() {
    overlay.classList.add('show');
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (document.querySelectorAll('.flipped').length > 0) return;

      card.classList.add('flipped');

      const backImg = card.querySelector('.back img');
      const imagemSrc = backImg.src;

      // Aguarda a carta virar completamente antes de mostrar a mensagem ou tocar o áudio
      setTimeout(() => {
        if (index === winningIndex) {
          audioAcerto.play();
          mostrarMensagem();
        } else {
          if (imagemSrc.includes('xiu')) {
            audioErroXiu.play();
          } else if (imagemSrc.includes('mamaco')) {
            audioErroMamaco.play();
          }
        }
      }, 600); // tempo para esperar a carta virar (ajuste conforme seu CSS)

      setTimeout(resetarJogo, 3000);
    });
  });

  embaralharCartas();
});
