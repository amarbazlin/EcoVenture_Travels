// server.js - Main Express server with MySQL integration
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/database'); // Use your existing database config

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://webdev-b43d7.web.app'
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database tables
const initializeTables = async () => {
    try {
        // Create categories table - matching your existing structure
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_key VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(200) NOT NULL,
                description TEXT NOT NULL
            )
        `);

        // Create tours table - matching your existing structure
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS tours (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                tour_key VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(200) NOT NULL,
                country VARCHAR(100) NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                description TEXT NOT NULL,
                days INT NOT NULL CHECK (days >= 1),
                price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                old_price DECIMAL(10,2) CHECK (old_price >= 0),
                rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
                reviews INT DEFAULT 0 CHECK (reviews >= 0),
                base_slots INT DEFAULT 12 CHECK (base_slots >= 0),
                INDEX idx_category_id (category_id),
                INDEX idx_country (country),
                INDEX idx_price (price),
                FULLTEXT idx_search (name, description, country),
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        `);

        // Insert default categories if they don't exist
        const categories = [
            { key: 'cycling', name: 'Cycling', description: 'Eco-friendly cycling routes across the UK.' },
            { key: 'hiking', name: 'Hiking', description: 'Scenic hikes across UK parks and beyond.' },
            { key: 'mountain-climbing', name: 'Mountain Climbing', description: 'Guided alpine ascents for all levels.' },
            { key: 'rafting', name: 'Rafting', description: 'White-water adventures on European rivers.' },
            { key: 'wild-swimming', name: 'Wild Swimming', description: 'Freshwater swims in scenic locations.' },
            { key: 'wildlife-watching', name: 'Wildlife Watching', description: 'Nature walks focused on local wildlife.' }
        ];

        for (const category of categories) {
            await pool.execute(
                'INSERT IGNORE INTO categories (category_key, name, description) VALUES (?, ?, ?)',
                [category.key, category.name, category.description]
            );
        }

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        // Don't exit on error, just log it
        console.log('⚠️ Continuing with existing database structure...');
    }
};

// Initialize tables on startup
initializeTables();

// Utility function to generate tour key
const generateTourKey = (name, category) => {
    const prefix = category.toLowerCase().substring(0, 4);
    const suffix = name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 20);
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${suffix}-${timestamp}`;
};

// ============ REST API ENDPOINTS ============

// GET /api/tours - Fetch all tours with optional filtering
app.get('/api/tours', async (req, res) => {
    try {
        const {
            category,
            country,
            minPrice,
            maxPrice,
            search,
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        // Build WHERE clause
        let whereClause = 'WHERE 1=1';
        let params = [];
        
        if (category) {
            whereClause += ' AND c.category_key = ?';
            params.push(category.toLowerCase());
        }
        if (country) {
            whereClause += ' AND t.country = ?';
            params.push(country.toUpperCase());
        }
        if (minPrice) {
            whereClause += ' AND t.price >= ?';
            params.push(Number(minPrice));
        }
        if (maxPrice) {
            whereClause += ' AND t.price <= ?';
            params.push(Number(maxPrice));
        }

        // Handle search with FULLTEXT or LIKE fallback
        if (search) {
            whereClause += ' AND (t.name LIKE ? OR t.description LIKE ? OR t.country LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

      

        // Calculate offset
        const offset = (Number(page) - 1) * Number(limit);

        // Get tours with pagination and category info
    const toursQuery = `
    SELECT 
        t.id, 
        t.tour_key as tourKey,
        t.name, 
        t.country, 
        c.category_key as category,
        c.name as categoryName,
        t.description, 
        t.image_url as image, 
        t.days, 
        t.price, 
        t.old_price as oldPrice,
        t.rating, 
        t.reviews, 
        t.base_slots as baseSlots
    FROM tours t
    LEFT JOIN categories c ON t.category_id = c.id
    ${whereClause}
    LIMIT ? OFFSET ?
