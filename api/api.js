// const admin = require('firebase-admin');
// const { increment } = require('firebase/firestore');
// Libraries
// const { log } = require('console');
require('dotenv').config();
const express = require('express');
const path = require('path');
const { db, bucket, } = require('./firebase');
const bodyParser = require('body-parser');

const router = express.Router();

router.get("/", (req, res) => {
    res.send("HI")
})
router.post("/submit", async (req, res) => {
    try {
        const regestrationsRef = db.collection('regs');
        await regestrationsRef.add({ timestamp: Date.now(), ...req.body });
        res.status(200).json({ message: "Hacker Registered Succefully" });
    }
    catch {
        res.status(500).json({ message: 'Failed to registered', error: error.message });
    }
})

router.get("/hackers", async (req, res) => {
    try {
        const regestrationsRef = db.collection('regs');
        const hackersCount = await regestrationsRef.count().get()
        res.status(200).json({ hackers: hackersCount["_data"].count });
    }
    catch {
        res.status(500).json({ message: 'Failed to registered', error: error.message });
    }
})
module.exports = router


// app.post('/editscore', async (req, res) => {
//     try {
//         if (req.body.token !== process.env.ADMIN_REQUEST_TOKEN) {
//             return res.status(403).send("Wrong Token");
//         }
//         const teamRef = db.collection('scores').doc(req.body.id);
//         const teamDoc = await teamRef.get();
//         if (!teamDoc.exists) {
//             return res.status(404).send({ message: 'Team not found' });
//         }
//         const teamData = teamDoc.data();
//         const updatedScore = teamData.score + Number(req.body.aura);
//         await teamRef.update({ score: updatedScore });
//         res.status(200).json({ message: "Score updated successfully" });
//     } catch (error) {
//         console.error('Error updating score:', error);
//         res.status(500).json({ message: 'Failed to update scores', error: error.message });
//     }
// });

// app.post('/toggleChecked', async (req, res) => {
//     const { id, questionId, token } = req.body;
//     try {
//         if (token !== process.env.ADMIN_REQUEST_TOKEN) {
//             return res.status(403).send("Wrong Token");
//         }
//         const questionRef = db.collection('scores').doc(id).collection('questions').doc(questionId.toString());
//         if (!questionRef) {
//             return res.status(404).send({ message: 'Question not found' });
//         }
//         await questionRef.update({
//             checked: admin.firestore.FieldValue.increment(1)
//         });
//         res.status(200).json({ message: "Checked status updated successfully" });
//     } catch (error) {
//         console.error('Error toggling checked status:', error);
//         res.status(500).json({ message: 'Failed to toggle checked status', error: error.message });
//     }
// });
