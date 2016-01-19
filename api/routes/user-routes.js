import app from '../api';
import {User, Pub, Journal} from '../models';

import {cloudinary} from '../services/cloudinary';
import {sendInviteEmail} from '../services/emails';

app.get('/getUser', function(req, res) {
	const userID = req.user ? req.user._id : undefined;

	User.getUser(req.query.username, userID, (err, userData)=>{

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		return res.status(201).json(userData);

	});

});

app.post('/updateUser', function(req, res) {
	const userID = req.user ? req.user._id : undefined;
	if (!userID) { return res.status(403).json('Not authorized to edit this user'); }

	User.findById(userID, function(err, user){
		if (err) { console.log(err); return res.status(500).json(err); }

		const outputObject = req.body.newDetails;
		// user = {...user, ...req.body.newDetails};
		for (const key in req.body.newDetails) {
			if (req.body.newDetails.hasOwnProperty(key)) {
				user[key] = req.body.newDetails[key];
			}
		}

		if (req.body.newDetails.image) {
			cloudinary.uploader.upload(req.body.newDetails.image, function(cloudinaryResponse) {
				const thumbnail = cloudinaryResponse.url.replace('/upload', '/upload/c_limit,h_50,w_50');

				user.thumbnail = thumbnail;
				outputObject.thumbnail = thumbnail;
				user.save(function(err, result){
					if (err) { return res.status(500).json(err);  }
					return res.status(201).json(outputObject);
				});
			});
		} else {
			user.save(function(err, result){
				if (err) { return res.status(500).json(err);  }
				// console.log('outputObject', outputObject);
				return res.status(201).json(outputObject);
			});

		}
	});

});

app.post('/updateUserSettings', function(req, res) {
	const settingKey = Object.keys(req.body.newSettings)[0];

	User.findById(req.user._id, function(err, user){

		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		user.settings = user.settings ?  user.settings : {};
		user.settings[settingKey] = req.body.newSettings[settingKey];

		user.save(function(err, result){
			if (err) { return res.status(500).json(err);  }

			return res.status(201).json(user.settings);
		});

	});
});

app.post('/follow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $addToSet: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $addToSet: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $addToSet: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $addToSet: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}

});

app.post('/unfollow', function(req, res) {
	if (!req.user) { return res.status(403).json('Not authorized for this action'); }

	const userID = req.user._id;

	switch (req.body.type){
	case 'pubs':
		User.update({ _id: userID }, { $pull: { 'following.pubs': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Pub.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'users':
		User.update({ _id: userID }, { $pull: { 'following.users': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		User.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	case 'journals':
		User.update({ _id: userID }, { $pull: { 'following.journals': req.body.followedID} }, function(err, result){if(err) return handleError(err)});
		Journal.update({ _id: req.body.followedID }, { $pull: { followers: userID} }, function(err, result){if(err) return handleError(err)});
		return res.status(201).json(req.body);

	default:
		return res.status(500).json('Invalid type');
	}


});


app.post('/inviteReviewers', function(req, res) {
	const inviteData = req.body.inviteData;
	const pubId = req.body.pubID;
	Pub.getSimplePub(pubId, function(err, pub) {

		if (err) {res.status(500); }
		const pubName = pub.title;

		Journal.findByHost(req.query.host, function(err, journ) {
			const senderName = req.user.name;
			const journalName = (journ) ? journ.journalName : 'PubPub';

			for (let recipient of inviteData) {
				if (!recipient.twitter) {
					const emailCallback = function(error, email) {
						console.log(error);
						console.log(email);
					};
					sendInviteEmail({journalName, pubName, senderName, recipientEmail: recipient.email, recipientName: recipient.name, callback: emailCallback});
				} else {
					/*Send Tweets*/
				}
			}

			res.status(201).json({});
		});

	});


});
