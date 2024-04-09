const { movePhoto } = require('../../src/services/movePhoto.js')

describe('Given an event with a photoHash should return the event with a new field named after the photo attr give with the propper foto fotmat', () => {
	// arrange
	const event = {
		vehiclePhotoHash: '123456',
		platePhotoHash: '654321',
	}

	const storageService = {
		moveTempFileToPermanentStorage: async ({ event, hash, photoAttr }) => {
			return {
				photoHash: hash,
				photo: {
					s3Key: '123456',
					s3Bucket: '123',
				},
			}
		},
	}

	it('should return the event with the photoAttr field with the photoHash', async () => {
		// act
		const attr = {
			name: 'vehiclePhoto',
			hash: event.vehiclePhotoHash,
		}

		const assertObj = {
			...event,
			vehiclePhoto: {
				photoHash: '123456',
				photo: {
					s3Key: '123456',
					s3Bucket: '123',
				},
			},
		}
		const result = await movePhoto({
			event,
			photoAttr: attr,
			storageService,
		})

		expect(result).toEqual(assertObj)
	})

	it('should return the event with the photoAttr field with the photoHash', async () => {
		// act
		const attr = {
			name: 'platePhoto',
			hash: event.platePhotoHash,
		}

		const assertObj = {
			...event,
			platePhoto: {
				photoHash: '654321',
				photo: {
					s3Key: '123456',
					s3Bucket: '123',
				},
			},
		}

		const result = await movePhoto({
			event,
			photoAttr: attr,
			storageService,
		})

		expect(result).toEqual(assertObj)
	})

	// act
})
