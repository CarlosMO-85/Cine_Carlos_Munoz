import { ObjectId } from 'mongodb';
import { getDB } from '../common/db.js';
import { Pelicula } from './pelicula.js';

export const peliculaCollection = () => getDB().collection('peliculas');

export async function handleInsertPeliculaRequest(request, response) {
  const pelicula = Object.fromEntries(
    Object.keys(Pelicula)
      .filter((campo) => campo !== '_id' && request.body[campo] !== undefined)
      .map((campo) => [campo, request.body[campo]]),
  );

  peliculaCollection()
    .insertOne(pelicula)
    .then((result) => response.status(201).json({ _id: result.insertedId, ...pelicula }))
    .catch(() => response.status(500).json({ message: 'Error al crear la película' }));
}

export async function handleGetPeliculasRequest(_request, response) {
  peliculaCollection()
    .find({})
    .toArray()
    .then((peliculas) => response.status(200).json(peliculas))
    .catch(() => response.status(500).json({ message: 'Error al obtener las películas' }));
}

export async function handleGetPeliculaByIdRequest(request, response) {
  try {
    const id = new ObjectId(request.params.id);

    peliculaCollection()
      .findOne({ _id: id })
      .then((pelicula) => {
        if (!pelicula) {
          return response.status(404).json({ message: 'Película no encontrada' });
        }
        return response.status(200).json(pelicula);
      })
      .catch(() => response.status(500).json({ message: 'Error al obtener la película' }));
  } catch (_error) {
    response.status(400).json({ message: 'Id mal formado' });
  }
}

export async function handleUpdatePeliculaByIdRequest(request, response) {
  try {
    const id = new ObjectId(request.params.id);
    const cambios = {};

    for (const campo of ['nombre', 'generos', 'anioEstreno']) {
      if (request.body[campo] !== undefined) {
        cambios[campo] = request.body[campo];
      }
    }

    peliculaCollection()
      .updateOne({ _id: id }, { $set: cambios })
      .then((result) => {
        if (result.matchedCount === 0) {
          return response.status(404).json({ message: 'Película no encontrada' });
        }
        return response.status(200).json({ ...cambios, matchedCount: result.matchedCount });
      })
      .catch(() => response.status(500).json({ message: 'Error al actualizar la película' }));
  } catch (_error) {
    response.status(400).json({ message: 'Id mal formado' });
  }
}

export async function handleDeletePeliculaByIdRequest(request, response) {
  try {
    const id = new ObjectId(request.params.id);

    peliculaCollection()
      .deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount === 0) {
          return response.status(404).json({ message: 'Película no encontrada' });
        }
        return response.status(200).json({ message: 'Película eliminada' });
      })
      .catch(() => response.status(500).json({ message: 'Error al eliminar la película' }));
  } catch (_error) {
    response.status(400).json({ message: 'Id mal formado' });
  }
}
