const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection (you'll need to add your MongoDB URI to .env file)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Contact Form Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Project Schema (for dynamic projects)
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  technologies: [String],
  githubUrl: String,
  demoUrl: String,
  category: String,
  featured: { type: Boolean, default: false }
});

const Project = mongoose.model('Project', projectSchema);

// API Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your message! I\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, _id: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});