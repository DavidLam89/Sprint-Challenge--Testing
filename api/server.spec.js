const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig.js');
const Games = require('../games/gamesModel.js');

describe('server.js', () => {

  beforeEach(async () => {
    await db('games').truncate();
  });

  describe('GET /games', () => {

    it('should respond with 200 OK', () => {
      return request(server)
        .get('/games')
        .then(response => {
          expect(200);
        });
    });

    it('should return JSON', () => {
      return request(server)
        .get('/games')
        .then(res => {
          expect(res.type).toBe('application/json');
        });
    });

    it('should return empty array if no game is in database', () => {
      return request(server)
        .get('/games')
        .then(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(0);
        });
    });

    it('should return an array of games', async () => {
      await Games.add({
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1980
      });
      await Games.add({
        title: 'Donkey Kong',
        genre: 'Arcade',
        releaseYear: 1981
      });
      await Games.add({
        title: 'Mario Bros',
        genre: 'Arcade',
        releaseYear: 1983
      });
      return request(server)
        .get('/games')
        .then(res => {
          expect(res.body).toHaveLength(3);
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('POST /game', () => {

    it('should respond with 200 if succeed', () => {
      return request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        })
        .then(response => {
          expect(200);
        });
    });

    it('should respond with 422 if missing information', () => {
      return request(server)
        .post('/games')
        .then(response => {
          expect(422);
        });
    });

    it('should respond with 422 if missing information', () => {
      return request(server)
        .post('/games')
        .send({
          genre: 'Arcade',
          releaseYear: 1980
        })
        .then(response => {
          expect(422);
        });
    });

    it('should respond with 422 if missing information', () => {
      return request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          releaseYear: 1980
        })
        .then(response => {
          expect(422);
        });
    });

    it('should return the game object if succeed', () => {
      return request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        })
        .then(res => {
          expect(res.body).toBeInstanceOf(Object);
        });
    });

    it('should return the game info if succeed', () => {
      return request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        })
        .then(res => {
         expect(res.body.title).toBe('Pacman');
        });
    });

    it('should respond with 405 if duplicate title', async () => {
      await Games.add({
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1980
      });
      return request(server)
        .post('/games')
        .send({
          title: 'Pacman',
          genre: 'Arcade',
          releaseYear: 1980
        })
        .then(response => {
          expect(405);
        });
    });
  });
});
