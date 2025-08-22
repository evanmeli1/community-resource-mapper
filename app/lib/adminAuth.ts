import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { isAdmin: false, user: null };
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  return { 
    isAdmin: user?.role === "admin", 
    user 
  };
}