`;
        
        const [tours] = await pool.execute(toursQuery, [...params, Number(limit), offset]);

        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM tours t 
            LEFT JOIN categories c ON t.category_id = c.id 
            ${whereClause}
        `;
        const [countResult] = await pool.execute(countQuery, params);
        const totalTours = countResult[0].total;

        res.json({
            success: true,
            data: tours,
            pagination: {
                current: Number(page),
                pages: Math.ceil(totalTours / Number(limit)),
                total: totalTours
            }
        });

    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tours',
            message: error.message
        });
    }
});

// GET /api/tours/:id - Fetch single tour by ID or tour_key
app.get('/api/tours/:id', async (req, res) => {
    try {
        const identifier = req.params.id;
        
        // Try to get by ID first, then by tour_key
        const query = `
            SELECT 
                t.id, 
                t.tour_key as tourKey,
                t.name, 
                t.country, 
                c.category_key as category,
                c.name as categoryName,
                t.description, 
                t.image_url as image, 
                t.days, 
                t.price, 
                t.old_price as oldPrice,
                t.rating, 
                t.reviews, 
                t.base_slots as baseSlots
              
            FROM tours t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ? OR t.tour_key = ?
        `;
        
        const [tours] = await pool.execute(query, [identifier, identifier]);
        
        if (tours.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
        }

        res.json({
            success: true,
            data: tours[0]
        });

    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tour',
            message: error.message
        });
    }
});

// POST /api/tours - Add new tour
app.post('/api/tours', async (req, res) => {
    try {
        const {
            name,
            country,
            category,
            description,
            image,
            days,
            price,
            oldPrice,
            baseSlots
        } = req.body;

        // Validation
        if (!name || !country || !category || !description || !days || !price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                required: ['name', 'country', 'category', 'description', 'days', 'price']
            });
        }

        // Get category ID
        const [categoryCheck] = await pool.execute(
            'SELECT id FROM categories WHERE category_key = ?', 
            [category.toLowerCase()]
        );
        
        if (categoryCheck.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid category',
                message: 'Category does not exist'
            });
        }

        const categoryId = categoryCheck[0].id;

        // Validate numeric fields
        if (isNaN(days) || isNaN(price) || days < 1 || price < 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid numeric values. Days must be >= 1, Price must be >= 0'
            });
        }

        if (oldPrice && (isNaN(oldPrice) || oldPrice < 0)) {
            return res.status(400).json({
                success: false,
                error: 'Old price must be a valid positive number'
            });
        }

        // Generate unique tour key
        const tourKey = generateTourKey(name, category);

        // Insert tour
        const insertQuery = `
            INSERT INTO tours (category_id, tour_key, name, country, description, image_url, days, price, old_price, base_slots)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(insertQuery, [
            categoryId,
            tourKey,
            name.trim(),
            country.trim().toUpperCase(),
            description.trim(),
            image || '/default-tour.jpg',
            Number(days),
            Number(price),
            oldPrice ? Number(oldPrice) : null,
            baseSlots ? Number(baseSlots) : 12
        ]);

        // Fetch the created tour
        const [createdTour] = await pool.execute(
            `SELECT 
                t.id, 
                t.tour_key as tourKey,
                t.name, 
                t.country, 
                c.category_key as category,
                c.name as categoryName,
                t.description, 
                t.image_url as image, 
                t.days, 
                t.price, 
                t.old_price as oldPrice,
                t.rating, 
                t.reviews, 
                t.base_slots as baseSlots
            FROM tours t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            data: createdTour[0],
            message: 'Tour created successfully'
        });

    } catch (error) {
        console.error('Error creating tour:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: 'Tour with this key already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create tour',
            message: error.message
        });
    }
});

