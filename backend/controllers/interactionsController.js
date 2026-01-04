// Mock database of interactions
// In a real app, this would call an external API like OpenFDA or RxNorm
const INTERACTIONS_DB = [
    { pair: ['Aspirin', 'Warfarin'], severity: 'High', description: 'Increased risk of bleeding.' },
    { pair: ['Paracetamol', 'Warfarin'], severity: 'Moderate', description: 'May enhance anticoagulant effect.' },
    { pair: ['Amoxicillin', 'Methotrexate'], severity: 'High', description: 'Increased toxicity of Methotrexate.' },
    { pair: ['Ibuprofen', 'Aspirin'], severity: 'Moderate', description: 'May reduce anti-platelet effect of Aspirin.' },
    { pair: ['Metformin', 'Insulin'], severity: 'Moderate', description: 'Increased risk of hypoglycemia.' }
];

// @desc    Check for drug interactions
// @route   POST /api/interactions/check
// @access  Private
exports.checkInteractions = async (req, res) => {
    try {
        // Expect body: { medicines: ["Aspirin", "Warfarin", ...] }
        const { medicines } = req.body;

        if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Need at least 2 medicines to check interactions.'
            });
        }

        const foundInteractions = [];

        // Simple O(N^2) check against mock DB (ok for small N)
        for (let i = 0; i < medicines.length; i++) {
            for (let j = i + 1; j < medicines.length; j++) {
                const med1 = medicines[i].toLowerCase();
                const med2 = medicines[j].toLowerCase();

                const match = INTERACTIONS_DB.find(interaction => {
                    const pair = interaction.pair.map(p => p.toLowerCase());
                    return pair.includes(med1) && pair.includes(med2);
                });

                if (match) {
                    foundInteractions.push({
                        medicines: match.pair,
                        severity: match.severity,
                        description: match.description
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            data: foundInteractions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
