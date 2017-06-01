const mongoose = require('mongoose');

const StyleTypeSchema = new mongoose.Schema({
    _id: String,
    name: String,
    status: Number,
    level: 0,
    parent: String,
    sort: Number,
    createTime: Date
});

module.exports = mongoose.model('StyleType', StyleTypeSchema);