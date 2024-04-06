const movePhoto = async ({ event, hash, photoAttr }) => {
	return this.storageAdapter.moveTempFileToPermanentStorage({
		event,
		hash,
		photoAttr,
	})
}

module.exports = { movePhoto }
