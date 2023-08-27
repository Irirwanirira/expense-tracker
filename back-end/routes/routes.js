const { Transaction, Category } = require('../models/models');
const Router = require('express').Router();

Router.route('/v1/api/transactions').post(async (req, res) => {
    try {
        const { name, date, category, option, price, method} = req.body;
        const newTrans = await Transaction.create({ name, date, category, option, price, method});
        res.status(200).send({
            newTrans: { name: newTrans.name, price: newTrans.price, date: newTrans.date, method: newTrans.method, category: newTrans.category, option: newTrans.option, _id: newTrans._id}
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
        const oldCat = await Category.find()
    
        for(let i = 0; i < oldCat.length; i++) {
            if(oldCat[i].name === newCatg.name) {
                res.status(400).send({error: "Category already exists"});
                return;
            }
        }
        res.status(200).send({
            category: { name: newCatg.name, _id: newCatg._id }
        });
        console.log(oldCat);
    } catch (err) {
        res.status(400).send({ error: "Error occurred while creating a new category" });
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

Router.route('/v1/api/categories/:id').delete(async (req, res) => {

    try {
        const id = req.params.id;
    
        await Category.findByIdAndDelete(id);
        res.status(200).send({
            id,
            message: 'Category deleted'
        });
    } catch(err) {
        res.status(400).send({error: "Error occurred while deleting Category"})
    }
    
});

Router.route('/v1/api/subcategories').post(async (req,res) => {
    try {
        const {name} = req.body
        const newSub = await SubCategory.create({ name });
        res.status(200).send({
            subcategory: {_id:newSub._id, name: newSub.name}
        })
        
    } catch (error) {
        res.status(400).send({error:'unable to create Subcategories'})
    }
})

Router.route('/v1/api/subcategories').get(async (req, res) => {
    try {
        const allSubcategories = await SubCategory.find();
        res.status(200).send({
            subcategory: allSubcategories
        })

    } catch (error) {
        res.status(400).send({error: 'Failed to get subCategories'})
    }
})

module.exports = Router;
