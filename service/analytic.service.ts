import axios from "axios";
import { Analytics, IAnalytics } from "../model/analytic.model";


class AnalyticService {

    public getUserAnalytics =  async(userId: string) => {
        return await Analytics.findOne({userId})
    }

    public createAnalytics = async(userId: string) => {
        return await Analytics.create({userId})
    }

    public updateTradeAnalytics = async(userId: string, amount: number, type: string ) => {
        if(type === 'sell'){
            return await Analytics.findOneAndUpdate(
                {userId}, 
                {$inc: 
                    {tradeVolume: amount, tradeCount: 1, sellCurrencyVolume: amount, sellCurrencyCount: 1}
                }, 
                {new: true}
                )
        }else if(type === 'buy'){
            return await Analytics.findOneAndUpdate(
                {userId}, 
                {$inc: 
                    {tradeVolume: amount, tradeCount: 1, buyCurrencyVolume: amount, buyCurrencyCount: 1}
                }, 
                {new: true}
            )
        }
        
    }

    public updateRelationshipAnalytics = async(userId: string, traderId: string, currency: string, amount: number) => {
        console.log({userId, traderId, currency, amount});
        let updatedAnalytics = await Analytics.findOneAndUpdate(
            {userId}, 
            {$addToSet: {tradingPartners: traderId}}, 
            {new: true}
        )

        if(!updatedAnalytics){
            throw "cannot update analytics"
        }
        
        const currencyIndex = updatedAnalytics.tradingCurrencyVolume.hasOwnProperty(currency);

        if (currencyIndex) {
            updatedAnalytics.tradingCurrencyVolume[currency] += amount;
            updatedAnalytics.tradingCurrencyCount[currency] += 1;
        } else {
            // Currency doesn't exist, add new entry
            updatedAnalytics.tradingCurrencyVolume[currency] = amount;
            updatedAnalytics.tradingCurrencyCount[currency] = 1;
        }
    
        return await updatedAnalytics.save();
    }

    public getTopCurrencyRate = async() =>{
        const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.CURRENCY_API_FREAKS_KEY}`
        return (await axios.get(url)).data
    }

}

export const analyticService = new AnalyticService();