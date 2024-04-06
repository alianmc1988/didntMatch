class Permission {
	constructor({ condos, masterCondo, condo }) {
		this.condos = condos
		this.masterCondo = masterCondo
		this.condo = condo
	}

	getQuery() {
		return {
			condo: { $in: this.condos },
		}
	}
}

module.exports = { Permission }
