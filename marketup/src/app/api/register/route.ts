import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import { sendWelcomeEmail } from "@/lib/mailer";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    console.log('Registration attempt started');
    
    const json = await request.json();
    console.log('Request data received:', { email: json.email, hasPassword: !!json.password });
    
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      console.log('Validation failed:', parsed.error);
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    
    const { email, password, referralCode } = parsed.data;
    console.log('Validated data:', { email, hasReferralCode: !!referralCode });
    
    // Test database connection
    console.log('Testing database connection...');
    const existing = await prisma.user.findUnique({ where: { email } });
    console.log('Database query successful, existing user:', !!existing);
    
    if (existing) {
      console.log('User already exists');
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    }
    
    console.log('Hashing password...');
    const passwordHash = await hash(password, 10);
    console.log('Password hashed successfully');
    
    console.log('Creating user in database...');
    const user = await prisma.user.create({ data: { email, passwordHash } });
    console.log('User created successfully:', { id: user.id, email: user.email });

    // Handle referral code if provided
    if (referralCode) {
      try {
        console.log('Processing referral code:', referralCode);
        
        // Find the referral code
        const referralCodeRecord = await prisma.referralCode.findUnique({
          where: { code: referralCode.toUpperCase() },
          include: { owner: true }
        });

        if (referralCodeRecord && referralCodeRecord.ownerId !== user.id) {
          // Check daily cap
          let canCreateReferral = true;
          if (referralCodeRecord.dailyCap) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayReferrals = await prisma.referralEvent.count({
              where: {
                referralCodeId: referralCodeRecord.id,
                createdAt: {
                  gte: today,
                  lt: tomorrow
                }
              }
            });

            if (todayReferrals >= referralCodeRecord.dailyCap) {
              canCreateReferral = false;
              console.log('Daily referral limit reached for this code');
            }
          }

          // Check total cap
          if (canCreateReferral && referralCodeRecord.maxRewardsTotal) {
            const totalReferrals = await prisma.referralEvent.count({
              where: {
                referralCodeId: referralCodeRecord.id,
                status: "APPROVED"
              }
            });

            if (totalReferrals >= referralCodeRecord.maxRewardsTotal) {
              canCreateReferral = false;
              console.log('Total referral limit reached for this code');
            }
          }

          if (canCreateReferral) {
            // Create referral event with automatic approval
            await prisma.referralEvent.create({
              data: {
                referrerId: referralCodeRecord.ownerId,
                referredUserId: user.id,
                referralCodeId: referralCodeRecord.id,
                status: "APPROVED",
                rewardGranted: 1
              }
            });
            console.log('Referral event created and approved automatically');
          } else {
            console.log('Referral code limits exceeded');
          }
        } else {
          console.log('Invalid referral code or self-referral');
        }
      } catch (error) {
        console.error('Error processing referral code:', error);
        // Don't fail registration if referral processing fails
      }
    }
    
    // Send welcome email
    try {
      console.log('Sending welcome email...');
      await sendWelcomeEmail(email, email.split('@')[0]);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail registration if email fails
    }
    
    console.log('Registration completed successfully');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: "server_error", 
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined 
    }, { status: 500 });
  }
}


