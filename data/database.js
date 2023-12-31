import mongoose from 'mongoose'

export const connectDB = async () => {

    try {
        const {connection} =  await mongoose.connect(process.env.MONGO_URI, {
            dbName: "StoreApp",
        })
        
        console.log(`Server connected to database ${connection.host} `)
    
    } catch (error) {
        console.log("Something went wrong",error);
        process.exit(1);
    }

}