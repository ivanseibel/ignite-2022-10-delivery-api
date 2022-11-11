import { app, initializeDatabase } from './app';

initializeDatabase().then(() => {
  app.listen(3333, () => console.log('Server is running!'));
});
