const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const knexCfg = require('./knexfile').development;
const knex = require('knex')(knexCfg);
const app = express();
app.use(cors());
app.use(bodyParser.json());
const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.post('/auth/login', async (req,res)=>{
  const { username, password } = req.body;
  if(username === 'admin' && password === 'admin'){
    const token = jwt.sign({ user: 'admin' }, SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

function authenticate(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'No token'});
  const token = auth.split(' ')[1];
  try { req.user = jwt.verify(token, SECRET); next(); } catch(e) { res.status(401).json({error:'Invalid token'}); }
}

app.post('/sync/pull', authenticate, async (req,res)=>{
  const { since } = req.body;
  const rows = await knex('articles').where('last_modified','>', since).andWhere('deleted', false);
  res.json({ rows, serverTime: new Date().toISOString() });
});

app.post('/sync/push', authenticate, async (req,res)=>{
  const { changes } = req.body;
  const results = { applied: [], conflicts: [] };
  for(const item of changes){
    const server = await knex('articles').where({ id: item.id }).first();
    if(!server){
      await knex('articles').insert(item);
      results.applied.push(item.id);
      continue;
    }
    const serverLM = new Date(server.last_modified).getTime();
    const clientLM = new Date(item.last_modified).getTime();
    if(clientLM >= serverLM){
      await knex('articles').where({ id: item.id }).update(item);
      results.applied.push(item.id);
    } else {
      results.conflicts.push({ id: item.id, server, client: item });
    }
  }
  res.json(results);
});

app.listen(process.env.PORT || 4000, ()=>console.log('Sync server running'));
