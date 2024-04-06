const { Unit, NullUnit } = require('../entities/unit/index')

const unitFactory = ({ number }) => {
	if (number) {
		return new Unit({ number })
	}
	return new NullUnit()
}

module.exports = { unitFactory }
