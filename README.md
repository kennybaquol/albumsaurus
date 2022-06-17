# Albumsaurus

## Premise: 
Albumsaurus is full stack web app that allows users to discover and learn about different albums in a Netlifx-style UI. By clicking on an album's artwork or title on screen, the SHOW page will display to the user that album's release date, genre, personnel, (and ideally some billboard chart info, i.e. top spot)


## The User Story:
As a user, I would like to
• Create an account and login
• Click on random albums that pop up to learn more about them
• Save albums I like into a section for My Favorites
• Edit info for albums in My Favorites
• Delete albums from My Favorites

## The Wireframe:
![ERD](public/imgs/P2-Wireframe.png)

## The ERD: 
![ERD](public/imgs/P2-ERD.png)

## Route Table:
| **URL**          | **HTTP Verb**|**Action**|
|----------------------|--------------|----------|
| /albums              | GET          | index  
| /albums/new          | GET          | new      
| /albums              | POST         | create    
| /albums/:id          | GET          | show   
| /albums/:id/edit     | GET          | edit     
| /albums/:id/favorite | GET          | favorite      
| /albums/:id          | PUT          | update    
| /albums/:id          | DELETE       | delete  

## Technologies Used:
- Deezer API
- AudioDB API
- MongoDB
- Express
- Node
- JavaScript
- CSS
- HTML5

## How To Use:
Once you've made an account, simply log in, find an album cover that looks interesting, and start acquiring knowledge!

## MVP Requirements:
- [x] Have at least 2 models (more if they make sense) that represents the main functional idea for your app.
- [x] Incorporate at least one API. List of examples here: (Public API List)[https://github.com/public-apis/public-apis].
- [x] Have complete RESTful routes for at least one of your resources with GET, POST, PUT, and DELETE
- [x] Utilize an ODM to create a database table structure and interact with your MongoDb-stored data
- [] Include a readme file that explains how to use your app and contains a route table for your RESTful routes
- [] Have semantically clean HTML, CSS, and back-end code
- [x] Be deployed online and accessible to the public


## Stretch goals / ICE BOX:
- [x] User creation and authorization
- [] Delete summaries and albums once they've been altered or removed from My Favorites
- [] Fix async/await bug that doesn't copy the entire description from the AudioDB API
- [] Add styling rules so that all medium and big artwork pictures are the same size throughout the different routes
- [] Give users the ability to search through their favorite albums for quicker future reference
- [] Replace Last FM API with an API that has wiki summaries and additional interesting data on a higher percentage of albums (examples below)
    - [] https://developer.musixmatch.com/documentation/api-reference/album-get
    - [] https://developer.napster.com/api/v2.2#albums
    - [x] https://www.theaudiodb.com/api_guide.php
- [] Display how many users have an album saved
- [] Have discover section of index page change every 5 sections (w/ animations) instead of requiring the user to refresh the page every time