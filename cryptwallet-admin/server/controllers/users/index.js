const User = require('../../models/user');

module.exports = {
  async userList(req, res) {
    console.log('Are you here');
    await User.find({ role: { $ne: 'admin' } })
      .then(users => {
        if (!users) {
          return res.status(400).json({ message: 'Users not found' });
        }
        return res.status(200).json({ users });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).json({ message: 'ERROR WHILE LOGGING IN', err });
      });
  },
};
