const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, minlength: 4, unique: true},
    password: {type: String, required: true, minlength: 4,},
    role: {type: String, required: false, default: 'user'}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
