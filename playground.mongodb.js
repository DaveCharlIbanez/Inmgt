use('inmgt');

db.users.insertOne({
  email: "john@example.com",
  password: "password123",
  role: "admin",
  firstName: "John",
  lastName: "Doe",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
