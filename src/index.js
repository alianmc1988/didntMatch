const NO_MATCH = null
const eventTypeEnum = {
	ENTRANCE: 'ENTRANCE',
}

const eventVisitTypeEnum = {
	ACCESS_CONTROL: 'ACCESS_CONTROL',
}

const eventAuthorizerRoleEnum = {
	STAFF: 'STAFF',
}

class BaseVehicle {
	constructor({ _id, unit, licensePlateDetails, condo }) {
		this._id = _id
		this.unit = unitFactory({ number: unit }).getUnitNumber()
		this.licensePlateDetails =
			licensePlateDetailsFactory(licensePlateDetails).getLicensePlate()
		this.condo = condo
	}
	getVehicle() {
		return this
	}
	getUnitNumber() {
		return this.unit
	}

	getLicensePlate() {
		return this.licensePlateDetails
	}
	getCondo() {
		return this.condo
	}
}

class AbstractUnit {
	getUnitNumber() {
		throw new Error('This method should be implemented')
	}
}

class AbstractLicensePlateDetails {
	getLicensePlate() {
		throw new Error('This method should be implemented')
	}
}

class Unit extends AbstractUnit {
	constructor({ number }) {
		super()
		this.number = number
	}

	getUnitNumber() {
		return this.number
	}
}

class NullUnit extends AbstractUnit {
	constructor() {
		this.number = null
	}

	getUnitNumber() {
		return this.number
	}
}

class LicensePlateDetails extends AbstractLicensePlateDetails {
	constructor({ licensePlate, model, color, year }) {
		super()
		this.licensePlate = licensePlate
		this.model = model
		this.color = color
		this.year = year
	}

	getLicensePlate() {
		return {
			licensePlate: this.licensePlate,
			model: this.model,
			color: this.color,
			year: this.year,
		}
	}
}

class NullLincesePlateDetails extends AbstractLicensePlateDetails {
	constructor() {
		super()
		this.licensePlate = null
		this.model = null
		this.color = null
		this.year = null
	}

	getLicensePlate() {
		return null
	}
}

class Vehicle extends BaseVehicle {
	constructor({ unit, licensePlateDetails, _id, condo }) {
		super({ unit, licensePlateDetails, _id, condo })
	}
}

class NullVehicle extends BaseVehicle {
	constructor({ _id, unit, licensePlateDetails = null, condo }) {
		super({ _id, unit, licensePlateDetails, condo })
	}
}

// Factories ---------------------------------------------------------
const vehicleFactory = ({ vehicle }) => {
	if (vehicle) {
		const vehicleInstance = new Vehicle(vehicle)
		if (vehicleInstance.getUnitNumber()) {
			return new NullVehicle({ _id: vehicle?._id }).getVehicle()
		}
		return vehicleInstance.getVehicle()
	}
}

const unitFactory = ({ number }) => {
	if (number) {
		return new Unit({ number })
	}
	return new NullUnit()
}

const licensePlateDetailsFactory = (licencePlateDetails) => {
	if (licencePlateDetails?.licensePlate) {
		const { licensePlate, model, color, year } = licencePlateDetails
		return new LicensePlateDetails({ licensePlate, model, color, year })
	}
	return new NullLincesePlateDetails()
}

// --------------------------------------------------------------------

// Queries Stage IO ---------------------------------------------------

const findVehicle = async ({ plateNumber, permission }) => {
	const vehicle = await this.vehicleModel
		.find({
			'licencePlateDetails.licensePlate': plateNumber,
			...permission.getQuery(),
		})
		.populate('unit', { number: 1 })

	return vehicleFactory({ vehicle })
}

const findAuthorizedById = async ({ authorizedBy }) => {
	const {
		_id: userId,
		profile: {
			photoId,
			public: { firstName = '(empty)', lastName = '(empty)', userPhotoHash },
		},
	} = await this.userAdapter.findById(authorizedBy)

	return {
		userId,
		firstName,
		lastName,
		photoId,
		photoHash: userPhotoHash,
	}
}

