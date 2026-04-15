export interface InspectionTemplate {
	id: string,
	revisionActiveId: string,
	revisionLatestId: string
}

export interface InspectionTemplateRevision {
	id: string,
	inspectionTemplateId: string,
	inspectionTypeId: string,
	name: string
	description: string | null,
	criteria: string | null,
	template: string
}

export default InspectionTemplate