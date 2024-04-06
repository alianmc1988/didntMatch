const { Permission } = require('../../src/entities')
const {
	gateEventPreBuilder,
} = require('../../src/services/gateEventPreBuilder')
const { Vehicle } = require('../../src/entities/vehicle')
const {
	LicensePlateDetails,
	NullLincesePlateDetails,
} = require('../../src/entities//licencePlate')

describe('MatchedGateEvents is an event that the plate within has matched with a vehicle in the database', () => {
	const condos = [1, 2, 3]
	const masterCondo = 1
	const condo = 1
	const unit = 1
	const captureTime = new Date('2024-04-04T21:14:33.569Z')
	const eventType = 'ENTRANCE'
	const condoData = {
		_id: '12345',
		name: 'Condo 1',
	}

	const authorizedData = {
		userId: '12345',
		firstName: 'Pedrao',
		lastName: 'Medina',
		photoId: '1223456',
		photoHash: '123456',
	}

	const permission = new Permission({
		condos,
		masterCondo,
		condo,
	})

	const eventPayload = {
		captureTime,
		eventType,
	}

	const createGateEventPayload = (licensePlateDetails) => {
		const vehicleData = new Vehicle({
			unit,
			licensePlateDetails: licensePlateDetails.getLicensePlate(),
			_id: 1,
			condo,
		})

		const populatedFields = {
			vehicleData,
			authorizedData,
			condoData,
		}

		return { populatedFields }
	}

	describe('When the licensePlateDetails is not null', () => {
		it('should return licencePlateDetails with reference to a vehicle', async () => {
			// Arrange

			const matchedLicencePlateDetails = new LicensePlateDetails({
				licensePlate: '123',
				model: 'focus',
				color: 'preta',
				year: '1990',
			})

			const { populatedFields } = createGateEventPayload(
				matchedLicencePlateDetails,
			)

			// Act
			const assertPayload = {
				createdAt: new Date('2024-04-04T21:14:33.569Z'),
				authorizedBy: {
					userId: '12345',
					firstName: 'Pedrao',
					lastName: 'Medina',
					photoId: '1223456',
					photoHash: '123456',
					authorizerRole: 'STAFF',
					unitNumber: 1,
				},
				licensePlateDetails: {
					licensePlate: '123',
					model: 'focus',
					color: 'preta',
					year: '1990',
				},
				type: 'ENTRANCE',
				captureTime: eventPayload.captureTime,
				eventType: 'ENTRANCE',
				condominium: { condoId: '12345', condoName: 'Condo 1' },
				visitType: 'ACCESS_CONTROL',
			}

			// Assert

			const result = await gateEventPreBuilder({
				eventPayload,
				permission,
				populatedFields: populatedFields,
			})
			expect(result).toEqual(assertPayload)
		})
	})

	describe('When the licensePlateDetails is null', () => {
		it('should return should return licencePlateDetails as null value', async () => {
			const noMatchedLicencePlateDetails = new NullLincesePlateDetails()

			const { populatedFields } = createGateEventPayload(
				noMatchedLicencePlateDetails,
			)

			// Act
			const assertPayload = {
				createdAt: new Date('2024-04-04T21:14:33.569Z'),
				authorizedBy: {
					userId: '12345',
					firstName: 'Pedrao',
					lastName: 'Medina',
					photoId: '1223456',
					photoHash: '123456',
					authorizerRole: 'STAFF',
					unitNumber: 1,
				},
				licensePlateDetails: null,
				type: 'ENTRANCE',
				captureTime: eventPayload.captureTime,
				eventType: 'ENTRANCE',
				condominium: { condoId: '12345', condoName: 'Condo 1' },
				visitType: 'ACCESS_CONTROL',
			}

			// Assert
			const result = await gateEventPreBuilder({
				eventPayload,
				permission,
				populatedFields: populatedFields,
			})

			expect(result).toEqual(assertPayload)
		})
	})
})