const populateCondoNameAndId = async ({ condoId }) => {
	//
	const condo = await this.condoModel.findById(condoId, { name: 1, _id: 1 })
	if (!condo) {
		throw new Error('Condo not found')
	}
	return condo
}

const getpopulatedFieldsqueries = async ({ eventPayload, permission }) => {
	const { plateNumber, masterCondo, CameraId, ...rest } = eventPayload

	const vehicle = findVehicle({ plateNumber, permission }) // find by plateNumber
	const authorized = findAuthorizedById({ authorizedBy: CameraId })

	// Se vehicle tiver unit entao usar a essa unit, se nao usar condoId
	const condoId = vehicle.getCondo() ?? masterCondo
	const condo = populateCondoNameAndId({ condoId })

	const [vehicleData, authorizedData, condoData] = await Promise.all([
		vehicle,
		authorized,
		condo,
	])

	return { vehicleData, authorizedData, condoData, rest }
}

const moveFiles = async (event) => {
	if (event.vehiclePhotoHash) {
		const { vehiclePhotoHash } = event
		attr = 'vehiclePhoto'
		const vehiclePhoto = movePhoto({
			event,
			hash: vehiclePhotoHash,
			photoAttr: attr,
		})
	}
	if (event.platePhotoHash) {
		const { platePhotoHash } = event
		attr = 'platePhoto'
		const platePhoto = movePhoto({
			event,
			hash: platePhotoHash,
			photoAttr: attr,
		})
	}

	return {
		...event,
		vehiclePhoto,
		platePhoto,
	}
}

// -----------------------------------------------------------------------
// Pure PreBuilder State

const gateEventPreBuilder = async ({ eventPayload, populatedFields }) => {
	const { captureTime, eventType } = eventPayload
	const { vehicleData, authorizedData, condoData } = populatedFields
	const createdAt = new Date('2024-04-04T21:14:33.569Z')
	const { userId, firstName, lastName, photoId, photoHash } = authorizedData
	const vehicleInstance = vehicleData.getVehicle()
	const unit = vehicleInstance.getUnitNumber()
	const licensePlateDetails = vehicleInstance.getLicensePlate()
	const type = eventTypeEnum.ENTRANCE
	const visitType = eventVisitTypeEnum.ACCESS_CONTROL
	const condominium = {
		condoId: condoData._id,
		condoName: condoData.name,
	}
	const authBy = {
		userId,
		firstName,
		lastName,
		photoId,
		photoHash,
		authorizerRole: eventAuthorizerRoleEnum.STAFF,
		unitNumber: unit,
	}

	return {
		createdAt,
		authorizedBy: authBy,
		licensePlateDetails,
		type,
		captureTime,
		eventType,
		condominium,
		visitType,
	}
}

// IO --------------------------------------------------------------

const movePhoto = async ({ event, hash, photoAttr }) => {
	return this.storageAdapter.moveTempFileToPermanentStorage({
		event,
		hash,
		photoAttr,
	})
}

const moveFilesFromTempToPermanentInEvent = async (event, params = []) => {
	const newEvent = { ...event }
	for (const param of params) {
		const { attr, photoHash } = param
		if (photoHash) {
			newEvent[attr] = await movePhoto({
				event,
				hash: photoHash,
				photoAttr: attr,
			})
		}
	}
	return newEvent
}

// --------------------------------------------------------------------

// Pure PostBuilder State
// Need to call PreBuilder first

const gateEventPostBuilder = async ({ event }) => {
	const { licensePlateDetails } = event

	const plateParams = {
		attr: 'platePhoto',
		photoHash: licensePlateDetails?.photoHash,
	}

	const vehiclePhotoParams = {
		attr: 'vehiclePhoto',
		photoHash: licensePlateDetails?.vehiclePhotoHash,
	}
	const builtEvent = moveFilesFromTempToPermanentInEvent(event, [
		plateParams,
		vehiclePhotoParams,
	])
	return builtEvent
}

class Permission {
	constructor({ condos, masterCondo, condo }) {
		this.condos = condos
		this.masterCondo = masterCondo
		this.condo = condo
	}

