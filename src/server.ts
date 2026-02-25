import express from 'express';
import { PrismaClient } from '@prisma/client';

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/movies', async (_, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: 'asc'
    },
    include: {
      genres: true,
      languages: true
    }
  });
  res.json(movies);
});

app.post('/movies', async (req, res) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;

  try {
    // Case insensitive - se a busca for feita por john wick ou jhon wick ou JOHN WICK, O Rregistro vai ser retornado na consulta

    // case sensitive - se buscar por john wick e no banco estiver como john wick, não vai retornado na consulta

    const movieWithSameTitle = await prisma.movie.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } }
    });

    if (movieWithSameTitle) {
      return res
        .status(409)
        .send({ message: 'Já existe um Filme Cadastrado com esse Titulo ' });
    }

    await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date)
      }
    });
  } catch (error) {
    return res.status(500).send({ message: 'Falha ao Cadastra un Filme' });
  }
  res.status(201).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
