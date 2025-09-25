const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// //add todo
// app.post("/api/todos", async (req, res) => {
//     const { title } = req.body;
//     if ()
// })

app.listen(3000, (() => {
    console.log(`server running on http://localhost:3000`);

}));

//todo 
let todos = [
    { id: 1, title: "learn node.js", completed: false },
    { id: 2, title: "learn express.js", completed: false }
];

//get all 
app.get("/api/todos", async (req, res) => {
    res.status(200).json({
        items: todos,
        total: todos.length,
    });
});

//get by id 
app.get("/api/todos/:id", async (req, res) => {
    const id = req.params;
    const todo = todos.find((t) => t.id == id)
    if (!todo) {
        return res.status(404).json({ message: "todo not found" })
    }
    res.status(200).json(todo);
});


//delete by id 
app.delete("/api/todos/:id", async (req, res) => {
    const id = req.params;
    const todo = todos.find((t) => t.id == id)
    if (todo === -1) {
        return res.status(404).json({ message: "todo not found" })
    }
    todos.splice(todo, 1);
    res.status(204).send();
});
