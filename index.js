const express = require("express");
let fakeData = require("./api.json");

let count = 0;

const app = express();

app.use(express.json());

function VerifyId(req, res, next) {
  const { id } = req.params;

  const notExist = !fakeData.find(el => el.id === id);
  if (notExist) return res.status(404).json({ error: "id does not exists" });

  return next();
}

function log(req, res, next) {
  count += 1;
  console.log(count);

  return next();
}

app.use(log);

app.get("/projects", (req, res) => {
  return res.json(fakeData);
});

app.get("/projects/:id", VerifyId, (req, res) => {
  const { id } = req.params;

  const data = fakeData.find(el => el.id === id);

  return res.json(data);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const obj = {
    id,
    title,
    tasks: []
  };

  fakeData.push(obj);

  return res.json(fakeData);
});

app.put("/projects/:id", VerifyId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  fakeData.map(el => {
    if (el.id === id) {
      el.title = title;
    }

    return el;
  });

  return res.json(fakeData);
});

app.delete("/projects/:id", VerifyId, (req, res) => {
  const { id } = req.params;

  fakeData = fakeData.filter(el => el.id !== id);

  return res.json(fakeData);
});

app.post("/projects/:id/tasks", VerifyId, (req, res) => {
  const { id } = req.params;
  const { tasks, title } = req.body;

  fakeData.map(el => {
    if (el.id === id) {
      el.tasks.push(...tasks);
      el.title = title;
    }
  });

  return res.json(fakeData);
});

app.listen(3000);
