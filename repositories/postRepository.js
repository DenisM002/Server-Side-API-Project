// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// Get all posts from the posts table
// for json path - Tell MS SQL to return results as JSON (avoiding the need to convert here)
const SQL_SELECT_ALL = 'SELECT * FROM dbo.post ORDER BY _id DESC for json path;';
// Create a new post and return result
const SQL_INSERT = 'INSERT INTO dbo.post (post_title, post_body) VALUES (@postTitle, @postBody); SELECT * from dbo.post WHERE _id = SCOPE_IDENTITY();';
// Update existing post
const SQL_UPDATE = 'UPDATE dbo.post SET post_title = @postTitle, post_body = @postBody WHERE _id = @id; SELECT * FROM dbo.post WHERE _id = @id;';
// Delete existing post
const SQL_DELETE = 'DELETE FROM dbo.post WHERE _id = @id;';
// Get a single product matching a id, @id
// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.post WHERE _id = @id for json path, without_array_wrapper;';




// Get all posts
// This is an async function named getPosts defined using ES6 => syntax
let getPosts = async () => {
    // define variable to store post
    let posts;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);

        // first element of the recordset contains posts
        posts = result.recordset[0];
        console.log(posts);

        // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all posts: ', err.message);
    }

    // return posts
    return posts;
};

// create a new post - parameter: a validated post model object
let createPost = async (post) => {
    // Declare constants and variables
    let insertedPost;
    // Insert a new post
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            // checks for potential sql injection
            .input('postTitle', sql.NVarChar, post.post_title)
            .input('postBody', sql.NVarChar, post.post_body)
                
            // Execute Query
            .query(SQL_INSERT)

        // The newly inserted post is returned by the query
        insertedPost = result.recordset[0];
    } catch (err) {
        console.log('DB Error - error inserting a new post: ', err.message);
    }
    // Return the post data
    return insertedPost;

};

// create a new post - parameter: a validated post model object
let updatePost = async (post) => {
    // Declare constants and variables
    let updatedPost;
    // Insert a new post
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            // checks for potential sql injection
            .input('id', sql.Int, post._id)
            .input('postTitle', sql.NVarChar, post.post_title)
            .input('postBody', sql.NVarChar, post.post_body)
                
            // Execute Query
            .query(SQL_UPDATE)

        // The newly inserted post is returned by the query
        insertedPost = result.recordset[0];
    } catch (err) {
        console.log('DB Error - error updating post: ', err.message);
    }
    // Return the post data
    return updatedPost;

};

// delete a post
let deletePost = async (postId) => {
    // record how many rows were deleted  > 0 = success
    let rowsAffected = 0;
    // returns a single post with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, postId)
            // execute query
            .query(SQL_DELETE);

        // Was the post deleted?    
        rowsAffected = Number(result.rowsAffected);
    } catch (err) {
        console.log('DB Error - get post by id: ', err.message);
    }
    // Nothing deleted
    if (rowsAffected === 0)
        return false;
    // successful delete
    return true;
};

// get post by id
// This is an async function named getPostById defined using ES6 => syntax
let getPostById = async (postId) => {

    let post;

    // returns a single post with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, postId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        post = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get post by id: ', err.message);
    }

    // return the post
    return post;
};


// Export 
module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById
};