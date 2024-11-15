const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const connectDB = require('./config/db'); 
const setupSwagger = require('./config/swaggerConfig');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);


app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);


app.use(errorMiddleware);


connectDB(); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
