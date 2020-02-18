const mongoose = require('mongoose');

const riddleSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: [String],
        required: true,
    },
    riddleId: {
        type: String,
        required: true,
    },
    solvedBy: {
        type: Number,
    },
    hints: {
        type: [String],
    },
    pointsForSuccess: {
        type: Number,
    },
});

module.exports = mongoose.model('Riddle', riddleSchema);
