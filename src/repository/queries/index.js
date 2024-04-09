const { populateCondoNameAndId } = require('./populateCondoNameAndId')
const { findAuthorizedById } = require('./findAuthorizedById')
const { findVehicle } = require('./findVehicleByPlateNumber')

const getpopulatedFieldsqueries = async (eventPayload, permission) => {
	const { plateNumber, authorizedBy, masterCondo, captureTime } = eventPayload

	const vehicle = findVehicle({ plateNumber, permission }) // find by plateNumber
	const authorized = findAuthorizedById({ authorizedBy })

	// Se vehicle tiver unit entao usar a essa unit, se nao usar condoId
	const condoId = vehicle.getCondo() ?? masterCondo
	const condo = populateCondoNameAndId({ condoId, permission })

	const [vehicleData, authorizedData, condoData] = await Promise.all([
		vehicle,
		authorized,
		condo,
	])

	return { vehicleData, authorizedData, condoData }
}

class PopulateFieldsForGateEvent {
	constructor({
		populateCondoNameAndId = InjectService(populateCondoNameAndId),
		findAuthorizedById = InjectService(findAuthorizedById),
		findVehicle = InjectService(findVehicle),
		eventPayload,
		permission,
	}) {
		this.populateCondoNameAndId = populateCondoNameAndId
		this.findAuthorizedById = findAuthorizedById
		this.findVehicle = findVehicle
		this.eventPayload = eventPayload
		this.permission = permission
	}

	async execute() {
		const { plateNumber, authorizedBy, masterCondo, captureTime } =
			this.eventPayload

		const vehicle = this.findVehicle({ plateNumber, permission }) // find by plateNumber
		const authorized = this.findAuthorizedById({ authorizedBy })

		// Se vehicle tiver unit entao usar a essa unit, se nao usar condoId
		const condoId = this.vehicle.getCondo() ?? masterCondo
		const condo = this.populateCondoNameAndId({ condoId })

		const [vehicleData, authorizedData, condoData] = await Promise.all([
			vehicle,
			authorized,
			condo,
		])

		return { vehicleData, authorizedData, condoData }
	}
}

module.exports = {
	getpopulatedFieldsqueries,
	PopulateFieldsForGateEvent,
}
