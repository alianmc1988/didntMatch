const {
	eventTypeEnum,
	eventVisitTypeEnum,
	eventAuthorizerRoleEnum,
} = require('../constants')

const gateEventPreBuilder = async ({ eventPayload, populatedFields }) => {
	const { captureTime, eventType } = eventPayload
	const { vehicleData, authorizedData, condoData } = populatedFields
	const createdAt = new Date('2024-04-04T21:14:33.569Z')
	const { userId, firstName, lastName, photoId, vehiclePhoto, photoHash } =
		authorizedData
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
		vehiclePhoto,
	}
}

module.exports = { gateEventPreBuilder }
