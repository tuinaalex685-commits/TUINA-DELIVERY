import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { locationSchema } from '@/lib/validations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validation stricte Zod (anti-spoofing)
    const validationResult = locationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { latitude, longitude } = validationResult.data;

    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        latitude,
        longitude,
        lastLocationUpdate: new Date(),
      },
    });

    return NextResponse.json({ success: true, driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driver = await prisma.driver.findUnique({
      where: { id },
      select: { latitude: true, longitude: true, lastLocationUpdate: true },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json({ location: driver });
  } catch (error) {
    console.error('Error fetching driver location:', error);
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}
