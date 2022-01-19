const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('connected to mongodb');
  } catch (error) {
    console.log('error connecting to mongodb', error);
  }
})()