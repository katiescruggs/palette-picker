const chai = require('chai');
const should = chai.should('should');
const chaiHttp = require('chai-http');
const server = require('../server');

const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  afterEach(done => {
    server.close(done);
  });

  it('should return the homepage', () => {

    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    })
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/doesnotexist')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(error => {
      throw error;
    })
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    knex.seed.run()
    .then(() => done())
  });

  afterEach(done => {
    server.close(done);
  });

  describe('GET /api/v1/projects', () => {

    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.results.should.be.a('array');
        response.body.results[0].should.have.property('id');
        response.body.results[0].should.have.property('title');
        response.body.results[0].should.have.property('created_at');
        response.body.results[0].should.have.property('updated_at');
      })
    })
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        title: 'Test-Project'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
      })
      .catch(error => {
        throw error;
      })
    });

    it('should not create a record with missing data', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({not: 'right'})
      .then(response => {
        response.should.have.status(422);
      })
    });
  });

  describe('GET /api/v1/projects/:projectId/palettes', () => {
    it('should return the palettes for one project', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        return response.body.results[0].id
      })
      .then(id => {
        return chai.request(server)
        .get(`/api/v1/projects/${id}/palettes`)
        .then(response => {
          response.should.have.status(200);
        })
        .catch(error => {
          throw error;
        })
      })
    });

    it('should return a 404 if the project is not found', () => {
      return chai.request(server)
      .get('/api/v1/projects/1000000000000/palettes')
      .then(response => {
        response.should.have.status(404);
      })
    });
  });

  describe('POST /api/v1/projects/:projectId/palettes', () => {
    it('should create a palette', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        return response.body.results[0].id
      })
      .then(id => {
        return chai.request(server)
        .post(`/api/v1/projects/${id}/palettes`)
        .send({
          title: "test-palette",
          color1: "red",
          color2: "blue",
          color3: "yellow",
          color4: "green",
          color5: "magenta"
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
        })
        .catch(error => {
          throw error;
        })
      })
    });

    it('should return error if title parameter is missing', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          return response.body.results[0].id
        })
        .then(id => {
          return chai.request(server)
          .post(`/api/v1/projects/${id}/palettes`)
          .send({
            color1: "red",
            color2: "blue",
            color3: "yellow",
            color4: "green",
            color5: "magenta"
          })
          .then(response => {
            response.should.have.status(422);
            response.should.be.json;
            response.should.be.a('object');
            response.should.have.property('error');
            response.body.error.should.equal('You are missing the required parameter title');
          })
        })

    });

    it('should return error if color1 parameter is missing', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          return response.body.results[0].id
        })
        .then(id => {
          return chai.request(server)
          .post(`/api/v1/projects/${id}/palettes`)
          .send({
            title: "Title",
            color2: "blue",
            color3: "yellow",
            color4: "green",
            color5: "magenta"
          })
          .then(response => {
            response.should.have.status(422);
            response.should.be.json;
            response.should.be.a('object');
            response.should.have.property('error');
            response.body.error.should.equal('You are missing the required parameter color1');
          })
        })
    });
  });

  describe('DELETE /api/v1/projects/:projectId/palettes/:paletteId', () => {
    it.skip('should delete a palette', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          return response.body.results[0].id
        })
        .then(id => {
          return chai.request(server)
          .get(`/api/v1/projects/${id}/palettes`)
          .then(response => {
            const ids = { projectId: id, paletteId: response.body.results[0].id };
            return ids;
          })
          .then(ids => {
            return chai.request(server)
            .delete(`api/v1/projects/${ids.projectId}/palettes/${ids.paletteId}`)
            .then(response => {
              response.should.have.status(204)
            })
          })
          
          .catch(error => {
            throw error;
          })
        })
      
    });
  });


});

