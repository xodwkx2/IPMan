var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/nfv', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('mongodb: connected successfully');
});
