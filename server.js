const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

function checkRequirements(requestBody, requirements, response) {
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

app.listen(app.get('port'), () => {
  console.log(`Palette Picker running on ${app.get('port')}`);
});

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public'));
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({ results: projects });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  checkRequirements(project, ['title'], response);

  database('projects').insert(project, 'id')
    .then(projectId => {
      return response.status(201).json({ id: projectId[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  const { projectId } = request.params;

  database('palettes').where('project_id', projectId).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json({ results: palettes });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  const { projectId } = request.params;
  const palettes = Object.assign({}, request.body, { project_id: projectId });

  checkRequirements(palettes, ['title', 'color1', 'color2', 'color3', 'color4', 'color5'], response);

  database('palettes').insert(palettes, 'id')
    .then(palettesId => {
      return response.status(201).json({ id: palettesId[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.delete('/api/v1/projects/:projectId/palettes/:paletteId', (request, response) => {
  const { projectId, paletteId } = request.params;

  database('palettes').where('project_id', projectId).where('id', paletteId).del()
    .then(data => {
      return response.status(204).json({ data });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

