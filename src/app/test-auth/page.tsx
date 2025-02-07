// src/app/test-auth/page.tsx
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function TestAuthPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/unauthorized");
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Protected Page</h1>
      <p>If you can see this, you are logged in!</p>
      <p>Your user ID is: {user.id}</p>
    </div>
  );
}