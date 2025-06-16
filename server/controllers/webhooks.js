// import { Webhook } from "svix";
// import User from "../models/User.js";

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     const evt = wh.verify(req.body, {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     const { data, type } = evt;

//     console.log("🔔 Clerk webhook triggered:", type);

//     if (type === "user.created") {
//       await User.create({
//         _id: data.id,
//         email: data.email_addresses[0].email_address,
//         name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//         image: data.image_url,
//         resume: "", // Default empty
//       });
//     }

//     if (type === "user.updated") {
//       await User.findByIdAndUpdate(data.id, {
//         email: data.email_addresses[0].email_address,
//         name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//         image: data.image_url,
//       });
//     }

//     if (type === "user.deleted") {
//       await User.findByIdAndDelete(data.id);
//     }

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.log("❌ Clerk Webhook Error:", error.message);
//     res.status(400).json({ success: false, message: "Webhook verification failed" });
//   }
// };
