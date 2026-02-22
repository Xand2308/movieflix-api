import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movies.findMany({
      include: {
        genres: true,
        languages: true
      }
    });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
