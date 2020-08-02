const { Router } = require("express");
const Link = require("../models/Link");
const router = Router();

router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      link.clicks++;
      link.save();
      res.redirect(link.from);
    } else {
      res.status(404).json("Ссылка не найдена");
    }
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так попробуйте снова" });
    console.log(error);
  }
});

module.exports = router;
