const router = require('express').Router();
const postService = require('../services/postService.js');

// Auth0
const { authConfig, checkJwt, checkAuth } = require('../middleware/jwtAuth.js');
const userService = require("../services/userService.js");

// GET listing of all posts
// Address http://server:posts
// returns JSON
router.get('/', async (req, res) => {

    // Get info from user profile
    // if logged in (therefore access token exists)
    // get token from request
    if (req.headers['authorization']) {
        try {

            let token = await req.headers['authorization'].replace('Bearer ', '');
            const userProfile = await userService.getAuthUser(token);
            console.log("%c user profile: ", 'color: blue', userProfile);
            console.log("%c user email: ", 'color: blue', userProfile.email);
        } catch (err) {
            console.log(`ERROR getting user profile: ${err.message}`);
        }
    }

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
// checkJwt authenticatesd the user - did the request contain a valid JWT?
// chekAuth checks permissions - does the JWT include create:posts (authConfig.create)rss
router.post('/', checkJwt, checkAuth([authConfig.create]), async (req, res) => {

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

router.put('/',  checkJwt, checkAuth([authConfig.update]), async (req, res) => {
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
router.delete('/:id', checkJwt, checkAuth([authConfig.delete]), async (req, res) => {
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