import { Webhook } from 'svix';
import User from '../models/user.js';

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

export default clerkWebhooks;
// This code handles Clerk webhooks, verifying the payload and processing user creation and deletion events.
// It uses the svix library to verify the webhook signature and updates the user database accordingly.  