let User = (id, fname, lname, email, password, role) => {
  this._id = id;
  this.first_name = fname;
  this.last_name = lname;
  this.email = email;
  this.password = password;
  this.role = role;
}

module.exports = User;