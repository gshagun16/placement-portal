let users = []; // in-memory storage

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.json({ message: "User already exists" });
  }

  const user = { id: Date.now(), name, email, password };
  users.push(user);

  res.json({ message: "User registered successfully" });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ message: "Wrong password" });
  }

  res.json({ message: "Login successful" });
};