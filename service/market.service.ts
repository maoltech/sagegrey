import { Buyer, Seller } from "../model/offer.model";
import { Offer } from "../model/offerV1.model";


class MarketPlaceService {

    public buyersList = async ( 
        skip: number, 
        countPerPage: number, 
        page: number,
        userId: string,
        methods?: string, 
        currency?: string, 
        amount?: string, 
    ) => {

        try {

            const filters = {
                methods: methods as string,
                currency: currency as string,
                amount: amount ? parseInt(amount as string) : undefined,
            };
          
            const query: any = {
                userId: { $ne: userId },
            }

            if (filters?.methods) {
                query.methods = { $in: filters.methods };
            }

            if (filters?.currency) {
                query.buyCurrency = filters.currency;
            }

            if (filters?.amount !== undefined) {
                query.rate = { $gte: filters.amount };
            }
            
            const lists = await Buyer.find(query)
            .skip(skip)
            .limit(countPerPage)
            .exec();

            const totalBuyers = await Buyer.countDocuments(query);

            const totalPages = Math.ceil(totalBuyers / countPerPage);

            return {
                lists,
                page,
                countPerPage,
                totalPages,
                totalBuyers
            }

        } catch (error) {
            throw error
        }
    }

    public sellersList = async ( 
        skip: number, 
        countPerPage: number, 
        page: number,
        userId: string,
        methods?: string, 
        currency?: string, 
        amount?: string) => {

        try {

            const filters = {
                methods: methods as string,
                currency: currency as string,
                amount: amount ? parseInt(amount as string) : undefined,
            };

            const query: any = {
                userId: { $ne: userId },
            }

            if (filters?.methods) {
                query.methods = { $in: filters.methods };
            }

            if (filters?.currency) {
                query.buyCurrency = filters.currency;
            }

            if (filters?.amount !== undefined) {
                query.rate = { $gte: filters.amount };
            }
            
            const lists = await Seller.find(query)
            .skip(skip)
            .limit(countPerPage)
            .exec();

            const totalSellers = await Seller.countDocuments(query);

            const totalPages = Math.ceil(totalSellers / countPerPage);
            return {
                lists,
                page,
                countPerPage,
                totalPages,
                totalSellers
            }

        } catch (error) {
            throw error
        }
    }


    public getSellerById = async(id: string) => {
        return await Seller.findById(id);
    }

    public getOfferByIdV1 = async (id: string) => {
        return await Offer.findById(id);
    }
    
    public getBuyerById = async(id: string) => {
        return await Buyer.findById(id);
    }

    public getOfferById = async(id: string) => {

        try {
            const buyerOffer = await Buyer.findById(id);
            if (buyerOffer) {
             return buyerOffer;
        }
    
        const sellerOffer = await Seller.findById(id);
        if (sellerOffer) {
            return sellerOffer;
        }

        return null

        } catch (error) {
            console.log(error);
        }
    }
}

export const marketPlaceService = new MarketPlaceService();