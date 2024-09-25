const Flutterwave = require("flutterwave-node-v3");
import axios, { Axios } from "axios";
import { Wallet } from "../model/wallet.model";


class WalletService {

    public createAccount = async(email: string, bvn: string, userId: string) =>{

        const details = {
            email,
            bvn,
            is_permanent: true
        };
        try {
            
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);
            const accResponse = await flw.VirtualAcct.create(details)
           
            const {data, status, message} = accResponse
            if(status === "success" && message === "Virtual account created"){
                const {account_name, account_number, order_ref, bank_name } = data

                const newWallet = new Wallet({
                    account_number,
                    bank_name,
                    order_ref,
                    userId,
                    email
                })
                return await newWallet.save()
            }

        } catch (error: any) {
            console.log(error)
            console.log(error.message);
        }
        
    }

    public creditAccount = async(userId: string, amount: number) =>{
        return await Wallet.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { new: true }
        );
    }

    public debitAccount = async(userId: string, amount: number) =>{
        return await Wallet.findOneAndUpdate(
            {userId}, 
            { $inc: {balance: -amount}},
            { new: true}
        )
    }

    // public flwCreateCustomer = async(email: string, first_name: string, last_name: string, phone?: string): Promise<any>=> {
    //     try{
        
    //         const url = `${process.env.PAYSTACK_BASE_URL as string}/customer`
    //         const headers = {
    //             Authorization: `Bearer ${process.env.PAYSTACK_SECRET as string}`,
    //             'Content-Type': 'application/json'
    //         };

    //         const result = await axios.post(url, {email, first_name, last_name, phone}, {headers})
    //         return result;

    //     }catch(err: any) {
    //         console.log(err)
    //         throw err
    //     }
    // }
    // public flwCreateAccount = async(email: string, first_name: string, last_name: string, customer: Number, phone: string): Promise<any>=> {
    //     try{
    //         const url = `${process.env.PAYSTACK_BASE_URL as string}/dedicated_account`
    //         const headers = {
    //             Authorization: `Bearer ${process.env.PAYSTACK_SECRET as string}`,
    //             'Content-Type': 'application/json'
    //         };
    //         console.log(url, {email, first_name, last_name, customer, preferred_bank:"test-bank", phone, country: "NG"}, {headers})
    //         const result = await axios.post(url, {email, first_name, last_name, customer, preferred_bank:"test-bank", phone, country: "NG"}, {headers})
    //         console.log(result);
    //         return result;

    //     }catch(err: any) {
    //         console.log(err)
    //         throw err
    //     }
    // }


}

export const walletService = new WalletService();