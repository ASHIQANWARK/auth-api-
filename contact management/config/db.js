const mongoose = require('mongoose');


const connectDB = () => {
  const mongoURI = process.env.MONGO_URI;
  
  if (!mongoURI) {
    console.error("Error: MongoDB URI is not defined in the environment variables.");
    process.exit(1);
  }

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

module.exports = connectDB;

