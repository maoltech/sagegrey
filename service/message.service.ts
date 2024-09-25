import axios from 'axios';
import { TERMI_API_KEY, MAILGUN_API_KEY, MAILGUN_DOMAIN, TERMI_SENDER_ID, SENDER_EMAIL, MAILGUN_API_URL } from '../constants/environments'
import Mailgun from 'mailgun.js';
import formData from 'form-data';
class Messages {

    constructor() {

    }

    public sendOTPMessage = async (message: string, phone: string) => {
        try {
            const termiiResponse = await axios.post(
                'https://termii.com/api/sms/send',
                {
                    to: phone,
                    from: process.env.TERMI_SENDER_ID as string,
                    sms: message,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Api-Key': process.env.TERMI_API_KEY as string
                    },
                }
            );
            console.log(termiiResponse.data);
        } catch (error: any) {
            console.error('Error sending OTP via Termii:', error.message);
        }
    };

    public sendMail = async (text: string, to: string, subject: string) => {
        
        try {
            
            const mailgunResponse = await axios.post(
                `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN as string}/messages`,
                {
                    from: "noreply@sage-grey.com",
                    to,
                    subject,
                    text
                },
                {
                    auth: {
                        username: 'api',
                        password: process.env.MAILGUN_API_KEY as string,
                    },
                }
            );
            console.log(mailgunResponse.data);
            return mailgunResponse.data;


        } catch (error: any) {
            console.log(error.message);
            console.error('Error sending mail via Mailgun:', error.message);
            throw error
        }
    };

    public sendMailP = async(text: string, to: string, subject: string) => {
        try{
            const mailgun = new Mailgun(formData);
            const mg = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY as string,
            });

            const emailData = {
                from:process.env.SENDER_EMAIL as string,
                to,
                subject,
                html: text
            };
            return await mg.messages.create(process.env.MAILGUN_DOMAIN as string, emailData);
        }catch(err: any){
            console.log(err.message)
            throw err

        }
        
    }
}


export const messages = new Messages();