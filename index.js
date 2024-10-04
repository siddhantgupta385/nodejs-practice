const http = require('http');
const fs = require('fs');
const path = require('path');

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticateToken = require('./middleware/auth');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/authRoute'); // Import auth routes
const bookRoutes = require('./routes/bookRoute'); // Import book routes
const mongoose = require('mongoose');


// -----------------------------------EventEmitter-----------------------------------------------------

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
  foo() {
    this.emit('test');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('test', () => console.log('Yay, it works!'));

myEmitter.foo();	// Yay it works!

// ---------------------------------Stream-------------------------------------------------------


const readStream = fs.createReadStream('large_file.txt');
const writeStream = fs.createWriteStream('output_file.txt');   


readStream.on('data', (chunk) => {
  writeStream.write(chunk);
});

readStream.on('end', () => {
  console.log('File copied successfully!');
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);   

});


// ----------------------------------Reading from File------------------------------------------------------

// Write a Node.js HTTP server that responds with "Hello World!" to any request.Bonus: Serve an HTML page instead of plain text.
// const server = http.createServer((req, res) => {
//   const filePath = path.join(__dirname, 'index.html');
  
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       res.statusCode = 500;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end('Error loading HTML file');
//     } else {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/html');
//       res.end(data);
//     }
//   });
// });

// Read the content of input.txt


fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    // Print the content to the console
    console.log(data);

    // Write the content to output.txt
    fs.writeFile('output.txt', data, (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return;
        }
        console.log('Content written to output.txt');
    });
});


// Make GET request to JSONPlaceholder API
http.get('http://jsonplaceholder.typicode.com/posts/10', (res) => {
  let data = '';

  // Collect the data chunks
  res.on('data', (chunk) => {
      data += chunk;
  });

  // On response end, print the data
  res.on('end', () => {
      console.log(JSON.parse(data));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});



// ------------------------------------------Promise Handling----------------------------------------------



// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });



//EXPRESS



// Function to fetch data from an API using Promises
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          reject(new Error(`Failed to fetch data from ${url}: ${response.statusText}`));
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

// using axios
// function fetchData(url) {
//     return axios.get(url)
//       .then(response => {
//         if (!response.data) {
//           throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
//         }
//         return response.data;
//       })
//       .catch(error => {
//         throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
//       });
//   }


// Chain multiple promises to handle multiple API calls
async function handleMultipleApiCalls() {
  try {
    const data1 = await fetchData('http://jsonplaceholder.typicode.com/posts/10');
    const data2 = await fetchData('http://jsonplaceholder.typicode.com/posts/11');

    // Process the data from both API calls
    console.log('Data from API 1:', data1);
    console.log('Data from API 2:', data2);

    // Perform additional operations or return the combined data
    return { data1, data2 };
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for further handling
  }
}

const app = express();
app.use(express.json());
app.use(errorHandler);


app.get('/api/data', async (req, res) => {
  try {
    const result = await handleMultipleApiCalls();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



mongoose.connect('<your_mongodb_uri>', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err)); 


// ------------------------------------------Auth Middleware----------------------------------------------

// Authentication routes
app.use('/auth', authRoutes);


// ------------------------------------------CRUD EXPRESS----------------------------------------------

// Protected book routes
app.use('/books', authenticateToken, bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));