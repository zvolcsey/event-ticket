import app from './app';

const port = process.env.API_PORT || 8080;

app.listen(port, () => {
  console.log('Server listening on port 8080');
});