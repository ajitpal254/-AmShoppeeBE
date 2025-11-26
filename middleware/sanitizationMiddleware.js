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
 */
const sanitizeXSS = (req, res, next) => {
    const escapeHtml = (str) => {
        if (typeof str !== 'string') return str;
        
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    };
    
    const sanitizeObject = (obj) => {
        if (!obj || typeof obj !== 'object') {
            return typeof obj === 'string' ? escapeHtml(obj) : obj;
        }
        
        const sanitized = Array.isArray(obj) ? [] : {};
        
        for (const key in obj) {
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else if (typeof value === 'string') {
                sanitized[key] = escapeHtml(value);
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
