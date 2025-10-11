import nodemailer from 'nodemailer';
import { UserRole } from '@prisma/client';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Create transporter
const transporter = nodemailer.createTransporter({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export interface EmailUser {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface SessionEmailData {
  sessionId: string;
  donorName: string;
  receiverName: string;
  donorEmail: string;
  receiverEmail: string;
  donorPhone?: string;
  receiverPhone?: string;
  foodDescription?: string;
  quantity?: string;
}

// Welcome email template
function getWelcomeEmailTemplate(user: EmailUser): { subject: string; html: string } {
  const roleText = user.role === 'DONOR' ? 'Food Donor' : 'Food Receiver';
  
  return {
    subject: `Welcome to SajhaThali - Your ${roleText} Account is Approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">Welcome to SajhaThali!</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Congratulations! Your account as a <strong>${roleText}</strong> has been approved and is now active.</p>
        <p>You can now log in to your account and start ${user.role === 'DONOR' ? 'donating food to help those in need' : 'receiving food donations for your organization'}.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Next Steps:</h3>
          <ul>
            <li>Log in to your account using your email and password</li>
            <li>Complete your profile with additional details</li>
            <li>${user.role === 'DONOR' ? 'Browse nearby food receivers and start donating' : 'Wait for donation offers from generous donors'}</li>
          </ul>
        </div>
        <p>Thank you for joining our mission to reduce food waste and help those in need.</p>
        <p>Best regards,<br>The SajhaThali Team</p>
      </div>
    `
  };
}

// Session started email for donor
function getDonorSessionEmailTemplate(data: SessionEmailData): { subject: string; html: string } {
  return {
    subject: `Donation Session Started - ${data.sessionId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">Donation Session Active</h2>
        <p>Dear ${data.donorName},</p>
        <p>Your food donation session has been activated and is now in progress.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Session Details:</h3>
          <p><strong>Session ID:</strong> ${data.sessionId}</p>
          <p><strong>Receiver:</strong> ${data.receiverName}</p>
          <p><strong>Receiver Contact:</strong> ${data.receiverEmail}${data.receiverPhone ? ` | ${data.receiverPhone}` : ''}</p>
          ${data.foodDescription ? `<p><strong>Food Description:</strong> ${data.foodDescription}</p>` : ''}
          ${data.quantity ? `<p><strong>Quantity:</strong> ${data.quantity}</p>` : ''}
        </div>
        <p>Please coordinate with the receiver to complete the donation. You can track this session using the Session ID: <strong>${data.sessionId}</strong></p>
        <p>Thank you for your generous contribution!</p>
        <p>Best regards,<br>The SajhaThali Team</p>
      </div>
    `
  };
}

// Session started email for receiver
function getReceiverSessionEmailTemplate(data: SessionEmailData): { subject: string; html: string } {
  return {
    subject: `New Donation Available - ${data.sessionId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">New Food Donation Available</h2>
        <p>Dear ${data.receiverName},</p>
        <p>Great news! A new food donation session has been started for your organization.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Session Details:</h3>
          <p><strong>Session ID:</strong> ${data.sessionId}</p>
          <p><strong>Donor:</strong> ${data.donorName}</p>
          <p><strong>Donor Contact:</strong> ${data.donorEmail}${data.donorPhone ? ` | ${data.donorPhone}` : ''}</p>
          ${data.foodDescription ? `<p><strong>Food Description:</strong> ${data.foodDescription}</p>` : ''}
          ${data.quantity ? `<p><strong>Quantity:</strong> ${data.quantity}</p>` : ''}
        </div>
        <p>Please coordinate with the donor to arrange pickup or delivery. You can track this session using the Session ID: <strong>${data.sessionId}</strong></p>
        <p>Thank you for your important work in helping those in need!</p>
        <p>Best regards,<br>The SajhaThali Team</p>
      </div>
    `
  };
}

// Account blocked email
function getAccountBlockedEmailTemplate(user: EmailUser): { subject: string; html: string } {
  return {
    subject: 'SajhaThali Account - Access Temporarily Suspended',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Account Access Suspended</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>We regret to inform you that your SajhaThali account access has been temporarily suspended.</p>
        <p>If you believe this is an error or would like to appeal this decision, please contact our support team.</p>
        <p>We appreciate your understanding.</p>
        <p>Best regards,<br>The SajhaThali Team</p>
      </div>
    `
  };
}

// Account enabled email
function getAccountEnabledEmailTemplate(user: EmailUser): { subject: string; html: string } {
  return {
    subject: 'SajhaThali Account - Access Restored',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Account Access Restored</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Good news! Your SajhaThali account access has been restored and you can now log in normally.</p>
        <p>Thank you for your patience and continued participation in our platform.</p>
        <p>Best regards,<br>The SajhaThali Team</p>
      </div>
    `
  };
}

// Send welcome email
export async function sendWelcomeEmail(user: EmailUser): Promise<boolean> {
  try {
    const { subject, html } = getWelcomeEmailTemplate(user);
    
    await transporter.sendMail({
      from: SMTP_USER,
      to: user.email,
      subject,
      html,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Send session started emails
export async function sendSessionStartedEmails(data: SessionEmailData): Promise<boolean> {
  try {
    const donorTemplate = getDonorSessionEmailTemplate(data);
    const receiverTemplate = getReceiverSessionEmailTemplate(data);
    
    await Promise.all([
      transporter.sendMail({
        from: SMTP_USER,
        to: data.donorEmail,
        subject: donorTemplate.subject,
        html: donorTemplate.html,
      }),
      transporter.sendMail({
        from: SMTP_USER,
        to: data.receiverEmail,
        subject: receiverTemplate.subject,
        html: receiverTemplate.html,
      })
    ]);
    
    return true;
  } catch (error) {
    console.error('Error sending session emails:', error);
    return false;
  }
}

// Send account status change email
export async function sendAccountStatusEmail(user: EmailUser, status: 'BLOCKED' | 'APPROVED'): Promise<boolean> {
  try {
    const template = status === 'BLOCKED' 
      ? getAccountBlockedEmailTemplate(user)
      : getAccountEnabledEmailTemplate(user);
    
    await transporter.sendMail({
      from: SMTP_USER,
      to: user.email,
      subject: template.subject,
      html: template.html,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending account status email:', error);
    return false;
  }
}
