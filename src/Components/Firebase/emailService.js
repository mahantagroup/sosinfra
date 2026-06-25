import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

export const sendCredentialsViaEmail = async (email, password, fullName) => {
  const loginUrl = `${window.location.origin}/agent/login`;
  const recipient = email.trim().toLowerCase();

  const templateParams = {
    user_email: recipient,
    to_email: recipient,
    email: recipient,
    user_name: fullName || 'Partner',
    login_id: recipient,
    password: String(password),
    login_url: loginUrl,
    from_name: 'SOS Infrabulls',
    message: `Your Agent Panel Login ID is ${recipient} and Password is ${password}. Login at ${loginUrl}`,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return { success: true, email: recipient, response };
  } catch (error) {
    const detail = error?.text || error?.message || 'Unknown error';
    console.error('Email delivery failed:', detail, error);
    return { success: false, error: detail, email: recipient };
  }
};
