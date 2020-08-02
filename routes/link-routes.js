const { Router } = require("express");
const Link = require("../models/Link");
const auth = require("../middleware/auth-middleware");
const config = require("config");
const shortid = require("shortid");
const router = Router();

router.post("/generate", auth, async (req, res) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = req.body;

    const code = shortid.generate();
    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();

    return res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так попробуйте снова" });
    console.log(error);
  }
});

router.get("/", auth, async (req, res) => {
  // auth является мидлвеером, который подставляет jwtToken в запрос, чтобы сервер знал, что пользователь автоизован
  try {
    const links = await Link.find({ owner: req.user.userId }); // если токен есть, то находится пользователь по id, который мы вытащили из токена в мидлвеере
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так попробуйте снова" });
    console.log(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так попробуйте снова" });
    console.log(error);
  }
});
module.exports = router;
