// Debug file to test Clerk integration
import { auth, currentUser } from "@clerk/nextjs/server";

export async function testClerkAuth() {
  console.log("=== Clerk Auth Test ===");
  
  try {
    console.log("Testing auth()...");
    const authResult = await auth();
    console.log("Auth result:", { userId: authResult.userId, sessionId: authResult.sessionId });
    
    if (authResult.userId) {
      console.log("Testing currentUser()...");
      const user = await currentUser();
      console.log("Current user:", {
        id: user?.id,
        emailAddresses: user?.emailAddresses?.length || 0,
        firstName: user?.firstName,
        lastName: user?.lastName
      });
    }
  } catch (error) {
    console.error("Clerk auth test failed:", error);
  }
  
  console.log("=== End Clerk Auth Test ===");
}