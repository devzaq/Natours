require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 🔥Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const localDB = process.env.DATABASELOCAL;
mongoose
  .connect(localDB)
  .then((con) => console.log('Database connected successfully.'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('App running on port ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTIONS 🔥Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
