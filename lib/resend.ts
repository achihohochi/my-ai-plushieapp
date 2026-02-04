import { Resend } from 'resend';

// Initialize Resend client
// API key is loaded from environment variable RESEND_API_KEY
export const resend = new Resend(process.env.RESEND_API_KEY);
