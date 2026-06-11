import AssetTag from "./AssetTag";

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
	assetTag?: AssetTag
}

export interface FaultSection {
	sectionName: string,
	faults: Fault[]
}

export default Fault;