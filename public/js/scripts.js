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

const fetchProjects = async () => {
  const projectsFetch = await fetch('/api/v1/projects');
  const projectResults = await projectsFetch.json();
  const projects = projectResults.results;

  console.log(projects);
  fetchPalettes(projects[0]);
};

const fetchPalettes = async (project) => {
  console.log(project);

  const paletteFetch = await fetch(`/api/v1/projects/${project.id}/palettes`);
  const paletteResults = await paletteFetch.json();
  const palette = paletteResults.results;

  console.log(palette);

  displaySavedPalettes(project.title, palette);
};

const displaySavedPalettes = (projectTitle, palette) => {
  $('.display-projects').append(`<h3>${projectTitle}</h3>`);

  for (var i = 0; i < palette.length; i++) {
    $('.display-projects').append(`
      <h4>${palette[i].title}</h4>
      <div class="square-holder">
        <div class="project-square" style="background-color:${palette[i].color1}"></div>
        <div class="project-square" style="background-color:${palette[i].color2}"></div>
        <div class="project-square" style="background-color:${palette[i].color3}"></div>
        <div class="project-square" style="background-color:${palette[i].color4}"></div>
        <div class="project-square" style="background-color:${palette[i].color5}"></div>
      </div>
    `);
  }
}

$(document).ready(() => {
  refreshColors();
  fetchProjects();
});

$(document).on('keyup', (e) => {
  if (e.keyCode === 32 && e.target === document.body) {
    refreshColors();
  }
});

$('.color-container').on('click', '.color-div', function() {
  $(this).toggleClass('locked');
});
