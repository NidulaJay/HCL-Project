const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    Fname: {type: String, required: true},
    Lname: {type: String, required: false},
    email: {type: String, required: true},
    phonenumber: {type: String, required: true},
    description: {type: String, required: false},
    status: {type: Boolean, default: false}
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;