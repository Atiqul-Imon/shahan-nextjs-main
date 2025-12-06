import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendAppointmentEmail = async (data: {
  name: string;
  email: string;
  topic: string;
  details?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
}) => {
  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'shahan24h@gmail.com', // Send to Shahan's email
    subject: `New Appointment Request: ${data.topic}`,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Topic:</strong> ${data.topic}</p>
      ${data.details ? `<p><strong>Details:</strong> ${data.details}</p>` : ''}
      <p><strong>Requested Time:</strong> ${formatDate(data.startTime, data.timezone)}</p>
      <p><strong>Duration:</strong> ${Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000)} minutes</p>
      <p><strong>Timezone:</strong> ${data.timezone}</p>
      <hr>
      <p><em>This is a pending appointment request. Please confirm or reject it from your dashboard.</em></p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendAppointmentConfirmationEmail = async (data: {
  name: string;
  email: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  topic: string;
}) => {
  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Appointment Request Received - ${data.topic}`,
    html: `
      <h2>Thank you for your appointment request!</h2>
      <p>Hi ${data.name},</p>
      <p>I've received your appointment request for:</p>
      <p><strong>Topic:</strong> ${data.topic}</p>
      <p><strong>Requested Time:</strong> ${formatDate(data.startTime, data.timezone)}</p>
      <p><strong>Duration:</strong> ${Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000)} minutes</p>
      <p>I'll review your request and get back to you soon to confirm the appointment.</p>
      <p>Best regards,<br>Shahan Ahmed</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
