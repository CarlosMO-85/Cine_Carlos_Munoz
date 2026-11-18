import { Router } from 'express';
import { ObjectId } from 'mongodb';
import {
  handleGetActoresByPeliculaIdRequest,
  handleGetActorByIdRequest,
  handleGetActoresRequest,
  handleInsertActorRequest,
} from './controller.js';

export const actorRoutes = Router();

actorRoutes.post('/actor', handleInsertActorRequest);
actorRoutes.get('/actores', handleGetActoresRequest);
actorRoutes.get('/actor/pelicula/:pelicula', handleGetActoresByPeliculaIdRequest);
actorRoutes.get('/actor/:identificador', (request, response, next) => {
  if (ObjectId.isValid(request.params.identificador)) {
    request.params.id = request.params.identificador;
    return handleGetActorByIdRequest(request, response, next);
  }

  request.params.pelicula = request.params.identificador;
  return handleGetActoresByPeliculaIdRequest(request, response, next);
});
