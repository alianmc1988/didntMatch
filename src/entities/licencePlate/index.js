class AbstractLicensePlateDetails {
	getLicensePlate() {
		throw new Error('This method should be implemented')
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

	static build() {
		return new this()
	}

	getLicensePlate() {
		return null
	}
}

module.exports = {
	LicensePlateDetails,
	NullLincesePlateDetails,
}
