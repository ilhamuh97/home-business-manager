import errorHandler from 'errorhandler';
import app from './app';
/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  return console.log(`Server is listening on ${app.get('port')}`);
});
