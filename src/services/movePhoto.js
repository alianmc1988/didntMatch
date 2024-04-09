const movePhoto = async ({ event, photoAttr, storageService }) => {
	const spradedEvent = { ...event }
	const { name, hash } = photoAttr
	spradedEvent[photoAttr.name] =
		await storageService.moveTempFileToPermanentStorage({
			event: spradedEvent,
			hash,
			photoAttr: name,
		})

	return spradedEvent
}

module.exports = { movePhoto }
