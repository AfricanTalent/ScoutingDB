const express = require("express");
const router = express.Router();
const {getPlayers, createPlayers,updatePlayers, deletePlayers,
     getTrialPlayers, addComment, getComments, addEndDate, addStartDate} = require("../controllers/player.js")
const upload = require('../middlewares/uploadImg.js');


router.route("/").get( getPlayers); 
router.route("/trials").get( getTrialPlayers); 

router.route("/comments/:id").get(getComments); 
router.route("/trials/comment/:id").put(addComment); 
router.route("/trials/startDate/:id").put(addStartDate); 
router.route("/trials/endDate/:id").put(addEndDate); 


router.route("/add").post( upload.single('Image'), createPlayers);
router.route("/update/:id").put(upload.single('Image'),updatePlayers);
router.route("/delete/:id").delete(deletePlayers)

module.exports = router

