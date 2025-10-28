// Import required modules using CommonJS
const express = require('express');
const Url = require('../models/Url');
const { saveUrl, getUrlByShortId, incrementCount, getNextId } = require('../repository/UrlRepository');
const { encodeBase62 } = require('../utlis/base62');

// Helper function to validate a URL
function isValidUrl(url) {
    try {
        new URL(url); // Attempt to create a URL object (throws error if invalid)
        return true;
    } catch (err) {
        return false;
    }
}

// Main function to generate a shortened URL
async function shortenUrl(originalUrl) {
    try {
        if (!originalUrl) {
            throw new Error('URL is required');
        }

        // Add http:// if protocol is missing
        if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
            originalUrl = 'http://' + originalUrl;
        }

        // Validate the final URL
        if (!isValidUrl(originalUrl)) {
            throw new Error('Invalid URL format');
        }

        // Get next unique ID from counter
        const id = await getNextId();

        // Encode ID to base62 for short URL
        const shortId = encodeBase62(id);

        // Save the short URL and original URL in the database
        const urlDoc = await saveUrl(shortId, originalUrl, id);
        return urlDoc;

    } catch (error) {
        throw new Error('Error creating short URL: ' + error.message);
    }
}

// Function to handle redirection from short URL
async function redirectUrl(shortId) {
    try {
        // Look up the original URL from DB using the short ID
        const urlDoc = await getUrlByShortId(shortId);
        if (!urlDoc) {
            throw new Error('URL not found');
        }

        // Update the usage count (for analytics)
        await incrementCount(urlDoc);

        // Return the original URL to redirect
        return urlDoc.originalUrl;
    } catch (error) {
        throw new Error('Error redirecting URL: ' + error.message);
    }
}

// Express handler to respond to client when they send a POST to shorten a URL
async function shortenUrlHandler(req, res, next) {
    try {
        const { url } = req.body;

        // Check if URL was provided in request
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Call the logic to shorten the URL
        const urlDoc = await shortenUrl(url);

        // Respond with the generated short URL
        res.json({
            shortUrl: `http://${req.get('host')}/api/${urlDoc.shortUrl}`
        });
    } catch (err) {
        // If the URL is malformed, send user-friendly error
        if (err.message.includes('Invalid URL')) {
            return res.status(400).json({ error: err.message });
        }

        // Pass other errors to the default error handler
        next(err);
    }
}

// Export all functions to be used in routes
module.exports = {
    shortenUrl,
    redirectUrl,
    shortenUrlHandler
};
