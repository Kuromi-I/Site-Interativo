
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
  [audioAcerto, audioErroXiu, audioErroMamaco].forEach(audio => audio.volume = 0.3);

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
