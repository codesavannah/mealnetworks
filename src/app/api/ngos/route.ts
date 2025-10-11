import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const codeGen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

const ngoSchema = z.object({
  name: z.string().min(2),
  registrationNumber: z.string().optional().or(z.literal("")),
  establishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  orgType: z.enum(["NGO", "Ashram", "Charitable Trust", "Other"]),
  registrationFileUrl: z.string().url().optional(),

  contactPerson: z.string().min(2),
  contactPhone: z.string().min(10).max(16),
  contactEmail: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),

  addressLine: z.string().min(3),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),

  serviceAreas: z.array(z.string()).optional(),
  capacityPerDay: z.number().int().optional(),
  preferredDonations: z.array(z.string()).optional(),

  idProofUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  infoValidityConfirm: z.boolean(),
  acceptedTerms: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ngoSchema.parse(body);
    const ngoCode = codeGen();

    const created = await prisma.nGO.create({
      data: {
        name: parsed.name,
        registrationNumber: parsed.registrationNumber || null,
        establishedYear: parsed.establishedYear ?? null,
        orgType: parsed.orgType,
        registrationFileUrl: parsed.registrationFileUrl || null,
        contactPerson: parsed.contactPerson,
        contactPhone: parsed.contactPhone,
        contactEmail: parsed.contactEmail,
        website: parsed.website || null,
        addressLine: parsed.addressLine,
        city: parsed.city || null,
        state: parsed.state || null,
        pincode: parsed.pincode || null,
        geoLat: parsed.geoLat,
        geoLng: parsed.geoLng,
        serviceAreas: parsed.serviceAreas ? JSON.stringify(parsed.serviceAreas) : null,
        capacityPerDay: parsed.capacityPerDay ?? null,
        preferredDonations: parsed.preferredDonations ? JSON.stringify(parsed.preferredDonations) : null,
        idProofUrl: parsed.idProofUrl || null,
        logoUrl: parsed.logoUrl || null,
        infoValidityConfirm: parsed.infoValidityConfirm,
        acceptedTerms: parsed.acceptedTerms,
        ngoCode,
      },
    });

    return NextResponse.json({ id: created.id, ngoCode }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


