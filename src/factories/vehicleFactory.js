const { Vehicle, NullVehicle } = require('../entities/vehicle/index.js')
const vehicleFactory = (vehicle) => {
	if (vehicle) {
		const vehicleInstance = new Vehicle(vehicle)
		if (vehicleInstance.getUnitNumber()) {
			return new NullVehicle({ _id: vehicle?._id }).getVehicle()
		}
		return vehicleInstance.getVehicle()
	}
}

module.exports = { vehicleFactory }
