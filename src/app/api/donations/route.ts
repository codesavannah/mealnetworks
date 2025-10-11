import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const refGen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

const donationSchema = z.object({
  donorName: z.string().min(2),
  phone: z.string().min(10).max(16),
  email: z.string().email().optional().or(z.literal("")),
  aadhaarNumber: z.string().min(4).max(20).optional().or(z.literal("")),
  addressLine: z.string().min(3),
  city: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  foodTypes: z.array(z.string()).nonempty(),
  numberOfItems: z.number().int().optional(),
  description: z.string().optional().or(z.literal("")),
  quantityServings: z.number().int().optional(),
  preparedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  preferredPickupSlot: z.enum(["Morning", "Afternoon", "Evening", "ASAP"]).optional(),
  deliveryPossible: z.boolean().default(false),
  specialInstructions: z.string().optional().or(z.literal("")),
  photoUrl: z.string().url().optional(),
  safetyConfirmed: z.boolean(),
  acceptedTerms: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = donationSchema.parse(body);
    const referenceCode = refGen();

    const created = await prisma.donation.create({
      data: {
        donorName: parsed.donorName,
        phone: parsed.phone,
        email: parsed.email || null,
        aadhaarNumber: parsed.aadhaarNumber || null,
        addressLine: parsed.addressLine,
        city: parsed.city || null,
        pincode: parsed.pincode || null,
        geoLat: parsed.geoLat,
        geoLng: parsed.geoLng,
        foodTypes: parsed.foodTypes,
        numberOfItems: parsed.numberOfItems ?? null,
        description: parsed.description || null,
        quantityServings: parsed.quantityServings ?? null,
        preparedAt: parsed.preparedAt ? new Date(parsed.preparedAt) : null,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        preferredPickupSlot: parsed.preferredPickupSlot ?? null,
        deliveryPossible: parsed.deliveryPossible,
        specialInstructions: parsed.specialInstructions || null,
        photoUrl: parsed.photoUrl || null,
        safetyConfirmed: parsed.safetyConfirmed,
        acceptedTerms: parsed.acceptedTerms,
        referenceCode,
      },
    });

    return NextResponse.json({ id: created.id, referenceCode }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


