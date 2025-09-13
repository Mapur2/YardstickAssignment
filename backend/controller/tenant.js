const { validationResult } = require("express-validator");
const Note = require("../models/Note");
const Tenant = require("../models/Tenant");

const info = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenant._id);

        if (!tenant) {
            return res.status(404).json({
                error: 'Tenant not found',
                message: 'Tenant does not exist'
            });
        }

        // Get current note count
        const noteCount = await Note.countDocuments({ tenant: tenant._id });

        res.json({
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
                subscription: tenant.subscription,
                noteCount,
                canCreateMore: tenant.canCreateNote(noteCount)
            }
        });
    } catch (error) {
        console.error('Get tenant info error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get tenant information'
        });
    }
}

const upgrade = async (req, res) => {
    try {
        const { slug } = req.params;

        // Verify the slug matches the user's tenant
        if (slug !== req.user.tenant.slug) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You can only upgrade your own tenant'
            });
        }

        const tenant = await Tenant.findOne({ slug });

        if (!tenant) {
            return res.status(404).json({
                error: 'Tenant not found',
                message: 'Tenant does not exist'
            });
        }

        if (tenant.subscription.plan === 'pro') {
            return res.status(400).json({
                error: 'Already upgraded',
                message: 'Tenant is already on Pro plan'
            });
        }

        // Upgrade to Pro
        await tenant.upgradeToPro();

        // Get updated note count
        const noteCount = await Note.countDocuments({ tenant: tenant._id });

        res.json({
            message: 'Tenant upgraded to Pro plan successfully',
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
                subscription: tenant.subscription,
                noteCount,
                canCreateMore: true
            }
        });
    } catch (error) {
        console.error('Upgrade tenant error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to upgrade tenant'
        });
    }
}

const stats = async (req, res) => {
    try {
        const tenantId = req.user.tenant._id;

        // Get various statistics
        const [
            totalNotes,
            totalUsers,
            recentNotes,
            notesByMonth
        ] = await Promise.all([
            Note.countDocuments({ tenant: tenantId }),
            User.countDocuments({ tenant: tenantId, isActive: true }),
            Note.find({ tenant: tenantId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('author', 'email role'),
            Note.aggregate([
                { $match: { tenant: tenantId } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': -1, '_id.month': -1 } },
                { $limit: 12 }
            ])
        ]);

        res.json({
            stats: {
                totalNotes,
                totalUsers,
                subscription: req.tenant.subscription,
                recentNotes,
                notesByMonth
            }
        });
    } catch (error) {
        console.error('Get tenant stats error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get tenant statistics'
        });
    }
}

const invite = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'A user with this email already exists'
            });
        }

        res.json({
            message: 'User invitation sent successfully',
            details: {
                email,
                role,
                tenant: req.tenant.name,
                note: 'In a real application, an invitation email would be sent to the user'
            }
        });
    } catch (error) {
        console.error('Invite user error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to invite user'
        });
    }
}


module.exports = {
    info,
    upgrade,
    stats,
    invite
}