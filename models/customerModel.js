const mongoose = require('mongoose');

const customerModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const Customer = mongoose.model('customer',customerModel)

module.exports = Customer