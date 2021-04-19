const router = require('express').Router();
const postService = require('../services/postService.js');

// Auth0
const { authConfig, checkJwt, checkAuth } = require('../middleware/jwtAuth.js');

// GET listing of all posts
// Address http://server:posts
// returns JSON
router.get('/', async (req, res) => {

    // Get all posts
    try {
        // Call the post service to get a list of posts
        // getPosts() is an async function so use await
        const result = await postService.getPosts();
        // send json result via HTTP
        res.json(result);

        // Catch and send any errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET a single post by id
// id passed as parameter via url
// Address http://server:port/post/:id
// returns JSON
router.get('/:id', async (req, res) => {

    // read value of id parameter from the request url - note param and not req
    const postId = req.params.id;

    // If validation passed execute query and return results
    // returns a single post with matching id
    try {
        // Send response with JSON result    
        let result = await postService.getPostById(postId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

router.post('/', async (req, res) => {

    // Request body contains the post data
    const newPost = req.body;
    // show what was copied in the console (server side)
    console.log("postController: ", newPost);
    // Create new posts
    try {
        // Call function to createPost
        const result = await postService.createPost(newPost);
        // send json result via HTTP
        res.json(result);

        // Catch and send any errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

router.put('/', async (req, res) => {
    // Request body contains the post data
    const post = req.body;
    // show what was copied in the console (server side)
    console.log("postController update: ", post);
    // Create new posts
    try {
        // Call function to createPost
        const result = await postService.updatePost(post);
        // send json result via HTTP
        res.json(result);

        // Catch and send any errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// DELETE single post by id.
// Takes in ONLY the id of the post from the client!!
router.delete('/:id', async (req, res) => {
    // read value of id parameter from the request url
    const postId = req.params.id;
    // If validation passed execute query and return results
    // returns a single post with matching id
    try {
        // Send response with JSON result    
        const result = await postService.deletePost(postId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});



// Export as a module
module.exports = router;