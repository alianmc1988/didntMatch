const {
	NullLincesePlateDetails,
	LicensePlateDetails,
} = require('../entities/licencePlate')

const licensePlateDetailsFactory = (licencePlateDetails) => {
	if (licencePlateDetails?.licensePlate) {
		const { licensePlate, model, color, year } = licencePlateDetails
		return new LicensePlateDetails({ licensePlate, model, color, year })
	}
	return new NullLincesePlateDetails()
}

module.exports = { licensePlateDetailsFactory }
