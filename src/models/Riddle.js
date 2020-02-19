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
    },
    solvedBy: {
        type: Number,
    },
    hints: {
        type: [String],
    },
    hintsUsed: {
        type: [Number],
    },
    pointsForSuccess: {
        type: Number,
    },
});

module.exports = mongoose.model('Riddle', riddleSchema);
