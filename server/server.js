import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser'; // ✅ Required for raw body
import connectDB from './configs/mongodb.js';
import clerkWebhooks, { stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// DB Connect
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(clerkMiddleware())

// Health route
app.get('/', (req, res) => {
  res.send('API working');
});

// ✅ Raw body ONLY for /clerk route
app.post('/clerk', bodyParser.raw({ type: '*/*' }), clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)

app.use('/api/user', express.json(), userRouter);
app.post('/stripe',express.raw({type: 'application/json'}), stripeWebhooks);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
