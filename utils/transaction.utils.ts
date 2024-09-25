

class TransactionUtils {

    public transanctionRef = (userId : string) => {

        const currentDate = new Date();
        const datePart = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); 
        const timePart = currentDate.toTimeString().slice(0, 8).replace(/:/g, '');

        const transactionReference = `${userId}${datePart}${timePart}`;

        return transactionReference;
    }
}

export const transactionUtils = new TransactionUtils();