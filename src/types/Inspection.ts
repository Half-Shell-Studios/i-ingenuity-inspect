import InspectionTemplate from "./InspectionTemplate";
import InspectionType from "./InspectionType";

export interface FaultsObject {
	[uuid: string]: boolean;
}

type InspectionAnswer = {
	pass: boolean;
	notes: string;
	value: string;
	faults: never[] | FaultsObject;
};

export interface InspectionAnswers {
	answer: InspectionAnswer;
	skipped: boolean;
}

export interface InspectionSection {
	answers: InspectionAnswer[];
	skipped: boolean;
	skipped_comment: string | null;
}

export type InspectionAssessment = InspectionSection[];

export interface Inspection {
	id: string;
	assetTagId: string;
	assetTemplateId: string;
	assetTemplateRevisionId: string;
	inspectionTemplateId: string;
	inspectionTemplateRevisionId: string;
	inspectionTypeId: string;
	locationId: string;
	name: string;
	assessment: InspectionAnswers[];
	notes: string | null;
	inspectedBy: string;
	inspectionTemplate?: InspectionTemplate;
	inspectionType?: InspectionType;
}

export default Inspection