const express = require('express');
const app = express();
const path = require('path');

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';

app.locals.projects = ['Rainbow', 'Christmas', 'StellaVia'];

app.locals.palettes = {
  Rainbow: [
    ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF'],
    ['#E01A4F', '#F15946', '#F9C22E', '#53B3CB', '#BF00FF'],
    ['#00FF00', '#FF00FF', '#FF0000', '#FFFF00', '#0000FF']
  ],
  Christmas: [['#E02F49', '#06213F', '#184925', '#3A7C4C', '#F0F0F0']],
  StellaVia: [['#000000', '#502F4C', '#666699', '#C8B8D8', '#F9F4F5']]
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public'));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on ${app.get('port')}`);
});

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;
  return response.status(201).json({ projects });
});

app.get('/api/v1/palettes/:project', (request, response) => {
  const { project } = request.params;
  const palettes = app.locals.palettes[project];

  console.log(project, palettes);
  return response.status(201).json({ palettes });
});