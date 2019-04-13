const express = require('express');

const games = require('../games/gamesModel.js');

const server = express();

server.use(express.json());

server.get('/games', async (req, res) => {
  const list = await games.find();
  res.status(200).json(list);
});

server.post('/games', async (req, res) => {
  if (req.body === {} || !req.body.title || !req.body.genre){     
    res.status(422).json({message: 'missing information'});
  }
  else {
    const newgame = await games.find().where({title: req.body.title}).first();
    if (!newgame) {
      const game = await games.add(req.body);
      res.status(200).json(game);
    }
    else {
      res.status(405).json({message: 'this title already exists'});
    }
  }
});

module.exports = server;

