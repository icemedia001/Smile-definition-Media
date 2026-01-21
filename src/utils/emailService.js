import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendBookingNotification = async (bookingDetails) => {
    try {
        const templateParams = {
            name: bookingDetails.userName,
            email: bookingDetails.userEmail,
            phone: bookingDetails.userPhone || 'Not provided',
            title: `New Booking worth €${bookingDetails.totalAmount}`,
            message: `
                New booking received!
                
                Client: ${bookingDetails.userName} (${bookingDetails.userEmail})
                Phone: ${bookingDetails.userPhone || 'Not provided'}
                Event Date: ${bookingDetails.eventDate || 'Not specified'}
                
                Total Amount: €${bookingDetails.totalAmount}
                
                Items:
                ${bookingDetails.items.map(item => `- ${item.packageTitle} (${item.tier.name})`).join('\n')}
            `
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Email sent successfully!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

export const sendBookingStatusEmail = async (bookingDetails, status, message) => {
    try {
        const STATUS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID;

        const templateParams = {
            user_name: bookingDetails.userName,
            user_email: bookingDetails.userEmail,
            status: status.toUpperCase(),
            message: message || 'No additional details provided.',
            title: `Booking Update: ${status.toUpperCase()}`
        };

        const response = await emailjs.send(SERVICE_ID, STATUS_TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Status email sent successfully!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('Failed to send status email:', error);
        return false;
    }
};
