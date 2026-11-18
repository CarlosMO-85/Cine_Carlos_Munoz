import { Router } from 'express';
import {
  handleDeletePeliculaByIdRequest,
  handleGetPeliculaByIdRequest,
  handleGetPeliculasRequest,
  handleInsertPeliculaRequest,
  handleUpdatePeliculaByIdRequest,
} from './controller.js';

export const peliculaRoutes = Router();

peliculaRoutes.post('/pelicula', handleInsertPeliculaRequest);
peliculaRoutes.get('/peliculas', handleGetPeliculasRequest);
peliculaRoutes.get('/pelicula/:id', handleGetPeliculaByIdRequest);
peliculaRoutes.put('/pelicula/:id', handleUpdatePeliculaByIdRequest);
peliculaRoutes.patch('/pelicula/:id', handleUpdatePeliculaByIdRequest);
peliculaRoutes.delete('/pelicula/:id', handleDeletePeliculaByIdRequest);
