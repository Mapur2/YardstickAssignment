const mongoose = require('mongoose');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-saas';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});
    console.log('Cleared existing data');

    // Create tenants
    const acmeTenant = new Tenant({
      name: 'Acme Corporation',
      slug: 'acme',
      subscription: {
        plan: 'free',
        noteLimit: 3
      }
    });

    const globexTenant = new Tenant({
      name: 'Globex Corporation',
      slug: 'globex',
      subscription: {
        plan: 'free',
        noteLimit: 3
      }
    });

    await acmeTenant.save();
    await globexTenant.save();
    console.log('Created tenants');

    // Create users
    const users = [
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenant: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenant: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenant: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenant: globexTenant._id
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    console.log('Created users');

    // Create some sample notes for testing
    const Note = require('../models/Note');
    
    const sampleNotes = [
      {
        title: 'Welcome to Acme Notes',
        content: 'This is a sample note for Acme Corporation. You can create, edit, and delete notes here.',
        tags: ['welcome', 'sample'],
        tenant: acmeTenant._id,
        author: (await User.findOne({ email: 'admin@acme.test' }))._id
      },
      {
        title: 'Project Planning',
        content: 'Notes for our upcoming project planning session. Remember to include budget considerations and timeline.',
        tags: ['project', 'planning'],
        tenant: acmeTenant._id,
        author: (await User.findOne({ email: 'user@acme.test' }))._id
      },
      {
        title: 'Globex Team Meeting',
        content: 'Agenda for the weekly team meeting. Topics include quarterly review and new initiatives.',
        tags: ['meeting', 'agenda'],
        tenant: globexTenant._id,
        author: (await User.findOne({ email: 'admin@globex.test' }))._id
      }
    ];

    for (const noteData of sampleNotes) {
      const note = new Note(noteData);
      await note.save();
    }

    console.log('Created sample notes');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('Tenants created:');
    console.log('- Acme Corporation (slug: acme)');
    console.log('- Globex Corporation (slug: globex)');
    
    console.log('\nTest accounts created (password: password):');
    console.log('- admin@acme.test (Admin, Acme)');
    console.log('- user@acme.test (Member, Acme)');
    console.log('- admin@globex.test (Admin, Globex)');
    console.log('- user@globex.test (Member, Globex)');
    
    console.log('\nSample notes created for testing');
    console.log('\nDatabase seeded successfully!');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedData();
