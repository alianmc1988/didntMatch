const gateEventPostBuilder = async ({
	event,
	moveFilesFromTempToPermanentInEventFunction,
}) => {
	const { licensePlateDetails } = event

	const plateParams = {
		attr: 'platePhoto',
		photoHash: licensePlateDetails?.photoHash,
	}

	const vehiclePhotoParams = {
		attr: 'vehiclePhoto',
		photoHash: licensePlateDetails?.vehiclePhotoHash,
	}
	return moveFilesFromTempToPermanentInEventFunction(event, [
		plateParams,
		vehiclePhotoParams,
	])
}

module.exports = { gateEventPostBuilder }
