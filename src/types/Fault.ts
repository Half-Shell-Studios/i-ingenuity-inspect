type Fault = {
	id: string,
	locationId: string,
	assetTagId: string,
	inspectionId: string,
	faultCodeId: string,
	section: string,
	question: string,
	raisedAt: string,
	raisedComment: string,
	closedAt: string,
	closedBy: string,
	closedComment: string,
}

export default Fault;