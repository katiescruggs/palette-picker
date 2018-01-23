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

const randomNum = () => {
  return Math.floor(Math.random() * 16);
}

const randomColor = () => {
  const chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  const num = [randomNum(), randomNum(), randomNum(), randomNum(), randomNum(), randomNum()];

  const color = `#${chars[num[0]]}${chars[num[1]]}${chars[num[2]]}${chars[num[3]]}${chars[num[4]]}${chars[num[5]]}`;
  const dark = (num[0] + num[2] + num[4]) < 23;

  return { color, dark };
};

const refreshColors = () => {
  blocks.forEach(block => {
    if(!$(block.div).hasClass('locked')) {
      let { color, dark } = randomColor();

      if (dark) {
        $(block.div).addClass('dark');
      } else {
        $(block.div).removeClass('dark');
      }

      block.color = color;
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

$('.color-container').on('click', '.color-div', function() {
  $(this).toggleClass('locked');
});
