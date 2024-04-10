const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

// Set up the body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email } = req.body;

  // Read existing form data from JSON file
  fs.readFile('formData.json', 'utf8', (err, data) => {
    let formDataArray = [];

    if (err && err.code !== 'ENOENT') { // Ignore ENOENT error (file not found)
      console.error('Error reading file:', err);
      res.status(500).send('Error reading form data');
      return;
    }

    if (!err) {
      try {
        formDataArray = JSON.parse(data);
        if (!Array.isArray(formDataArray)) {
          console.error('Error parsing JSON data: Data is not an array');
          formDataArray = []; // Reset formDataArray to an empty array
        }
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        formDataArray = []; // Reset formDataArray to an empty array
      }
    }

    // Add new form data to the array
    formDataArray.push({ name, email });

    // Save updated form data to the JSON file
    fs.writeFile('formData.json', JSON.stringify(formDataArray, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving form data:', writeErr);
        res.status(500).send('Error saving form data');
        return;
      }
      console.log('Form data saved successfully');
      // Redirect to success.html
      res.redirect(`/success?username=${encodeURIComponent(name)}`);
    });
  });
});

// Define a route for the success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Define a route for the product catalog page
app.get('/product-catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product-catalog.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
