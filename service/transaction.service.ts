import { IVerifyAccountRequest } from "../constants/interface";
import { Transaction,TransactionType } from "../model/transaction.model";
import { Wallet } from "../model/wallet.model";

const Flutterwave = require("flutterwave-node-v3");

class TransactionService {

    public transfer = async(payload: any, userId: string, walletId: string) =>{

        try {
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);
            const accTransfer = await flw.Transfer.initiate(payload)
            
            const {data, status, message} = accTransfer
            if(status === "success" && message === "Transfer Queued Successfully"){
               
                const {id, complete_message, requires_approval, meta, ...others } = data
                const userWallet = await Wallet.findOne({ userId });
                if (!userWallet) {
                    throw new Error("User wallet not found");
                }

                const newBalance = userWallet.balance - payload.amount;

                await Wallet.findOneAndUpdate({ userId }, { balance: newBalance });

                const newWallet = {...others, userId, walletId, newBalance, type: TransactionType.Debit}
                    
                return await Transaction.create(newWallet)
 
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
        
    }

    public verifyTransfer = async(transferId: string) => {

        try {
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);
            return await flw.Transfer.get_a_transfer({id: transferId});
        } catch (error: any) {
            throw new Error(error);
        }

        
    }

    public verifyAccountDetails = async(payload: IVerifyAccountRequest) => {

        try {
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);
            const response = await flw.Misc.verify_Account(payload)
            return response
        } catch (error: any) {
           throw new Error(error)
        }
        
    }

    public bankList = async() => {

        try {
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);
            const payload = {country:"NG"}
            return await flw.Bank.country(payload)
        } catch (error: any) {
           throw new Error(error)
        }
        
    }

    public transactionHistory = async (userId: string, skip: number, page: number, countPerPage: number)=>{
        try {
            const transactions = await Transaction.find({userId})
            .skip(skip)
            .limit(countPerPage)
            .exec();

            const totalTransactions = await Transaction.countDocuments({ userId });

            const totalPages = Math.ceil(totalTransactions / countPerPage);
            return {
                transactions,
                page,
                countPerPage,
                totalPages,
                totalTransactions
            }
        } catch (error: any) {
            throw new Error(error)
        }
    }

}

export const transactionService = new TransactionService();