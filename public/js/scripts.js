let colors = ['#FFF', '#FFF', '#FFF', '#FFF', '#FFF'];
let colorBlocks = [colorZero, colorOne, colorTwo, colorThree, colorFour];

const randomColor = () => {
  //random hex color generator by Paul Irish: 
  //https://www.paulirish.com/2009/random-hex-color-code-snippets/
  return '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
};

const refreshColors = () => {
  colors = colors.map(color => randomColor());
  colors.forEach((color, index) => {
    colorBlocks[index].style.backgroundColor = color;
  });
};

$(document).ready(() => {
  refreshColors();
});

btn.addEventListener('click', () => {
  refreshColors();
});
