export const registerGateEventsWorkflow = async ({
	events = [],
	permission,
	getpopulatedFieldsqueries,
	gateEventPreBuilder,
	movePhotoFunc,
	storageService,
}) => {
	// Services or useCases Layer
	const builtEvents = events.map(async (event) => {
		const eventWithpopulatedFields = await getpopulatedFieldsqueries({
			eventPayload: event,
			permission,
		})

		const { vehicleData } = eventWithpopulatedFields
		if (vehicleData.getLicensePlate() !== null) {
			const vehiclePhotoAttr = {
				name: 'vehiclePhoto',
				hash: event.vehiclePhotoHash,
			}

			const platePhotoAttr = {
				name: 'platePhoto',
				hash: event.platePhotoHash,
			}

			movePhotoFunc({
				event: eventWithpopulatedFields,
				photoAttr: vehiclePhotoAttr,
				storageService,
			})

			movePhotoFunc({
				event: eventWithpopulatedFields,
				photoAttr: platePhotoAttr,
				storageService,
			})

			await Promise.all([movePhotoFunc, movePhotoFunc])
		}
		const preBuiltEvent = await gateEventPreBuilder({
			event,
			permission,
			populatedFields: eventWithpopulatedFields,
		})
	})
	// Usecase to save postPayload to DB
	return builtEvents // whats coming from the DB
}
