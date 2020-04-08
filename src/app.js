const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function isIdValid (request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({"error":"ID not valid."});
  }
  return next();
}

app.use("/repositories/:id", isIdValid);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;  
  const repo = {
    "id" : uuid(),
    "title" : title,
    "url" : url,
    "techs" : techs,
    "likes" : 0,
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const repoToUpdt = repositories[repoIndex];

  const updatedRepo = {
    "id" : id,
    "title" : title,
    "url" : url,
    "techs" : techs,
    "likes" : repoToUpdt.likes,
  }

  repositories[repoIndex] = updatedRepo;

  return response.status(204).send();
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repo = repositories.find(repo => repo.id === id);
  repo.likes++;
  
  return response.json(repo);
});

module.exports = app;
