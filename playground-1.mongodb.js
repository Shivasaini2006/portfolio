/* global use, db */
// MongoDB Playground for Portfolio Database
// This playground is used to interact with the portfolio database

// Select the portfolio database
use('portfolioDB');

// Collections:
// - messages: Store contact form submissions
// - projects: Store portfolio projects
// - admin: Store admin user credentials

// Example: Query all messages
db.getCollection('messages').find({});

// Example: Query all projects
db.getCollection('projects').find({});

// Example: Insert a new message (contact form submission)
// db.getCollection('messages').insertOne({
//   name: 'John Doe',
//   email: 'john@example.com',
//   message: 'Hello, I would like to discuss a project.',
//   date: new Date(),
//   read: false
// });

// Example: Insert a new project
// db.getCollection('projects').insertOne({
//   title: 'Project Name',
//   description: 'Project description',
//   technologies: ['React', 'Node.js', 'MongoDB'],
//   image: 'project-images/project.jpg',
//   github: 'https://github.com/username/repo',
//   demo: 'https://demo-url.com',
//   featured: true
// });
