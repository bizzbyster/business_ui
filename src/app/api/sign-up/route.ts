import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get("d");
  const c = await cookies();
  c.set("d", `${domain}`);
  redirect("/sign-up");
}
