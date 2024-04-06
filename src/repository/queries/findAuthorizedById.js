const findAuthorizedById = async ({ authorizedBy, userModel }) => {
	const {
		_id: userId,
		profile: {
			photoId,
			public: { firstName = '(empty)', lastName = '(empty)', userPhotoHash },
		},
	} = await userModel.findById(authorizedBy)

	return {
		userId,
		firstName,
		lastName,
		photoId,
		photoHash: userPhotoHash,
	}
}

module.exports = { findAuthorizedById }
