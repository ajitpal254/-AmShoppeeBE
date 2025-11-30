// Custom sanitization middleware to prevent NoSQL injection and XSS attacks
// This is a custom implementation to avoid compatibility issues with express-mongo-sanitize and xss-clean

/**
 * NoSQL Injection Prevention Middleware
 * Removes MongoDB operators ($, .) from request data
 */
const sanitizeNoSQL = (req, res, next) => {
    const sanitizeObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        const sanitized = Array.isArray(obj) ? [] : {};
        
        for (const key in obj) {
            // Skip MongoDB operators and keys with dots
            if (key.startsWith('$') || key.includes('.')) {
                continue;
            }
            
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    };
    
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    
    next();
};

/**
 * XSS Prevention Middleware
 * Escapes HTML special characters in request data
 * Excludes URL fields to prevent breaking image/resource links
 */
const sanitizeXSS = (req, res, next) => {
    // Fields that should not be sanitized (URLs, etc.)
    const skipFields = ['image', 'images', 'imageUrl', 'url', 'website', 'avatar', 'profilePicture'];
    
    const escapeHtml = (str) => {
        if (typeof str !== 'string') return str;
        
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
            // Removed forward slash encoding to preserve URLs
    };
    
    const sanitizeObject = (obj, parentKey = '') => {
        if (!obj || typeof obj !== 'object') {
            return typeof obj === 'string' ? escapeHtml(obj) : obj;
        }
        
        const sanitized = Array.isArray(obj) ? [] : {};
        
        for (const key in obj) {
            // Skip sanitization for URL fields
            if (skipFields.includes(key)) {
                sanitized[key] = obj[key];
                continue;
            }
            
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value, key);
            } else if (typeof value === 'string') {
                // Don't sanitize if it looks like a URL
                if (value.startsWith('http://') || value.startsWith('https://')) {
                    sanitized[key] = value;
                } else {
                    sanitized[key] = escapeHtml(value);
                }
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    };
    
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    
    next();
};

module.exports = {
    sanitizeNoSQL,
    sanitizeXSS
};
