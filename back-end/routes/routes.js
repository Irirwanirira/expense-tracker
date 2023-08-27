const { Transaction, Category } = require('../models/models');
const Router = require('express').Router();

Router.route('/v1/api/transactions').post(async (req, res) => {
    try {
        const { name, date, category, option, price, method} = req.body;
        const newTrans = await Transaction.create({ name, date, category, option, price, method});
        res.status(200).send({
            newTrans: { name: newTrans.name, price: newTrans.price, date: newTrans.data method: newTrans.method, category: newTrans.category, option: newTrans.option, _id: newTrans._id}
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while creating new transaction"})
    }
});


Router.route('/v1/api/transactions').get(async (req, res) => {

    try {
        const allTrans = await Transaction.find();
        res.status(200).send({
            transactions: allTrans
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while fetching transactions"})
    }
    
});


Router.route('/v1/api/transactions/:id').delete(async (req, res) => {

    try {
        const id = req.params.id;
    
        await Transaction.findByIdAndDelete(id);
        res.status(200).send({
            id,
            message: 'Transaction deleted'
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while deleting transaction"})
    }
    
});


Router.route('/v1/api/categories').post(async (req, res) => {
    try {
        const { name } = req.body;
        const newCatg = await Category.create({ name });
        res.status(200).send({
            category: { name: newCatg.name, _id: newCatg._id}
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while creating new category"})
    }
});


Router.route('/v1/api/categories').get(async (req, res) => {

    try {
        const allCategories = await Category.find();
        res.status(200).send({
            categories: allCategories
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while fetching categories"})
    }
    
});


module.exports = Router;
