const mongose = require('mongoose');
require('colors')
const connectDB = async () =>{
    try{
        const conn = await mongose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex:true
        })
        console.log('Db connected'.yellow+ conn.connection.host)
    }
    catch (e) {
        console.error('Error:'.red+ e.message)
        process.exit(1)
    }
};
module.exports = connectDB;
