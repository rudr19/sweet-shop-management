import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    try {
      await pool.query('SELECT NOW()');
      console.log('Database connection successful');
    } catch (dbError) {
      console.warn('Database connection failed, but starting server anyway:', dbError);
      console.warn('Please check your database credentials in .env file');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
