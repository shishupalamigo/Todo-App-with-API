var express = require("express");
var auth = require("../middlewares/auth");

var router = express.Router();
var User = require("../models/User");

router.get('/', auth.verifyToken, async (req, res, next) => {
  let id = req.userId;
  // console.log(id, "id");
  try {
    let user = await User.findById(id);
    var token = await user.signToken();

    res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    console.log(error, "from user");
    next(error);
  }
});

//registring new user
router.post('/register', async (req, res, next) => {
  // console.log(req.body, 'body');
  try {
    var user = await User.create(req.body.user);
    // console.log(user);
    var token = await user.signToken();
    return res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});


// User Login
router.post('/login', async (req, res, next) => {
  // console.log(req.body, "Req body");
  var { email, password } = req.body.user;
  if (!password || !email) {
    return res.status(400).json({ error: { body: 'Password/Email required' } });
  }
  try {
    var user = await User.findOne({ email });
    // console.log(user, "sign in");
    if (!user) {
      return res
        .status(400)
        .json({ error: { body: 'Email is not registered' } });
    }
    var result = await user.verifyPassword(password);
    // console.log(result, "result");
    if (!result) {
      return res.status(400).json({ error: { body: 'password is incorrect' } });
    }

    var token = await user.signToken();
    // console.log(token, "Token");
    return res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
