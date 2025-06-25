import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser'; // ✅ Required for raw body
import connectDB from './configs/mongodb.js';
import clerkWebhooks from './controllers/webhooks.js';

const app = express();

// DB Connect
await connectDB();

// Middleware
app.use(cors());

// Health route
app.get('/', (req, res) => {
  res.send('API working');
});

// ✅ Raw body ONLY for /clerk route
app.post('/clerk', bodyParser.raw({ type: '*/*' }), clerkWebhooks);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
