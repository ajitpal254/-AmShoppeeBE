/**
 * Sanitizes sensitive information from error messages and stack traces
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeSensitiveData = (text) => {
  if (!text) return text;

  // Redact common sensitive patterns
  return (
    text
      // Redact JWT tokens
      .replace(/Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, "Bearer [REDACTED]")
      // Redact API keys
      .replace(/api[_-]?key["\s:=]+[\w-]+/gi, "api_key=[REDACTED]")
      // Redact passwords in various formats
      .replace(/(password|pwd|passwd)["\s:=]+[^\s"'}]+/gi, "$1=[REDACTED]")
      // Redact tokens
      .replace(/(token|secret|auth)["\s:=]+[\w-]+/gi, "$1=[REDACTED]")
      // Redact email patterns with sensitive data
      .replace(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)[\s:=]+([\w-]+)/gi,
        "$1=[REDACTED]"
      )
  );
};

const errorHandler = (err, req, res, next) => {
  const responseStatus = res.statusCode === 200 ? 500 : res.statusCode;
  const serviceName = "BackendService";

  // Sanitize error message and stack trace
  const sanitizedMessage = sanitizeSensitiveData(err.message);
  const sanitizedStack = sanitizeSensitiveData(err.stack);

  // Log error with service name (sanitized)
  console.error(`[${serviceName}] Error:`, {
    message: sanitizedMessage,
    stack:
      process.env.NODE_ENV === "production" ? "[REDACTED]" : sanitizedStack,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(responseStatus);
  res.json({
    service: serviceName,
    message: sanitizedMessage,
    stack: process.env.NODE_ENV === "production" ? null : sanitizedStack,
  });
};

module.exports = { errorHandler };
