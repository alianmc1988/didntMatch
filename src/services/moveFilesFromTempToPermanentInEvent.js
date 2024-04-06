const moveFilesFromTempFileToPermanentInEvent = async (
	event,
	params = [],
	movePhotoFunc,
) => {
	const newEvent = { ...event }
	for (const param of params) {
		const { attr, photoHash } = param
		if (photoHash) {
			newEvent[attr] = await movePhotoFunc({
				event,
				hash: photoHash,
				photoAttr: attr,
			}) // Ainda tem acoplamento nessa parte
		}
	}
	return newEvent
}

module.exports = {
	moveFilesFromTempFileToPermanentInEvent,
}
