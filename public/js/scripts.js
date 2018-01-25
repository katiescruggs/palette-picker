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

let fetchedProjects;

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

  fetchedProjects = projects;

  projects.forEach(project => {
    displaySelectOption(project.title);
    fetchPalettes(project);
  });
};

const fetchPalettes = async (project) => {
  const paletteFetch = await fetch(`/api/v1/projects/${project.id}/palettes`);
  const paletteResults = await paletteFetch.json();
  const palette = paletteResults.results;

  displaySavedPalettes(project.title, palette);
};

const displaySelectOption = (projectTitle) => {
  $('#dropdown').append(`<option value=${projectTitle}>${projectTitle}</option>`);
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

const savePalette = () => {
  const projectTitle = $('#dropdown').val();
  const project = fetchedProjects.find(fetchedProj => fetchedProj.title === projectTitle);

  const title = $('#palette-input').val();
  const color1 = blocks[0].color;
  const color2 = blocks[1].color;
  const color3 = blocks[2].color;
  const color4 = blocks[3].color;
  const color5 = blocks[4].color;

  const paletteBody = { title, color1, color2, color3, color4, color5 };

  postPalette(paletteBody, project);
};

const postPalette = async (paletteBody, project) => {
  const initialPost = await fetch(`api/v1/projects/${project.id}/palettes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paletteBody)
  });

  const post = await initialPost.json();
  $('.display-projects').html('');
  fetchProjects();
  console.log(`${paletteBody.title} palette created in ${project.title}!`)
  }
};

const newProject = () => {

};

const postProject = () => {

};

const deletePalette = () => {

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

$('#save-palette-btn').on('click', savePalette);
