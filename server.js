const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';

app.use(express.static(path.join(__dirname, 'public')));