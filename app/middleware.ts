import admin from "@/lib/firebaseAdmin"; 

export function verifyUser(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    return admin.auth().verifyIdToken(token); // Verify token using Admin SDK
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
