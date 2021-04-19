// Dependencies
// Input validation package

// Require the postValidator
const postValidator = require('../validators/postValidators.js');
const baseValidators = require('../validators/baseValidators')

// require the database connection
const postRepository = require('../repositories/postRepository.js');

// Get all posts via the repository
// return posts
let getPosts = async () => {
    const posts = await postRepository.getPosts();
    return posts;
};

// Get post by id
// Validate input
// return post
let getPostById = async (postId) => {
    // Validate input using validator module
    // important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!baseValidators.id(postId)) {
        console.log("getPosts service error: invalid id parameter");
        return "invalid parameter";
    }
    // get post (if validation passed)
    const post = postRepository.getPostById(postId);
    return post;
};

// Create new post
// This function accepts post data as a parameter from the controller.
let createPost = async (post) => {
    // declare variables
    let newlyInsertedPost;
    // Call the post validator - kept seperate to avoid clutter here
    let validatedPost = postValidator.validatePost(post);
    // If validation returned an post object - save to database
    if (validatedPost != null) {
        newlyInsertedPost = await postRepository.createPost(validatedPost);
    } else {
        // post data failed validation
        newlyInsertedPost = { "error": "invalid post" };
        // log the result
        console.log("postService.createPost(): form data validate failed");
    }
    // return the newly inserted post
    return newlyInsertedPost;
};

let updatePost = async (post) => {
    // declare variables
    let updatedPost;
    // Call the post validator - kept seperate to avoid clutter here
    let validatedPost = postValidator.validatePost(post);
    // If validation returned an post object - save to database
    if (validatedPost != null) {
        updatedPost = await postRepository.updatePost(validatedPost);
    } else {
        // post data failed validation
        updatedPost = { "error": "invalid post" };
        // log the result
        console.log("postService.updatePost(): form data validate failed");
    }
    // return the newly inserted post
    return updatedPost;
};

// Delete a single post by id
// Validate input, call repository, return result
let deletePost = async (postId) => {
    let deleteResult = false;
    // Validate input
    // appending + '' to numbers as the validator only works with strings
    if (!baseValidators.id(postId)) {
        console.log("deletePost service error: invalid id parameter");
        return false;
    }
    // delete post by id
    // returnds result: true or false
    deleteResult = await postRepository.deletePost(postId);
    // return true if successfully deleted
    return deleteResult;
};

// Module exports
// expose these functions
module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById
};