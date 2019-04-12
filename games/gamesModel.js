const db = require('../data/dbConfig.js');

module.exports = {
  add,
  update,
  remove,
  find,
  findById,
};

async function add(game) {
  const [id] = await db('games').insert(game);
  return db('games')
    .where({ id })
    .first();
}

async function update(id, changes) {
  return null;
}

async function remove(id) {
  return null;
}

function find() {
  return db('games');
}

function findById(id) {
  return null;
}
