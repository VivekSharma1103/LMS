import { clerkClient } from "@clerk/express";

//Middleare to check if user is authenticated and has educator role
 const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "User not found",
      });                           
    }     }
    catch (error) {    
        res.json({
          success: false,
          message: error.message,
        });
     }}

     export default protectEducator;