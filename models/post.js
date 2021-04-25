function Post(id = null, title, body, userID) {

    this._id = id;
    this.post_title = title;
    this.post_body = body;
    this.user_id = userID;
}

module.exports = Post;
