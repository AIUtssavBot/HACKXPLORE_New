import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { UserRole } from '@/models/User';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only SuperAdmin can approve events
    if (session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action } = await request.json();
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await connectToDatabase();

    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'pending') {
      return NextResponse.json(
        { error: 'Event has already been processed' },
        { status: 400 }
      );
    }

    event.status = action === 'approve' ? 'approved' : 'rejected';
    event.approvedBy = session.user.id;
    await event.save();

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error processing event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 