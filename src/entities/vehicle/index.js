const { unitFactory } = require('../../factories/unitFactory.js')
const {
	licensePlateDetailsFactory,
} = require('../../factories/licencePlateDetailsFactory.js')
class BaseVehicle {
	constructor({ _id, unit, licensePlateDetails, condo, vehiclePhoto }) {
		this._id = _id
		this.unit = unitFactory({ number: unit }).getUnitNumber()
		this.licensePlateDetails =
			licensePlateDetailsFactory(licensePlateDetails).getLicensePlate()
		this.condo = condo
		this.vehiclePhoto = vehiclePhoto
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

class Vehicle extends BaseVehicle {
	constructor({ unit, licensePlateDetails, _id, condo, vehiclePhoto }) {
		super({ unit, licensePlateDetails, _id, condo, vehiclePhoto })
	}
}

class NullVehicle extends BaseVehicle {
	constructor({ _id, unit, licensePlateDetails = null, condo, vehiclePhoto }) {
		super({ _id, unit, licensePlateDetails, condo, vehiclePhoto })
	}
}

module.exports = {
	Vehicle,
	NullVehicle,
}
