var express = require("express");
var User = require("../models/User");
var Todo = require("../models/Todo");
var User = require("../models/User");
var auth = require("../middlewares/auth");
var router = express.Router();

// get all todos
router.get("/", async (req, res, next) => {
  try {
    let todos = await Todo.find();
    return res.send({ todos });
  } catch (error) {
    console.log(error, "get Request");
    next(error);
  }
});

// get single todo
router.get("/:id", auth.verifyToken, async (req, res, next) => {
  let id = req.params.id;
  try {
    let singleTodo = await Todo.findOne({_id :id }).populate('author');
    // console.log(singleTodo, "Single Todo");
    return res.send({ singleTodo });
  } catch (error) {
    console.log(error, "single");
    next(error);
  }
});

// create Todo
router.post("/", auth.verifyToken, async (req, res, next) => {
  req.body.todo.author = req.user.userId;
  try {
    req.body.id = req.body.title;
    var todo = await Todo.create(req.body.todo);
    // console.log(todo, "todo created");
    res.json({ todo });
  } catch (error) {
    console.log(error, "Todo post  error");
    next(error);
  }
});





// Change isDone
router.post('/isdone/:id'), auth.verifyToken, async (req, res, next) => {
  console.log("Patch Request");
  let id = req.params.id;
  let data = req.body;
  try {
    let update = await Todo.findByIdAndUpdate(id, data);
    res.status(200).json({ update });
  } catch (error) {
    console.log(error, "from Isdone");
    next(error);
  }
}

// Update Todo
router.put("/update/:id", auth.verifyToken, async (req, res, next) => {
  let id = req.params.id;
  console.log(req.body);
  let data = req.body.todo;
  try {
    let update = await Todo.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({ update });
  } catch (error) {
    next(error);
  }
});


//Delete Todo
router.delete("/delete/:id", auth.verifyToken, async (req, res, next) => {
  let id = req.params.id;
  try {
    let deletedBook = await Todo.findByIdAndDelete(id);
    res.status(200).json({ deletedBook });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