// PUT /api/tours/:id - Update tour
app.put('/api/tours/:id', async (req, res) => {
    try {
        const identifier = req.params.id;
        const updateFields = [];
        const params = [];

        // Handle category update
        if (req.body.category) {
            const [categoryCheck] = await pool.execute(
                'SELECT id FROM categories WHERE category_key = ?', 
                [req.body.category.toLowerCase()]
            );
            
            if (categoryCheck.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category'
                });
            }
            
            updateFields.push('category_id = ?');
            params.push(categoryCheck[0].id);
        }

        // Build dynamic update query for other fields
        const fieldMapping = {
            'name': 'name',
            'country': 'country',
            'description': 'description',
            'image': 'image_url',
            'days': 'days',
            'price': 'price',
            'oldPrice': 'old_price',
            'baseSlots': 'base_slots',
            'rating': 'rating',
            'reviews': 'reviews'
        };

        for (const [reqField, dbField] of Object.entries(fieldMapping)) {
            if (req.body[reqField] !== undefined) {
                updateFields.push(`${dbField} = ?`);
                params.push(req.body[reqField]);
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(identifier, identifier);

        const updateQuery = `UPDATE tours SET ${updateFields.join(', ')} WHERE id = ? OR tour_key = ?`;
        const [result] = await pool.execute(updateQuery, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
        }

        // Fetch updated tour
        const [updatedTour] = await pool.execute(
            `SELECT 
                t.id, 
                t.tour_key as tourKey,
                t.name, 
                t.country, 
                c.category_key as category,
                c.name as categoryName,
                t.description, 
                t.image_url as image, 
                t.days, 
                t.price, 
                t.old_price as oldPrice,
                t.rating, 
                t.reviews, 
                t.base_slots as baseSlots
            FROM tours t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ? OR t.tour_key = ?`,
            [identifier, identifier]
        );

        res.json({
            success: true,
            data: updatedTour[0],
            message: 'Tour updated successfully'
        });

    } catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update tour',
            message: error.message
        });
    }
});

// DELETE /api/tours/:id - Delete tour
app.delete('/api/tours/:id', async (req, res) => {
    try {
        const identifier = req.params.id;
        const [result] = await pool.execute(
            'DELETE FROM tours WHERE id = ? OR tour_key = ?', 
            [identifier, identifier]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
        }

        res.json({
            success: true,
            message: 'Tour deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete tour',
            message: error.message
        });
    }
});

// GET /api/categories - Fetch all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT id, category_key as categoryKey, name, description FROM categories ORDER BY name ASC'
        );
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// GET /api/tours/category/:category - Get tours by category
app.get('/api/tours/category/:category', async (req, res) => {
    try {
        const categoryKey = req.params.category.toLowerCase();
        const [tours] = await pool.execute(
            `SELECT 
                t.id, 
                t.tour_key as tourKey,
                t.name, 
                t.country, 
                c.category_key as category,
                c.name as categoryName,
                t.description, 
                t.image_url as image, 
                t.days, 
                t.price, 
                t.old_price as oldPrice,
                t.rating, 
                t.reviews, 
                t.base_slots as baseSlots
            FROM tours t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE c.category_key = ? 
            `,
            [categoryKey]
        );
        
        res.json({
            success: true,
            data: tours,
            count: tours.length
        });
    } catch (error) {
        console.error('Error fetching tours by category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tours by category'
        });
    }
});

// GET /api/stats - Get database statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [tourCount] = await pool.execute('SELECT COUNT(*) as total FROM tours');
        const [categoryCount] = await pool.execute('SELECT COUNT(*) as total FROM categories');
        const [countryCount] = await pool.execute('SELECT COUNT(DISTINCT country) as total FROM tours');
        
        res.json({
            success: true,
            data: {
                totalTours: tourCount[0].total,
                totalCategories: categoryCount[0].total,
                totalCountries: countryCount[0].total
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        await pool.execute('SELECT 1');
        res.json({
            success: true,
            message: 'EcoVenture API is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: 'Connected'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'API running but database connection failed',
            error: error.message
        });
    }
});

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 EcoVenture API server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;