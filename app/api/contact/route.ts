import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// POST - Contact form submission
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Create email content
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
          <p style="color: #f0f8ff; margin: 10px 0 0 0;">ZEVANY Jewelry Store</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #667eea;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #667eea;">Email:</strong> ${email}</p>
            ${phone ? `<p style="margin: 10px 0;"><strong style="color: #667eea;">Phone:</strong> ${phone}</p>` : ''}
            ${subject ? `<p style="margin: 10px 0;"><strong style="color: #667eea;">Subject:</strong> ${subject}</p>` : ''}
          </div>
          
          <h3 style="color: #333; margin-top: 25px;">Message</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
            <p style="margin: 0; line-height: 1.6; color: #555;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 12px;">
              Sent from ZEVANY Jewelry Store Contact Form<br>
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `;
    
    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
          <p style="color: #f0f8ff; margin: 10px 0 0 0;">ZEVANY Jewelry Store</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hi ${name},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to ZEVANY Jewelry Store. We have received your message and will get back to you within 24 hours.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            ${subject ? `<p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Our team of jewelry experts will review your inquiry and provide you with the best assistance possible.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'https://zevany-store.vercel.app'}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Continue Shopping
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
              <strong>ZEVANY Jewelry Store</strong><br>
              Email: ${process.env.ADMIN_EMAIL || 'zevanyjewels@gmail.com'}<br>
              Website: <a href="${process.env.CLIENT_URL || 'https://zevany-store.vercel.app'}" style="color: #667eea;">zevany-store.vercel.app</a>
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Send email to admin
    await transporter.sendMail({
      from: `"ZEVANY Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'zevanyjewels@gmail.com',
      subject: `New Contact Form: ${subject || 'General Inquiry'}`,
      html: adminEmailContent
    });
    
    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"ZEVANY Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting ZEVANY Jewelry Store',
      html: customerEmailContent
    });
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
