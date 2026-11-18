import { ObjectId } from 'mongodb';
import { getDB } from '../common/db.js';
import { Actor } from './actor.js';

export const actorCollection = () => getDB().collection('actores');

export async function handleInsertActorRequest(request, response) {
  const { idPelicula } = request.body;

  if (!idPelicula) {
    return response.status(400).json({ message: 'idPelicula es requerido' });
  }

  let pelicula;
  if (ObjectId.isValid(idPelicula)) {
    pelicula = await getDB()
      .collection('peliculas')
      .findOne({ _id: new ObjectId(idPelicula) })
      .catch(() => null);
  }

  if (!pelicula) {
    pelicula = await getDB()
      .collection('peliculas')
      .findOne({ nombre: idPelicula })
      .catch(() => null);
  }

  if (!pelicula) {
    return response.status(404).json({ message: 'Película asignada no encontrada' });
  }

  const actor = Object.fromEntries(
    Object.keys(Actor)
      .filter((campo) => campo !== '_id')
      .map((campo) => [campo, request.body[campo]]),
  );
  actor.idPelicula = pelicula._id.toString();

  actorCollection()
    .insertOne(actor)
    .then((result) => response.status(201).json({ _id: result.insertedId, ...actor }))
    .catch(() => response.status(500).json({ message: 'Error al crear el actor' }));
}

export async function handleGetActoresRequest(_request, response) {
  actorCollection()
    .find({})
    .toArray()
    .then((actores) => response.status(200).json(actores))
    .catch(() => response.status(500).json({ message: 'Error al obtener los actores' }));
}

export async function handleGetActorByIdRequest(request, response) {
  try {
    const id = new ObjectId(request.params.id);

    actorCollection()
      .findOne({ _id: id })
      .then((actor) => {
        if (actor) {
          return response.status(200).json(actor);
        }

        return getDB()
          .collection('peliculas')
          .findOne({ _id: id })
          .then((pelicula) => {
            if (!pelicula) {
              return response.status(404).json({ message: 'Actor o película no encontrada' });
            }

            return actorCollection()
              .find({ idPelicula: pelicula._id.toString() })
              .toArray()
              .then((actores) => {
                if (actores.length === 0) {
                  return response.status(404).json({ message: 'No existen actores para la película' });
                }
                return response.status(200).json(actores);
              });
          });
      })
      .catch(() => response.status(500).json({ message: 'Error al obtener el actor o los actores' }));
  } catch (_error) {
    response.status(400).json({ message: 'Id mal formado' });
  }
}

export async function handleGetActoresByPeliculaIdRequest(request, response) {
  let actores;
  const parametro = request.params.pelicula || request.params.idPelicula;

  if (ObjectId.isValid(parametro)) {
    actores = await actorCollection()
      .find({ idPelicula: parametro })
      .toArray()
      .catch(() => null);
  }

  if (!actores) {
    const pelicula = await getDB()
      .collection('peliculas')
      .findOne({ nombre: parametro })
      .catch(() => null);

    if (pelicula) {
      actores = await actorCollection()
        .find({ idPelicula: pelicula._id.toString() })
        .toArray()
        .catch(() => null);
    }
  }

  if (!actores) {
    return response.status(404).json({ message: 'Película no encontrada' });
  }

  if (actores.length === 0) {
    return response.status(404).json({ message: 'No existen actores para la película' });
  }

  return response.status(200).json(actores);
}
