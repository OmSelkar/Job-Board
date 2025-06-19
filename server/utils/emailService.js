// emailService.js
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY=process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID=process.env.EMAILJS_SERVICE_ID;

emailjs.init(EMAILJS_PUBLIC_KEY);

class EmailService {
  // Send welcome email to new user
  static async sendUserWelcomeEmail(userData) {
    const templateParams = {
      user_name: userData.name,
      user_email: userData.email,
      registration_date: new Date().toLocaleDateString(),
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_6mcma5b',
        templateParams
      );
      console.log('User welcome email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to send user welcome email:', error);
      throw error;
    }
  }

  

  // Send job application notification to recruiter
  static async sendJobApplicationNotification(applicationData) {
    const templateParams = {
      recruiter_name: applicationData.recruiterName,
      job_title: applicationData.jobTitle,
      applicant_name: applicationData.applicantName,
      applicant_email: applicationData.applicantEmail,
      application_date: new Date().toLocaleDateString(),
      to_email: applicationData.recruiterEmail,
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_z1qq7hk',
        templateParams
      );
      console.log('Job application notification sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to send job application notification:', error);
      throw error;
    }
  }

  
}

export default EmailService;