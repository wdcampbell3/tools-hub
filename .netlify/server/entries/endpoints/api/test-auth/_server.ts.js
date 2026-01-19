import { j as json } from "../../../../chunks/index2.js";
import { a as adminAuth } from "../../../../chunks/firebase-admin.server.js";
const POST = async ({ request }) => {
  try {
    const { action, email, password } = await request.json();
    if (action === "create-test-user") {
      const testEmail = email || `test-${Date.now()}@example.com`;
      const testPassword = password || "TestPassword123!";
      try {
        const userRecord = await adminAuth.createUser({
          email: testEmail,
          password: testPassword,
          emailVerified: false,
          disabled: false
        });
        return json({
          success: true,
          message: "Test user created successfully",
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            createdAt: userRecord.metadata.creationTime
          },
          credentials: {
            email: testEmail,
            password: testPassword
          }
        });
      } catch (createError) {
        if (createError.code === "auth/email-already-exists") {
          const existingUser = await adminAuth.getUserByEmail(testEmail);
          return json({
            success: true,
            message: "Test user already exists",
            user: {
              uid: existingUser.uid,
              email: existingUser.email,
              createdAt: existingUser.metadata.creationTime
            },
            note: "User was already created"
          });
        }
        throw createError;
      }
    }
    if (action === "list-users") {
      const listUsersResult = await adminAuth.listUsers(10);
      return json({
        success: true,
        userCount: listUsersResult.users.length,
        users: listUsersResult.users.map((user) => ({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          disabled: user.disabled,
          createdAt: user.metadata.creationTime
        }))
      });
    }
    if (action === "delete-test-user" && email) {
      try {
        const user = await adminAuth.getUserByEmail(email);
        await adminAuth.deleteUser(user.uid);
        return json({
          success: true,
          message: `User ${email} deleted successfully`
        });
      } catch (deleteError) {
        if (deleteError.code === "auth/user-not-found") {
          return json({
            success: true,
            message: "User not found (may already be deleted)"
          });
        }
        throw deleteError;
      }
    }
    return json(
      {
        success: false,
        error: "Invalid action"
      },
      { status: 400 }
    );
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error
      },
      { status: 500 }
    );
  }
};
const GET = async () => {
  try {
    const listUsersResult = await adminAuth.listUsers(10);
    return json({
      success: true,
      message: "Firebase Authentication is working",
      userCount: listUsersResult.users.length,
      users: listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
        lastSignIn: user.metadata.lastSignInTime
      }))
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
export {
  GET,
  POST
};
