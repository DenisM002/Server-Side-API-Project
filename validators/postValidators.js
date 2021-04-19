// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');
const baseValidator = require('./baseValidators')

// models
const Post = require('../models/post.js');

// Validate the body data, sent by the client, for a new post
// formPost represents the data filled in a form
// It needs to be validated before using in the application
let validatePost = (formPost) => {
    // Declare constants and variables
    let validatedPost;

    // New posts do not have an ID
    let postID = 0;

    // debug to console - if no data
    if (formPost === null) {
        console.log("validateNewPost(): Parameter is null");
    };

    // Check if post has an id, i.e already exists. New posts will not have an id.
    if (formPost.hasOwnProperty('_id') ) {
        postID = formPost._id;
    }

    // Validate form data for new post fields
    // Creating an post does not need an post id
    // Adding '' to the numeric values makes them strings for validation purposes ()
    // appending + '' to numbers as the validator only works with strings

    if (
        baseValidator.id(postID) &&
        //validator.isNumeric(formPost._id + '', { no_symbols: true, allow_negatives: false }) &&
        !validator.isEmpty(formPost.post_title) &&
        !validator.isEmpty(formPost.post_body)) {

        // Validation passed
        // create a new post instance based on post model object
        // no value for post id (passed as null)
        validatedPost = new Post (
            formPost._id,
            // escape is to sanitize - it removes/ encodes any html tags
            validator.escape(formPost.post_title),
            validator.escape(formPost.post_body),
        );

    } else {
        // debug
        console.log("validateNewPost(): Validation failed");
    }

    // return new validated post object
    return validatedPost;
}


module.exports = {
    validatePost,
}