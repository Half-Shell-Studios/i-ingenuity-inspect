import type AssetTemplate from "./AssetTemplate";
import type Fault from "./Fault";
import { FaultSection } from "./Fault";

export interface AssetTag {
	id: string,
	name: string,
	description: string | null,
	rfid: string | null,
	locationId: string,
	height: string,
	vintage: number,
	assetTemplateId: string,
	assetTemplateRevisionId: string,
	assetTemplate: AssetTemplate,
	faults?: Fault[],
	faultsOpen?: Fault[],
	faultsOpenBySection?: FaultSection[],
	faultsClosed?: Fault[],
	faultsClosedBySection?: FaultSection[],
}

export default AssetTag;