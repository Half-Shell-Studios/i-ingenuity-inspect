
interface CustomField {
	key: string;
	value: string;
}

export type CustomFields = CustomField[];

interface ProtectionEntry {
	type: string;
	zone: string;
	level: string;
	extension: string;
}

interface MetadataGroups {
	gas_group: string;
	dust_group: string;
	equipment_group: string;
	gas_temperature_class: string;
	dust_temperature_class: string;
	gas_temperature_custom: boolean;
	dust_temperature_custom: boolean;
}

export interface Metadata {
	ip: unknown[];
	isf: unknown[];
	groups: MetadataGroups;
	ip_rating: string | null;
	protection: ProtectionEntry[];
}

export interface CertificateNumber {
	number: string;
	notes?: string;
}

export interface StateComments {
	checked: string | null;
	approved: string | null;
	completed: string | null;
}

export interface AssetTemplateRevision {
	id: string;
	assetTemplateId: string;
	classification: string;
	manufacturer: string;
	model: string;
	type: string;
	description: string | null;
	ipRating: string | null;
	protection: string | null;
	serviceLife?: number;
	certificateNumbers: CertificateNumber[] | null;
	customFields: CustomFields | null;
	metadata: Metadata | null;
	version: string | null;
	state: string;
	stateComments: StateComments | null;
	draftedBy: string | null;
	completedAt: number | null;
	completedBy: string | null;
	checkedAt: number | null;
	checkedBy: string | null;
	approvedAt: number | null;
	approvedBy: string | null;
	declinedAt: number | null;
	declinedBy: string | null;
	createdAt: number;
	updatedAt: number;
	deletedAt: number | null;
}

export default AssetTemplateRevision;