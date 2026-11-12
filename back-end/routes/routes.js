const { Transaction, Category } = require('../models/models');
const Router = require('express').Router();

Router.route('/v1/api/transactions').post(async (req, res) => {
    try {
        const { name, date, category, option, price, method} = req.body;

        if (!name || !date || !option || price === undefined || !method) {
            return res.status(400).send({ error: "Missing required fields: name, date, option, price, method" });
        }

        const newTrans = await Transaction.create({ name, date, category, option, price, method});
        res.status(201).send({
            success: true,
            data: {
                name: newTrans.name,
                price: newTrans.price,
                date: newTrans.date,
                method: newTrans.method,
                category: newTrans.category,
                option: newTrans.option,
                _id: newTrans._id
            }
        });
    } catch(err) {
        console.error("Create transaction error:", err);
        res.status(500).send({ error: "Failed to create transaction" });
    }
});

Router.route('/v1/api/transactions').get(async (req, res) => {
    try {
        const allTrans = await Transaction.find().sort({ date: -1 });
        res.status(200).send({
            success: true,
            data: allTrans
        });
    } catch(err) {
        console.error("Fetch transactions error:", err);
        res.status(500).send({ error: "Failed to fetch transactions" });
    }
});

Router.route('/v1/api/transactions/:id').delete(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ error: "Transaction ID is required" });
        }

        const deletedTrans = await Transaction.findByIdAndDelete(id);

        if (!deletedTrans) {
            return res.status(404).send({ error: "Transaction not found" });
        }

        res.status(200).send({
            success: true,
            message: 'Transaction deleted',
            data: { _id: id }
        });
    } catch(err) {
        console.error("Delete transaction error:", err);
        res.status(500).send({ error: "Failed to delete transaction" });
    }
});

Router.route('/v1/api/categories').post(async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).send({ error: "Category name is required" });
        }

        // Check for duplicate before creating
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            return res.status(409).send({ error: "Category already exists" });
        }

        const newCategory = await Category.create({ name: name.trim() });
        res.status(201).send({
            success: true,
            data: { _id: newCategory._id, name: newCategory.name }
        });
    } catch (err) {
        console.error("Create category error:", err);
        res.status(500).send({ error: "Failed to create category" });
    }
});


Router.route('/v1/api/categories').get(async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ name: 1 });
        res.status(200).send({
            success: true,
            data: allCategories
        });
    } catch(err) {
        console.error("Fetch categories error:", err);
        res.status(500).send({ error: "Failed to fetch categories" });
    }
});

Router.route('/v1/api/categories/:id').delete(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ error: "Category ID is required" });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).send({ error: "Category not found" });
        }

        res.status(200).send({
            success: true,
            message: 'Category deleted',
            data: { _id: id }
        });
    } catch(err) {
        console.error("Delete category error:", err);
        res.status(500).send({ error: "Failed to delete category" });
    }
});

// Subcategory endpoints removed (Phase 2: will be reimplemented with proper schema)

module.exports = Router;
