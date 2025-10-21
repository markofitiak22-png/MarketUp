import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
}

export function createWelcomeEmail(userName: string): EmailTemplate {
  return {
    subject: "Welcome to MarketUp! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MarketUp</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); min-height: 100vh;">
        <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%); border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; font-size: 24px; font-weight: 700; margin: 0;">
              Welcome to MarketUp!
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">
              AI Avatar Video Marketing
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
              Hello ${userName}! 👋
            </h2>
            <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
              Welcome to MarketUp! You can now start creating amazing AI avatar videos for your marketing campaigns.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 24px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}/studio" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                Start Creating Videos
              </a>
            </div>

            <p style="color: #a1a1aa; font-size: 14px; margin: 20px 0 0 0;">
              Need help? Contact our support team anytime.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: rgba(0, 0, 0, 0.2); padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
            <p style="color: #71717a; font-size: 12px; margin: 0; text-align: center;">
              This email was sent by MarketUp
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

export function createPasswordResetEmail(code: string): EmailTemplate {
  return {
    subject: "Your MarketUp password reset code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your MarketUp password</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); min-height: 100vh;">
        <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%); border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; font-size: 24px; font-weight: 700; margin: 0;">
              Password Reset Code
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">
              MarketUp
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            <p style="color: #ffffff; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
              Use this code to reset your password:
            </p>
            
            <!-- OTP Code -->
            <div style="text-align: center; margin: 24px 0;">
              <div style="background: rgba(99, 102, 241, 0.1); border: 2px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 12px 0;">Your reset code:</p>
                <div style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 28px; font-weight: 700; padding: 16px 24px; border-radius: 8px; letter-spacing: 4px; font-family: monospace; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);">
                  ${code}
                </div>
              </div>
            </div>

            <!-- Security Info -->
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; margin: 20px 0; backdrop-filter: blur(10px);">
              <p style="color: #10b981; font-size: 14px; margin: 0;">
                ⏰ This code expires in 10 minutes
              </p>
            </div>

            <p style="color: #a1a1aa; font-size: 14px; margin: 20px 0 0 0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: rgba(0, 0, 0, 0.2); padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
            <p style="color: #71717a; font-size: 12px; margin: 0; text-align: center;">
              This email was sent by MarketUp
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

export async function sendEmail(to: string, template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM || "MarketUp <onboarding@resend.dev>",
      to: [to],
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data?.id);
    return data;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
