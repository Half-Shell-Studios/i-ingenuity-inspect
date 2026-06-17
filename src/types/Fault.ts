import AssetTag from "./AssetTag";
import { FaultCode } from "./FaultCode";
import Inspection from "./Inspection";

export interface Fault {
	id: string;
	locationId: string;
	assetTagId: string;
	inspectionId: string;
	faultCodeId: string;
	section: string;
	question: string;
	raisedAt: string;
	raisedComment: string;
	closedAt: string | null;
	closedBy: string | null;
	closedComment: string | null;
	assetTag?: AssetTag;
	inspection?: Inspection;
	faultCode?: FaultCode;
}

export interface FaultSection {
	sectionName: string,
	faults: Fault[]
}

export default Fault;