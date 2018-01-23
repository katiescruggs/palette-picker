let blocks = [
  {
    div: colorZero,
    hex: hexZero,
    color: '#FFF'
  },
  {
    div: colorOne,
    hex: hexOne,
    color: '#FFF'
  },
  {
    div: colorTwo,
    hex: hexTwo,
    color: '#FFF'
  },
  {
    div: colorThree,
    hex: hexThree,
    color: '#FFF'
  },
  {
    div: colorFour,
    hex: hexFour,
    color: '#FFF'
  }];

const randomColor = () => {
  //random hex color generator by Paul Irish: 
  //https://www.paulirish.com/2009/random-hex-color-code-snippets/
  return '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
};

const refreshColors = () => {
  blocks.forEach(block => {
    if(!$(block.div).hasClass('locked')) {
      block.color = randomColor();
      block.div.style.backgroundColor = block.color;
      block.hex.innerText = block.color;
    }
  });
};

$(document).ready(() => {
  refreshColors();
});

$(document).on('keyup', (e) => {
  if (e.keyCode === 32 && e.target === document.body) {
    refreshColors();
  }
});

$(btn).on('click', refreshColors);

$('.color-container').on('click', '.color-div', function() {
  $(this).toggleClass('locked');
});
