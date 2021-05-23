const User = require('../../models/user');

module.exports = {
  async userList(req, res) {
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

  async addUser(req, res) {
    try {
      if (!req.body.firstName || !req.body.lastName || !req.body.mail) {
        return res.status(400).json({
          message: 'FirstName, lastName and Email fields are required',
        });
      }
      const mail = req.body.mail;
      mail.toLowerCase();
      const emailExist = await User.findOne({ mail: mail });
      if (emailExist)
        return res.status(400).json({ message: 'Email already exist!' });
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mail: mail,
        phone: req.body.phone,
        role: req.body.role,
      });
      const savedUser = await user.save().then(user => {
        /* const mailTemplat = `Account created ...`
            mailer.sendEmail('verify@Crypto-Petty.com', user.mail , 'please verfiy your account', html);*/
        res.status(200).json({ message: 'User added successfully' });
      });
    } catch (error) {
      res.status(400).json({ message: 'ERROR WHILE ADDING USER', error });
    }
  },
};
