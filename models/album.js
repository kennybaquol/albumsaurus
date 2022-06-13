/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const mongoose = require("./connection");

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose

// make albums schema
const albumsSchema = new Schema({
    name: String,
    artist: String,
    id: String,
    mbid: String,
    // url: 
    releaseDate: Date,
    // img: 
    listeners: Number,
    playCount: Number,

  });
  
//  <album>
//   <name>Believe</name>
//   <artist>Cher</artist>
//   <id>2026126</id>
//   <mbid>61bf0388-b8a9-48f4-81d1-7eb02706dfb0</mbid>
//   <url>http://www.last.fm/music/Cher/Believe</url>
//   <releasedate>6 Apr 1999, 00:00</releasedate>
//   <image size="small">...</image>
//   <image size="medium">...</image>
//   <image size="large">...</image>
//   <listeners>47602</listeners>
//   <playcount>212991</playcount>
//   <toptags>
//     <tag>
//       <name>pop</name>
//       <url>http://www.last.fm/tag/pop</url>
//     </tag>
//     ...
//   </toptags>
//   <tracks>
//     <track rank="1">
//       <name>Believe</name>
//       <duration>239</duration>
//       <mbid/>
//       <url>http://www.last.fm/music/Cher/_/Believe</url>
//       <streamable fulltrack="0">1</streamable>
//       <artist>
//         <name>Cher</name>
//         <mbid>bfcc6d75-a6a5-4bc6-8282-47aec8531818</mbid>
//         <url>http://www.last.fm/music/Cher</url>
//       </artist>
//     </track>
//     ...
//   </tracks>
// </album>

// make album model
const Album = model("Album", albumsSchema)

////////////////////////////////////////////////
// Export model
////////////////////////////////////////////////
module.exports = Album