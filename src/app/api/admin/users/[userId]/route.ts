import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getUserFromRequest, requireRole } from '../../../../../lib/auth';
import { sendWelcomeEmail, sendAccountStatusEmail } from '../../../../../lib/email';
import { UserStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!requireRole(user, ['SUPERADMIN'])) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { userId } = await context.params;

    // Get full user details
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        aadhaarNumber: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        latitude: true,
        longitude: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        approvedAt: true
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: targetUser
    });

  } catch (error) {
    console.error('Get user details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!requireRole(user, ['SUPERADMIN'])) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { action } = await request.json();
    const { userId } = await context.params;

    if (!['approve', 'reject', 'block', 'enable'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent actions on SUPERADMIN
    if (targetUser.role === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Cannot modify SUPERADMIN account' },
        { status: 403 }
      );
    }

    let newStatus: UserStatus;
    let shouldSendEmail = false;
    let emailType: 'APPROVED' | 'BLOCKED' | null = null;

    switch (action) {
      case 'approve':
        if (targetUser.status !== 'PENDING') {
          return NextResponse.json(
            { error: 'User is not pending approval' },
            { status: 400 }
          );
        }
        newStatus = 'APPROVED';
        shouldSendEmail = true;
        emailType = 'APPROVED';
        break;
      
      case 'reject':
        if (targetUser.status !== 'PENDING') {
          return NextResponse.json(
            { error: 'User is not pending approval' },
            { status: 400 }
          );
        }
        newStatus = 'REJECTED';
        break;
      
      case 'block':
        if (targetUser.status !== 'APPROVED') {
          return NextResponse.json(
            { error: 'User is not approved' },
            { status: 400 }
          );
        }
        newStatus = 'BLOCKED';
        shouldSendEmail = true;
        emailType = 'BLOCKED';
        break;
      
      case 'enable':
        if (targetUser.status !== 'BLOCKED') {
          return NextResponse.json(
            { error: 'User is not blocked' },
            { status: 400 }
          );
        }
        newStatus = 'APPROVED';
        shouldSendEmail = true;
        emailType = 'APPROVED';
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: newStatus,
        approvedAt: newStatus === 'APPROVED' ? new Date() : null
      }
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: user!.id,
        targetUserId: userId,
        action: action.toUpperCase(),
        details: `Changed user status from ${targetUser.status} to ${newStatus}`
      }
    });

    // Send email notification
    if (shouldSendEmail && emailType) {
      try {
        if (emailType === 'APPROVED') {
          await sendWelcomeEmail({
            email: targetUser.email,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            role: targetUser.role
          });
        } else {
          await sendAccountStatusEmail({
            email: targetUser.email,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            role: targetUser.role
          }, emailType);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: `User ${action}ed successfully`,
      user: {
        id: updatedUser.id,
        status: updatedUser.status
      }
    });

  } catch (error) {
    console.error('Admin user action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
