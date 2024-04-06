const populateCondoNameAndId = async ({ condoId, condoModel }) => {
	//
	const condo = await condoModel.findById(condoId, { name: 1, _id: 1 })
	if (!condo) {
		throw new Error('Condo not found')
	}
	return condo
}

module.exports = { populateCondoNameAndId }
