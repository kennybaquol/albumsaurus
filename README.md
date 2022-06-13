# Albumsaurus

## Premise: 
Albumsaurus is full stack web app that allows users to discover and learn about different albums in a Netlifx-style UI. By clicking on an album's artwork or title on screen, the SHOW page will display to the user that album's release date, genre, personnel, (and ideally some billboard chart info, i.e. top spot)

## The User Story:


## The Wireframes:
![ERD](public/imgs/P2-Wireframe.png)


## The ERD: 
![ERD](public/imgs/P2-ERD.png)


## Route Table:
| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /albums/         | GET          | index  
| /albums/new      | GET          | new       
| /albums/:id      | GET          | show   
| /albums/:id/edit | GET          | edit    
| /albums          | POST         | create      
| /albums/:id      | PUT          | update    
| /albums/:id      | DELETE       | destroy  

## Technologies Used:
- MongoDB
- Express
- Node
- JavaScript
- CSS
- HTML5


## How To Use:


## MVP Requirements:
- [] Have at least 2 models (more if they make sense) that represents the main functional idea for your app.
- [] Note: If your app idea doesn't really call for more models, let your instructors know and they can suggest ideas for other sufficiently difficult replacements for this requirement.
- [] Incorporate at least one API. List of examples here: (Public API List)[https://github.com/public-apis/public-apis].
- [] Have complete RESTful routes for at least one of your resources with GET, POST, PUT, and DELETE
- [] Utilize an ODM to create a database table structure and interact with your MongoDb-stored data
- [] Include a readme file that explains how to use your app and contains a route table for your RESTful routes
- [] Have semantically clean HTML, CSS, and back-end code
- [] Be deployed online and accessible to the public


## Stretch goals / ICE BOX:
- [] User creation and authorization
- [] Give users the ability to save their favorite albums for quicker future reference
- [] Incorporate an API based on scale (Billboard Top 200 for small scale, Wikipedia/Genius/LastFM for larger scale)
- [] Display how many users have an album saved
