class AbstractUnit {
	getUnitNumber() {
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

module.exports = {
	Unit,
	NullUnit,
}
