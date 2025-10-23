import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import { sendWelcomeEmail } from "@/lib/mailer";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
    
    const { email, password } = parsed.data;
    console.log('Validated data:', { email });
    
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
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: "server_error", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}


