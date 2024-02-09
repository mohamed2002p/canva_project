// Assuming you're using Express.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
// Increase the payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Endpoint to handle the upload of composed image
app.post('/upload-composed-image', (req, res) => {
    const {  image } = req.body;

    // Here you can save the image to your storage system
    saveImage( image)
        .then(() => {
            res.status(200).json({ message: 'Composed image uploaded successfully' });
        })
        .catch(error => {
            console.error('Error uploading composed image:', error);
            res.status(500).json({ error: 'Failed to upload composed image' });
        });
});

// Function to save the image to the storage system
function saveImage(imageData) {
    // Generate a unique filename or use some identifier from the title or description
    const filename = `_${Date.now()}.png`;
    const filePath = `uploads/${filename}`;

    // Convert base64 image data to binary
    const data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');

    // Save image to file
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, err => {
            if (err) {
                reject(err);
            } else {
                console.log('Image saved successfully:', filePath);
                resolve();
            }
        });
    });
}
app.use(express.static('public'));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`);
});
