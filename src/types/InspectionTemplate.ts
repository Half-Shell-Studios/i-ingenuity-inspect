export interface InspectionTemplate {
	id: string;
	revisionActiveId: string;
	revisionActive?: InspectionTemplateRevision;
	revisionLatestId: string;
}

export interface InspectionTemplateRevision {
	id: string;
	inspectionTemplateId: string;
	inspectionTypeId: string;
	name: string;
	description: string | null;
	criteria: string | null;
	template: string;
}

export interface InspectionQuestion {
	content: string;
	id: string;
	noac: boolean;
	noap: boolean;
	noex: boolean;
	type: string;
}

export default InspectionTemplate