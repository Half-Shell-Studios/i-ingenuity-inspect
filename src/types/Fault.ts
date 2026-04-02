export interface Fault {
	id: string,
	locationId: string,
	assetTagId: string,
	inspectionId: string,
	faultCodeId: string,
	section: string,
	question: string,
	raisedAt: string,
	raisedComment: string,
	closedAt: string | null,
	closedBy: string | null,
	closedComment: string | null,
}

export default Fault;