const { generateToken } = require("../middleware/auth");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const login = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user with tenant information
        const user = await User.findOne({ email, isActive: true })
            .populate('tenant', 'name slug subscription');

        if (!user) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data without password
        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
            tenant: {
                id: user.tenant._id,
                name: user.tenant.name,
                slug: user.tenant.slug,
                subscription: user.tenant.subscription
            }
        };

        res.json({
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Login failed'
        });
    }
}

const profile = async (req, res) => {
    try {
        const userData = {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            tenant: {
                id: req.tenant._id,
                name: req.tenant.name,
                slug: req.tenant.slug,
                subscription: req.tenant.subscription
            },
            createdAt: req.user.createdAt
        };

        res.json({
            user: userData
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get user profile'
        });
    }
}

const verifyToken = (req, res) => res.json({
    message: 'Token is valid',
    user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        tenant: {
            id: req.tenant._id,
            name: req.tenant.name,
            slug: req.tenant.slug,
            subscription: req.tenant.subscription
        }
    }
});


module.exports = {
    login,
    profile,
    verifyToken
}