	getQuery() {
		return {
			condo: { $in: this.condos },
		}
	}
}

const gateEventOrchestrator = async ({ events = [], permission }) => {
	// Services or useCases Layer
	const builtEvents = events.map(async (event) => {
		const populatedFields = await getpopulatedFieldsqueries({
			eventPayload: event,
			permission,
		})
		const preBuiltEvent = await gateEventPreBuilder({
			event,
			permission,
			populatedFields,
		})
		const postBuiltEvent = await gateEventPostBuilder({ event: preBuiltEvent })
		return postBuiltEvent
	})
	// Usecase to save postPayload to DB
	return builtEvents // whats coming from the DB
}

// ubiquitous Language
//  MatchedGateEvents is an event that the plate within has matched with a vehicle in the database
//  UnmatchedGateEvents is an event that the plate within has not matched with a vehicle in the database
//Arrange
/*
    When passing a matchedGateEvents to the gateEventPreBuilder function
    Should return a new event with all the correct following structure:
    {
        createdAt: new Date(),
        authorizedBy: {
            userId: '12345',
            firstName: 'Pedrao',
            lastName: 'Medina',
            photoId: '1223456',
            photoHash: '123456',
        },
        licensePlateDetails: {
            licensePlate: '123',
            model: focus,
            color: preta,
            year: 1990,
        },
        type: 'ENTRANCE',
        condominium:{
            condoId: '12345',
            condoName: 'Condo 1',
        }
		visitType,
    }
*/
const eventType = 'ENTRANCE'

const condos = [1, 2, 3]
const masterCondo = 1
const condo = 1
const unit = 1
const licensePlateDetailsNotNull = {
	licensePlate: '123',
	model: 'focus',
	color: 'preta',
	year: '1990',
}
const licensePlateDetailsNull = null

const permission = new Permission({
	condos,
	masterCondo,
	condo,
})
const captureTime = new Date()
const matchedVehicleData = new Vehicle({
	unit,
	licensePlateDetails: licensePlateDetailsNotNull,
	_id: 1,
	condo: 1,
})

const unmatchedVehicleData = new NullVehicle({
	unit,
	licensePlateDetails: licensePlateDetailsNull,
	_id: 1,
	condo: 1,
})

const authorizedData = {
	userId: '12345',
	firstName: 'Pedrao',
	lastName: 'Medina',
	photoId: '1223456',
	photoHash: '123456',
}
const condoData = {
	_id: '12345',
	name: 'Condo 1',
}

const eventPayload = {
	captureTime,
	eventType,
}
const populatedFieldsMatchedEvent = {
	vehicleData: matchedVehicleData,
	authorizedData,
	condoData,
}

const populatedFieldsUnmatchedEvent = {
	vehicleData: unmatchedVehicleData,
	authorizedData,
	condoData,
}

//Act
gateEventPreBuilder({
	eventPayload,
	populatedFields: populatedFieldsMatchedEvent,
	permission,
}).then((result) => {
	console.log(result)
})

//Asser

// const resultMatched = gateEventPreBuilder({
// 	eventPayload,
// 	populatedFields: populatedFieldsMatchedEvent,
// 	permission,
// })

// console.log(resultMatched)

// // Null plate

// const payload = {
// 	eventPayload,
// 	populatedFields: populatedFieldsUnmatchedEvent,
// 	permission,
// }

// const resultUnmatched = gateEventPreBuilder(payload)
// console.log(resultUnmatched)

// // console.log(result)

// // Objectives:
// /*

//     1- Testar correctamente gateEventPreBuilder Primer scenario (happy path)
//     2- Refatorar si precisa y describir el proceso de refatoracion (antes das 14hrs)

//     *********************************************************************************
//     1- Testar correctamente gateEventPreBuilder Primer scenario (happy path)

// */

module.exports = {
	gateEventPreBuilder,
	// eventPayload,
	// populatedFieldsMatchedEvent,
	// populatedFieldsUnmatchedEvent,
	// permission,
	// licensePlateDetailsNotNull,
	// licensePlateDetailsNull,
}
