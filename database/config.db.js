const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });

        console.log('Base de datos online');

    } catch (error) {
        console.error(error);
        throw new Error('Error con la conexión con la base de datos');
    }
}

module.exports = {
    dbConnection
}