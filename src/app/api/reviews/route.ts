import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(["Donor", "NGO", "Beneficiary", "Other"]),
  text: z.string().min(5),
  rating: z.number().int().min(1).max(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reviewSchema.parse(body);
    const created = await prisma.review.create({
      data: {
        name: parsed.name,
        email: parsed.email || null,
        role: parsed.role,
        reviewText: parsed.text,
        rating: parsed.rating,
        isApproved: false,
      },
    });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


