import speakeasy from 'speakeasy';
import { messages } from './message.service';

class TwoFA{

    
    public CreateTwoFA = async(userMail: string, secret: any ) => {
        console.log({userMail, secret})
        const token = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            step: 600
        });

        console.log({token});

        const message = `Your OTP (One-Time Password) for verification is: ${token}`;

        messages.sendMailP(message, userMail, 'OTP Verification')

    };

    public verify2FA = (twoFactorSecret: string, code: string): Boolean => {
        console.log({twoFactorSecret, code})
        const result = speakeasy.totp.verify({
            secret: twoFactorSecret,
            encoding: 'base32',
            token: code,
            step: 600,
            window: 1
        });
        console.log({result})
        return result;
    };
}

export const twoFA = new TwoFA();