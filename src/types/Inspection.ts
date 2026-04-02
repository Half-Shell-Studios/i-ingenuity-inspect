export interface Inspection {
	id: string,
	assetTagId: string,
	inspectionTemplateId: string,
	name: string,
	answers: string | null,
	notes: string | null,
	inspectedBy: string
}

export default Inspection