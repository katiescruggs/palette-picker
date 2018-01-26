// import express from npm module
const express = require('express');

// import bodyParser from npm module
const bodyParser = require('body-parser');

// import path from npm module
const path = require('path');

// declare variable app and assign value to instance of express
const app = express();

// declare variable environment and set value to node environment environment variable (if it exists) or string development
const environment = process.env.NODE_ENV || 'development';

// declare variable configuration as property environment of object returned from importing configuration file
const configuration = require('./knexfile')[environment];

// declare variable database as evaluation of running function from import knex with parameter configuration
const database = require('knex')(configuration);


// helper function checkRequirements takes in 3 parameters
function checkRequirements(requestBody, requirements, response) {
  // for each of the required parameters in the requirements array
  for (let requiredParameter of requirements) {
    // if the requestBody object does NOT have the required parameter
    if (!requestBody[requiredParameter]) {
      // return object of missing true and the requiredParameter that is missing
      return { missing: true, requiredParameter }
    }
  }
  // if no parameters are missing, return object of missing property set to false
  return { missing: false };
}

// set the port of the app to the environment variable of PORT (assigned by Heroku) or localhost 3000
app.set('port', process.env.PORT || 3000);

// apply bodyParser middleware to app so that the post request bodies are parsed correctly
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apply middleware to tell the app to go into public directory and send back index.html at root url
app.use(express.static(path.join(__dirname, 'public')));

// assign variable httpServer to evaluation of app.listen (Watts helped me with this)
// app.listen tells the server to run on the port
const httpServer = app.listen(app.get('port'), () => {
  // helpful console.log sent to terminal when the server is running
  console.log(`Palette Picker running on ${app.get('port')}`);
});

// when the user goes to root url, send back the index.html file
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public'));
});

// when the user goes to endpoint /api/v1/projects
app.get('/api/v1/projects', (request, response) => {
  // select everything from table projects in the database
  database('projects').select()
    .then(projects => {
      // return all of those projects in a json to the user with status 200
      return response.status(200).json({ results: projects });
    })
    .catch(error => {
      // if there's an error, send back status 500 with the error
      return response.status(500).json({ error });
    })
});

//when the user posts to endpoint /api/v1/projects
app.post('/api/v1/projects', (request, response) => {
  // assign variable project to the value of the user's request body
  const project = request.body;

  // run my checkRequirements helper function to see if there are missing parameters
  const check = checkRequirements(project, ['title'], response);

  // if there is a missing parameter
  if (check.missing) {
    // return a helpful error message to the user letting them know what's missing
    return response.status(422).json({
        error: `You are missing the required parameter ${check.requiredParameter}`
    });
  }

  // check if there is already a project with that title
  database('projects').where('title', project.title).select()
    .then(result => {
      // if there is already a project with that title
      if (result.length) {
        // return error message to the user
        return response.status(422).json({
          error: `Sorry, a project with the title ${project.title} already exists!`
        })
        // otherwise
      } else {
        // insert new project from the user's request body into the database and return the project id
        database('projects').insert(project, 'id')
          .then(projectId => {
            // return a successful status to the user along with a json of the projectId
            return response.status(201).json({ id: projectId[0] });
          })
          // if there is an error, return it the user and let them know it was internal server error
          .catch(error => {
            return response.status(500).json({ error });
          })
      }
    })

});

// if user sends get request to /api/v1/projects/:projectId/palettes
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  // assign variable projectId from the url parameter
  const { projectId } = request.params;

  // go into the palettes table where the project Id equals the projectId in the url
  database('palettes').where('project_id', projectId).select()
    .then(palettes => {
      // if there are palettes there
      if (palettes.length) {
        // return those palettes to the user with successful status code
        return response.status(200).json({ results: palettes });
      }
    })
    // if there is an error, return 404 because the project doesn't exist
    .catch(error => {
      return response.sendStatus(404);
    })
});

// when user sends post request to /api/v1/projects/:projectId/palettes
app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  // assign projectId from url
  const { projectId } = request.params;
  // assign palettes variable from request body and projectId
  const palettes = Object.assign({}, request.body, { project_id: projectId });

  // run helper function to check if all parameters are there
  const check = checkRequirements(palettes, ['title', 'color1', 'color2', 'color3', 'color4', 'color5'], response);

  // if there is a missing parameter
  if (check.missing) {
    // return helpful error message to the user
    return response.status(422).json({
        error: `You are missing the required parameter ${check.requiredParameter}`
    });
  }

  // otherwise go into palettes table and insert new palette and return palette id
  database('palettes').insert(palettes, 'id')
    .then(palettesId => {
      // return successful status code with json paletteId
      return response.status(201).json({ id: palettesId[0] });
    })
    // if there is an error, return the error with internal servor error status 500
    .catch(error => {
      return response.status(500).json({ error });
    })
});

// when user sends delete request to /api/v1/projects/:projectId/palettes/:paletteId
app.delete('/api/v1/projects/:projectId/palettes/:paletteId', (request, response) => {
  // assign variables projectId, paletteId based on parameters in the url
  const { projectId, paletteId } = request.params;

  // go into database palettes where the projectId matches the url parameter
  // and also where paletteId matches the url parameter
  database('palettes').where('project_id', projectId).where('id', paletteId).delete()
    .then(data => {
      // if successful, return successful status to user
      return response.status(204).json({ data });
    })
    // if there is an error, send that to the user with internal servor error code 500
    .catch(error => {
      return response.status(500).json({ error });
    })
});

// export httpServer so that it can be tested in routes.spec.js
module.exports = httpServer;

