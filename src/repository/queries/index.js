const { populateCondoNameAndId } = require('./populateCondoNameAndId')
const { findAuthorizedById } = require('./findAuthorizedById')
const { findVehicle } = require('./findVehicleByPlateNumber')

const getpopulatedFieldsqueries = async (eventPayload, permission) => {
	const { plateNumber, authorizedBy, masterCondo, captureTime } = eventPayload

	const vehicle = findVehicle({ plateNumber, permission }) // find by plateNumber
	const authorized = findAuthorizedById({ authorizedBy })

	// Se vehicle tiver unit entao usar a essa unit, se nao usar condoId
	const condoId = vehicle.getCondo() ?? masterCondo
	const condo = populateCondoNameAndId({ condoId })

	const [vehicleData, authorizedData, condoData] = await Promise.all([
		vehicle,
		authorized,
		condo,
	])

	return { vehicleData, authorizedData, condoData }
}

module.exports = {
	getpopulatedFieldsqueries,
}
