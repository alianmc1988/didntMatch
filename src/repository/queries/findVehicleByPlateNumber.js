const findVehicle = async ({
	plateNumber,
	permission,
	vehicleModel,
	vehicleFactory,
}) => {
	const vehicle = await vehicleModel
		.find({
			'licencePlateDetails.licensePlate': plateNumber,
			...permission.getQuery(),
		})
		.populate('unit', { number: 1 })

	return vehicleFactory({ vehicle })
}

module.exports = { findVehicle }
