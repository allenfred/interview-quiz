db = db.getSiblingDB('test_db');
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{role: 'readWrite', db: 'test_db'}],
});

const passwordStr = '123456';
const saltRounds = 10;
const passwordHash =
  '$2a$10$daD0YF9lVyPducGI5h54bOvgl1VP10SUNMu/pvU0KxKHsFYcPwflW';

// Initialize users collection
db.users.insertMany([
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '12345678910',
    role: 'guest',
  },
  {
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '09876543210',
    role: 'employee',
  },
  {
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '11223344550',
    role: 'guest',
  },
]);

// Initialize user-credentials collection
db['user-credentials'].insertMany([
  {
    userId: db.users.findOne({email: 'alice.johnson@example.com'})._id,
    password: passwordHash,
  },
  {
    userId: db.users.findOne({email: 'bob.brown@example.com'})._id,
    password: passwordHash,
  },
  {
    userId: db.users.findOne({email: 'charlie.davis@example.com'})._id,
    password: passwordHash,
  },
]);

// Initialize reservations collection
db.reservations.insertMany([
  {
    guestName: 'Alice Johnson',
    contactInfo: '12345678910', // Alice Johnson's phone number
    expectedArrivalTime: new Date('2025-02-20T18:00:00Z'),
    tableSize: 3,
    status: 'confirmed',
    userId: db.users.findOne({name: 'Alice Johnson'})._id,
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: '11223344550', // Charlie Davis's phone number
    expectedArrivalTime: new Date('2025-02-21T18:00:00Z'),
    tableSize: 1,
    status: 'confirmed',
    userId: db.users.findOne({name: 'Charlie Davis'})._id,
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: '12345678910', // Alice Johnson's phone number
    expectedArrivalTime: new Date('2025-02-21T19:00:00Z'),
    tableSize: 2,
    status: 'confirmed',
    userId: db.users.findOne({name: 'Alice Johnson'})._id,
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: '11223344550', // Charlie Davis's phone number
    expectedArrivalTime: new Date('2025-02-22T19:00:00Z'),
    tableSize: 1,
    status: 'cancelled',
    userId: db.users.findOne({name: 'Charlie Davis'})._id,
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: '12345678910', // Alice Johnson's phone number
    expectedArrivalTime: new Date('2025-02-23T18:00:00Z'),
    tableSize: 2,
    status: 'cancelled',
    userId: db.users.findOne({name: 'Alice Johnson'})._id,
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: '11223344550', // Charlie Davis's phone number
    expectedArrivalTime: new Date('2025-02-24T18:00:00Z'),
    tableSize: 1,
    status: 'completed',
    userId: db.users.findOne({name: 'Charlie Davis'})._id,
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: '12345678910', // Alice Johnson's phone number
    expectedArrivalTime: new Date('2025-02-24T19:00:00Z'),
    tableSize: 2,
    status: 'completed',
    userId: db.users.findOne({name: 'Alice Johnson'})._id,
  },
]);
