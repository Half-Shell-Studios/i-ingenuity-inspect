type InspectionAnswer = {
	pass: boolean;
	notes: string;
	value: string;
	faults: string[];
};

export interface InspectionAnswers {
	answer: InspectionAnswer,
	skipped: boolean
}

export interface Inspection {
	id: string,
	assetTagId: string,
	assetTemplateId: string,
	assetTemplateRevisionId: string,
	inspectionTemplateId: string,
	inspectionTemplateRevisionId: string,
	inspectionTypeId: string,
	locationId: string,
	name: string,
	assessment: InspectionAnswers[],
	notes: string | null,
	inspectedBy: string
}

export default Inspection