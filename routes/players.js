const express = require("express");
const router = express.Router();
const {getPlayers, createPlayers, updatePlayers, deletePlayers} = require("../controllers/player.js")
const upload = require('../middlewares/uploadImg.js');


router.route("/").get( getPlayers); 
router.route("/add").post( upload.single('Image'), createPlayers);
router.route("/update/:id").put(updatePlayers);
router.route("/delete/:id").delete(deletePlayers)

module.exports = router