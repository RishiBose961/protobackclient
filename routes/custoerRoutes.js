const auth = require('../middleware/auth');
const Customer = require('../models/customerModel');
const router = require('express').Router()


router.post("/",auth,async(req,res)=>{
    try {
        const {name} = req.body;

        const newCustomer = new Customer({
            name
        })
        const savedCustomer = await newCustomer.save()

        res.status(200).json(savedCustomer)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/",auth,async(req,res)=>{
    try {
        const customers = await Customer.find();
        res.json(customers)

    } catch (error) {
        res.status(500).send(error.message)
    }
})



module.exports = router