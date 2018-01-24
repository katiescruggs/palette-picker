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
  const projects = await projectsFetch.json();

  console.log(projects.projects);
  fetchPalettes(projects.projects);
};

const fetchPalettes = async (projects) => {
  const unresolvedPalettes = projects.map(async (project) => {
    const paletteFetch = await fetch(`/api/v1/palettes/${project}`);
    const paletteObj = await paletteFetch.json();
    return { [project]: paletteObj.palettes };
  });

  const palettes = await Promise.all(unresolvedPalettes);
  displaySavedPalettes(palettes);
};

const displaySavedPalettes = (palettes) => {
  palettes.forEach(palette => {
    const project = Object.keys(palette);

    $('.display-projects').append(`
      <h3>${Object.keys(palette)}</h3>
      <div class="square-holder">
        <div class="project-square" style="background-color:${palette[project][0]}"></div>
        <div class="project-square" style="background-color:${palette[project][1]}"></div>
        <div class="project-square" style="background-color:${palette[project][2]}"></div>
        <div class="project-square" style="background-color:${palette[project][3]}"></div>
        <div class="project-square" style="background-color:${palette[project][4]}"></div>
      </div>
    `);
  });
};

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
