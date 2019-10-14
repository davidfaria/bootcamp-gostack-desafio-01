const express = require("express");
const server = express();
server.use(express.json());

const projects = [];
let counterRequest = 0;

server.get("/", (req, res) => {
  return res.json({ name: "Api myProject", version: "1.0.0" });
});

//Middlewares

//Counter Requests
server.use((req, res, next) => {
  counterRequest++;
  console.log(`Total Requests: ${counterRequest}`);
  return next();
});

//check if project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id == id);
  if (index < 0) {
    return res.json({ error: "Project Not Found" });
  }

  req.indexProject = index;
  return next();
}

// list All projects and tasks
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// add new Project
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({
    id,
    title,
    tasks
  });

  return res.json({ message: "Project successfully added", projects });
});

// update Title Project
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  projects[req.indexProject].title = title;
  const project = projects[req.indexProject];
  return res.json({ message: "Project successfully updated", project });
});

//delete Project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects.splice(req.indexProject, 1);
  return res.json({ deleted: true });
});

//add task into Project
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;
  projects[req.indexProject].tasks.push(title);
  const project = projects[req.indexProject];
  return res.json({ message: "Task successfully added", projects });
});

server.listen(3000);
