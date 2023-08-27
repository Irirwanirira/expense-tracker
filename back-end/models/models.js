const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transaction = Schema({
    name: {type: String, required: true},
    date: {type: String, required: true},
    method: {type: String, required: true},
    category: { type: String},
    price: {type: Number, required: true},
    option: {type: String, required: true}
});

const category = Schema({
    name: { type: String, required: true}
});

// const subCategory = Schema({
//     name: {type: String, required: true}
// })
// 
const Category = mongoose.model('categories', category);
const Transaction = mongoose.model('transactions', transaction);
// const SubCategory = mongoose.model('subcategory', subCategory);

module.exports = {
    Transaction, Category,
    // SUbCategory
};
