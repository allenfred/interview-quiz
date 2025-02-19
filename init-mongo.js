db = db.getSiblingDB('test_db');
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{role: 'readWrite', db: 'test_db'}],
});

// Initialize employees collection
db.employees.insertMany([
  {
    name: 'test',
    contactInfo: 'test@example.com',
  },
  {
    name: 'John Doe',
    contactInfo: 'john.doe@example.com',
  },
  {
    name: 'Jane Smith',
    contactInfo: 'jane.smith@example.com',
  },
]);

// Initialize reservations collection
db.reservations.insertMany([
  {
    guestName: 'Alice Johnson',
    contactInfo: 'alice.johnson@example.com',
    expectedArrivalTime: new Date('2025-02-20T18:00:00Z'),
    tableSize: 3,
    status: 'confirmed',
  },
  {
    guestName: 'Bob Brown',
    contactInfo: 'bob.brown@example.com',
    expectedArrivalTime: new Date('2025-02-20T19:00:00Z'),
    tableSize: 2,
    status: 'confirmed',
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: 'charlie.davis@example.com',
    expectedArrivalTime: new Date('2025-02-21T18:00:00Z'),
    tableSize: 1,
    status: 'confirmed',
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: 'alice.johnson@example.com',
    expectedArrivalTime: new Date('2025-02-21T19:00:00Z'),
    tableSize: 2,
    status: 'confirmed',
  },
  {
    guestName: 'Bob Brown',
    contactInfo: 'bob.brown@example.com',
    expectedArrivalTime: new Date('2025-02-22T18:00:00Z'),
    tableSize: 3,
    status: 'cancelled',
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: 'charlie.davis@example.com',
    expectedArrivalTime: new Date('2025-02-22T19:00:00Z'),
    tableSize: 1,
    status: 'cancelled',
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: 'alice.johnson@example.com',
    expectedArrivalTime: new Date('2025-02-23T18:00:00Z'),
    tableSize: 2,
    status: 'cancelled',
  },
  {
    guestName: 'Bob Brown',
    contactInfo: 'bob.brown@example.com',
    expectedArrivalTime: new Date('2025-02-23T19:00:00Z'),
    tableSize: 3,
    status: 'completed',
  },
  {
    guestName: 'Charlie Davis',
    contactInfo: 'charlie.davis@example.com',
    expectedArrivalTime: new Date('2025-02-24T18:00:00Z'),
    tableSize: 1,
    status: 'completed',
  },
  {
    guestName: 'Alice Johnson',
    contactInfo: 'alice.johnson@example.com',
    expectedArrivalTime: new Date('2025-02-24T19:00:00Z'),
    tableSize: 2,
    status: 'completed',
  },
]);
