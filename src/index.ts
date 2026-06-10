import express, { type Request, type Response } from 'express';
import { prisma } from './lib/prisma.js'; 


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //Allows the server to read JSON from the request body

// 1. GET all users
app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// 2. POST a new user (Create)
app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});

// 3. GET a specific user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id)},
  });
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
});

app.listen(PORT, () => {
  console.log('🚀 Server is running on http://localhost:${process.env.PORT || 3000}');
});
