
exports.seed = function(knex, Promise) {
  
  return knex('palettes').del()
  .then(() => knex('projects').del())

  //Now we can insert seed data

  .then(function () {
    return Promise.all([
      knex('projects').insert({
        title: 'Rainbow'
      }, 'id')

      .then(projectId => {
        return knex('palettes').insert([
          { title: 'RainOne', project_id: projectId[0], color1: '#FF0000', color2: '#FFFF00', color3: '#00FF00', color4: '#0000FF', color5: '#FF00FF'},
          { title: 'RainTwo', project_id: projectId[0], color1: '#E01A4F', color2: '#F15946', color3: '#F9C22E', color4: '#53B3CB', color5: '#BF00FF'},
          { title: 'RainThree', project_id: projectId[0], color1: '#00FF00', color2: '#FF00FF', color3: '#FF0000', color4: '#FFFF00', color5: '#0000FF'}
        ])
      })

      .then(() => console.log('Seeding complete'))
      .catch(error => console.log('Error seeding data: ', error))
    ]) //end Promise.all
  });
};
