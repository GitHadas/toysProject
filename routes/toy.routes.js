const express = require("express");
const { auth } = require("../middlewares/auth");
const { getAll, search, getByCategory, createToy, updateToy, deleteToy, getById, getByRange } = require("../controllers/toy.controller");
const router = express.Router();

router.get("/", getAll);

router.get("/search", search);

router.get("/category/:catname", getByCategory);

router.post("/", auth(), createToy);

router.patch("/:editId", auth(), updateToy);

router.delete("/:delId", auth(), deleteToy);

router.get("/prices", getByRange)

router.get("/single/:id", getById);

module.exports = router;