const User = require("../models/User");
const Poll = require("../models/Poll");

// Create new poll
exports.createPoll = async (req, res) => {
    const { question, type, options, creatorId } = req.body;

    if (!question || !type || !creatorId) {
        return res
            .status(400)
            .json({ message: "Question, type, and creatorId are required." });
    }

    try {

        let processOptions = [];

        switch (type) {
            case "single-choice":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Single choice poll must have at least two options."
                    });
                }
                processOptions = options.map((option) => ({ optionText: option }));
                break;
            case "rating":
                processOptions = [1, 2, 3, 4, 5].map((value) => ({
                    optionText: value.toString(),
                }));
                break;

            case "yes/no":
                processOptions = ["Yes", "No"].map((option) => ({
                    optionText: option,
                }));
                break;

            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Image based poll must have at least two image URLs."
                    })
                }

                processOptions = options.map((url) => ({ optionText: url }));
                break;

            case "open-ended":
                processOptions = []; // No options needed for open-ended
                break;

            default:
                return res.status(400).json({ message: "Invalid poll type." });
        }

        const newPoll = await Poll.create({
            question,
            type,
            options: processOptions,
            creator: creatorId,
        });

        res.status(201).json(newPoll);

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}

// Get all polls
