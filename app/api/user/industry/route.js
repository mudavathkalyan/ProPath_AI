import { db } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = getAuth({ headers: req.headers }); 
    console.log("USERIS_OK"+userId)

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    if (!user || !user.industry) {
      return new Response(JSON.stringify({ industry: "Unknown" }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ industry: user.industry }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching industry:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }
    });
  }
}
