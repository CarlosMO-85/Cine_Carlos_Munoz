import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB, getDB } from './src/common/db.js';
import { peliculaRoutes } from './src/pelicula/routes.js';
import { actorRoutes } from './src/actor/routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_request, response) => {
  response.status(200).send('Bienvenido al cine Iplacex');
});

app.use('/api', peliculaRoutes);
app.use('/api', actorRoutes);

try {
  await connectDB();
  const database = getDB();

  app.listen(port, () => {
    console.log(`Servidor Express iniciado exitosamente en el puerto ${port}`);
    console.log(`Conexión a Atlas exitosa. Base de datos activa: ${database.databaseName}`);
  });
} catch (error) {
  console.error('Error al conectar con MongoDB Atlas:', error.message);
  process.exit(1);
}
