let colors = ['#FFF', '#FFF', '#FFF', '#FFF', '#FFF'];
let colorDivs = [colorZero, colorOne, colorTwo, colorThree, colorFour];

const randomColor = () => {
  //random hex color generator by Paul Irish: 
  //https://www.paulirish.com/2009/random-hex-color-code-snippets/
  return '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
};

const refreshColors = () => {
  colors = colors.map(color => randomColor());
  colorDivs.forEach((colorDiv, index) => {
    if (!$(colorDiv).hasClass('locked')) {
      colorDiv.style.backgroundColor = colors[index];
    }
  });
};

$(document).ready(() => {
  refreshColors();
});

$(document).on('keyup', refreshColors);

$(btn).on('click', refreshColors);

$('.color-container').on('click', '.color-div', function() {
  $(this).toggleClass('locked');
});
