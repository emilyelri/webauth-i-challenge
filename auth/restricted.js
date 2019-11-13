module.exports = (req, res, next) => {
  console.log(req.session.username)
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ you: "Unauthorized" });
  }
};
