const express = require("express");
const router = express.Router();
const ContactDB = require("../models/ContactUsModel");


router.post("/create", async(req, res) => {
        console.log('this run')
    try {
        const Contact = new ContactDB({
            Fname: req.body.Fname,
            Lname: req.body.Lname,
            email: req.body.email,
            phonenumber: req.body.phnNumber,
            description: req.body.description

        });

        await Contact.save();

        res.status(201).json({message: 'appoinment created successfully'});

    } catch (err) {
        console.log('this run')
        console.error(err);
        res.status(500).json({ error: err})
    }

});

router.get("/all", async (req, res) => {
    try {
        const contacts = await ContactDB.find();
        res.status(200).json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch contact submissions." });
    }
});


module.exports = router;