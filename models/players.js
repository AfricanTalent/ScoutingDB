const mongoose = require("mongoose")
// const { v4: uuidv4 } = require('uuid')

const PlayerSchema = new mongoose.Schema({
    First_name: String,
    Last_name: String,
    Gender: String,
    Date_of_Birth: Date,
    Position: String,
    Nationality: String,
    NationalityISO: String,
    Club: String,
    Preferred_Foot: String,
    Status: String, 
    Coach: String, 
    Number_of_coach: String,
    Region_scouted_in: String,
    Scouted_By: String,
    Image: String,
})

const PlayerModel = mongoose.model("Player", PlayerSchema) //creating a collection
module.exports = PlayerModel
