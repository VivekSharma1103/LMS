import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import bodyParser from 'body-parser'; // ADD THIS
import clerkWebhooks from './controllers/webhooks.js';

const app = express();

// Connect to DB
await connectDB();

// Middleware
app.use(cors());

// Health check
app.get('/', (req, res) => {
  res.send('api is working');
});

// Middleware to parse raw body for Clerk webhooks
app.post('/clerk', bodyParser.raw({ type: '*/*' }), clerkWebhooks);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
