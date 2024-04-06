const gateEventOrchestrator = async ({
	events = [],
	permission,
	getpopulatedFieldsqueries,
	gateEventPreBuilder,
	gateEventPostBuilder,
}) => {
	// Services or useCases Layer
	const builtEvents = events.map(async (event) => {
		const populatedFields = await getpopulatedFieldsqueries({
			eventPayload: event,
			permission,
		})
		const preBuiltEvent = await gateEventPreBuilder({
			event,
			permission,
			populatedFields,
		})
		const postBuiltEvent = await gateEventPostBuilder({ event: preBuiltEvent })
		return postBuiltEvent
	})
	// Usecase to save postPayload to DB
	return builtEvents // whats coming from the DB
}
