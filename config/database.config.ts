import mongoose from "mongoose"

class DatabaseConfig {

    public mongodbConnection = async () => {
       
        try{
            const connection = await mongoose.connect(process.env.MONGODB_URL as string)
            if (connection){
                console.log("mongodb connected")
            }else{
                console.log("mongodb not connected")
            }
        }catch(e: any){
            console.log(e.message)
        }


    }
}

export const databaseConfig = new DatabaseConfig();

