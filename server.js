const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

function checkRequirements(requestBody, requirements) {
  for (let requiredParameter of requirements) {
    if (!requestBody[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }
}

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public'));
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker running on ${app.get('port')}`);
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({ projects });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['title']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').insert(project, 'id')
    .then(projectId => {
      return response.status(201).json({ id: projectId[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      return response.status(200).json({ palettes });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.get('/api/v1/palettes/:project', (request, response) => {
  const { project } = request.params;
  const palettes = app.locals.palettes[project];

  console.log(project, palettes);
  return response.status(201).json({ palettes });
});