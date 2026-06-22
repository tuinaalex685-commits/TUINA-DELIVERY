import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=missing_token', req.url));
  }

  const agency = await prisma.agency.findFirst({
    where: { verificationToken: token }
  });

  if (!agency) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid_token', req.url));
  }

  // Marquer l'email comme vérifié
  await prisma.agency.update({
    where: { id: agency.id },
    data: { 
      emailVerified: new Date(),
      verificationToken: null // on supprime le token pour des raisons de sécurité
    }
  });

  // Connecter automatiquement l'utilisateur après validation
  const session = await encrypt({ agencyId: agency.id, email: agency.email });
  (await cookies()).set("session", session, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.redirect(new URL('/admin', req.url));
}
