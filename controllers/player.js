
const PlayerModel = require("../models/players")
const path = require('path')
require('dotenv').config();
const dbo = require("../db/conn.js")
const ObjectId = require("mongodb").ObjectId

const getPlayers = async (req,res) => {
    const db_connect = dbo.getDb()
    try{
        const players = await db_connect.collection("player").find({}).toArray()

     //    const playersData = players.map(player => {
     //        const playerData = player.toObject(); // Convert to plain object
     //        if (playerData.Image && Buffer.isBuffer(playerData.Image)) {
     //            playerData.Image = `data:image/jpeg;base64,${playerData.Image.toString('base64')}`;
     //        }
     //        return playerData;
     //        });

        res.status(200).json(players);
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const createPlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     try{
          const { First_name, Last_name, Gender, Date_of_Birth,
               Position, Nationality, NationalityISO, Club,
               Preferred_Foot, Status, Coach, 
               Number_of_coach, Region_scouted_in, Scouted_By } = req.body;

          if (!req.file) {
               return res.status(400).json({ message: 'No file uploaded' });
          }


          // Create a new image document
          const player = new PlayerModel({
               First_name, Last_name, Gender, Date_of_Birth,
               Position, Nationality, NationalityISO, Club,
               Preferred_Foot, Status, Coach, Number_of_coach, Region_scouted_in, Scouted_By,
               Image: `http://localhost:3000/${req.file.path}`// store the image path
          });

          await  db_connect.collection("player").insertOne(player) //req.body is request.body which means whatever the clients sends to the server must be shown in the console screen or browser
          res.status(200).json(player)
     
     } catch (error) {
          console.log(error.message )
          res.status(500).json({message: error.message})
     }
}

const updatePlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     const myquery = { _id: new ObjectId(req.params.id) }
     const body = {
          $set: {
               First_name: req.body.First_name,
               Last_name: req.body.Last_name,
               Gender: req.body.Gender,
               Date_of_Birth: req.body.Date_of_Birth,
               Position: req.body.Position,
               Nationality: req.body.Nationality,
               NationalityISO: req.body.NationalityISO,
               Club: req.body.Club,
               Preferred_Foot: req.body.Preferred_Foot,
               Status: req.body.Status,
               Coach: req.body.Coach,
               Number_of_coach: req.body.Number_of_coach,
               Region_scouted_in: req.body.Region_scouted_in,
               Scouted_By: req.body.Scouted_By,
          }
      }

     try{
          const {id} = req.params
          const player = await  db_connect.collection("player").updateOne(myquery, body)
          
          //if we cant find any player in database
          if(!player){
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          res.status(200).json(player)
     } catch(error){
          res.status(500).json({message: error.message})
     }
}

// const updatePlayers = async (req, res) => {
//      try {
//      const {_id} = req.params;
//      console.log(req.body);
//      console.log("edit");
//        const doc = await PlayerModel.findById( _id).select("+First_name +Gender");
//        if (doc) {
//      //     doc.First_name = await edit.First_name; 
//      //      doc.Last_name = await edit.Last_name; 
//      //       doc.Gender = await edit.Gender; 
//      //     doc.Date_of_Birth = await req.body.Date_of_Birth; 
//      //     doc.Position = await req.body.Position; 
//      //     doc.Nationality = await req.body.Nationality; 
//      //     doc.NationalityISO = await req.body.NationalityISO; 
//      //     doc.Club = await req.body.Club; // Update fields
//      //     doc.Preferred_Foot = await req.body.Preferred_Foot; // Update fields
//      //     doc.Status = await req.body.Status; // Update fields
//      //     doc.Number_of_coach = await req.body.Number_of_coach; // Update fields
//      //     doc.Region_scouted_in = await req.body.Region_scouted_in; // Update fields
//      //     doc.Scouted_By = await req.body.Scouted_By; // Update fields
//      //     doc.Image = await req.body.Image; // Update fields
//          await doc.save(); // Explicitly save
//         res.json(req.body);
//        } else {
//          console.log("Document not found");
//        }
//      } catch (error) {
//        console.error("Error updating document:", error.message);
//      }
//    }

const deletePlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     const id = { _id: new ObjectId(req.params.id) }
     try{
          const player = await db_connect.collection("player").deleteOne(id)
          if (!player) {
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          res.status(200).json(player)
     }
     catch(error){
          res.status(500).json({message: error.message})
     }
}

module.exports = {
     getPlayers,
     createPlayers,
     updatePlayers,
     deletePlayers,
}
