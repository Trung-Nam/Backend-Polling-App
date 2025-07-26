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
exports.getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.query;
    const filter = {};
    const userId = req.user._id;

    if (type) {
        filter.type = type;
    }
    if (creatorId) {
        filter.creator = creatorId;
    }

    try {
        // Calculate pagination parameters
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Fetch polls with pagination
        const polls = await Poll.find(filter)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "responses.voterId",
                select: "username profileImageUrl fullName",
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        // Add `userHasVoted` flag for each poll
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            );
            return {
                ...poll.toObject(),
                userHasVoted,
            };
        });

        // Get total count of polls for pagination metadata
        const totalPolls = await Poll.countDocuments(filter);

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ])


        // Ensure all types are included in stats, even those with zero counts
        const allTypes = [
            { type: "single-choice", label: "Single Choice" },
            { type: "yes/no", label: "Yes/No" },
            { type: "rating", label: "Rating" },
            { type: "image-based", label: "Image Based" },
            { type: "open-ended", label: "Open Ended" },
        ];

        const statsWithDefaults = allTypes
            .map((pollType) => {
                const stat = stats.find((item) => item.type === pollType.type);
                return {
                    label: pollType.label,
                    type: pollType.type,
                    count: stat ? stat.count : 0,
                };
            })
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults,
        });



    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }



}

// Get all voted polls
exports.getVotedPolls = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Get polls by ID
exports.getPollById = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Vote poll
exports.voteOnPoll = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Close poll
exports.closePoll = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Bookmark poll
exports.bookmarkPoll = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Get all bookmarked polls
exports.getBookmarkPolls = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}
// Delete poll
exports.deletePoll = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message })
    }
}