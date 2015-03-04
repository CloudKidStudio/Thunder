var nodemailer = require('nodemailer');

module.exports = function(mailOptions, callback)
{
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: settings.gmailUser,
			pass: settings.gmailPassword
		}
	});
	transporter.sendMail(mailOptions, callback);
};