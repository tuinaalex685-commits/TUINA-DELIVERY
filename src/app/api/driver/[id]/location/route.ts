import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is the standard prisma import in the project. We'll adjust if necessary.

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Since Next.js 15, params is a promise. Assuming Next.js 15. If it fails, I'll fix it. Let's use `const { id } = await params;`
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
