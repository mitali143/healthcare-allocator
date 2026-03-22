const express = require('express');
const cors = require('cors');
require('dotenv').config();

const patientsRouter = require('./routes/patients');
const resourcesRouter = require('./routes/resources');
const allocateRouter = require('./routes/allocate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/allocate', allocateRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Healthcare Allocator API is running!' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});