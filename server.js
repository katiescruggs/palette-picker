const express = require('express');
const app = express();
const path = require('path');

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';

app.locals.projects = ['Rainbow'];

app.locals.palettes = {
  Rainbow: ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF'],
  Christmas: [],
  'Ugly Colors': []
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
  return response.status(201).json({ palettes });
});