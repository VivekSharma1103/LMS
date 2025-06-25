import { Webhook } from 'svix';
import User from '../models/user.js';
import Stripe from 'stripe';
import { Purchase } from '../models/Purchase.js';
import Course from '../models/Course.js';

 const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; 
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = await wh.verify(payload, headers); // ✅ Correct usage

    const { data, type } = evt;

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true });
        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ message: 'Event ignored' });
    }
  } catch (error) {
    console.error('Webhook Error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request,response)=>{
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': { 
            const paymentIntent = event.data.object; // contains a stripe payment intent object
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
                
            })
            const {purchaseId} = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            courseData.enrolledStudents.push(userData)
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = 'completed';
            await purchaseData.save();

            console.log('PaymentIntent was successful!', paymentIntent);
            
            break;
        }
        case 'payment_intent.payment_failed':{ 
            const paymentIntent = event.data.object; // contains a stripe payment intent object
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {purchaseId} = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = 'failed'; 
            await purchaseData.save();
            break;
        }
            default:{
            console.log(`Unhandled event type ${event.type}`);
            break;
        }
}
}

export default clerkWebhooks;

// This code handles Clerk webhooks, verifying the payload and processing user creation and deletion events.
// It uses the svix library to verify the webhook signature and updates the user database accordingly.  