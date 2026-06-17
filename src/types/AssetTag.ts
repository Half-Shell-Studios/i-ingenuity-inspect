import type AssetTemplate from "./AssetTemplate";
import type Fault from "./Fault";
import { FaultSection } from "./Fault";
import Location from "./Location";

export interface AssetTag {
	id: string,
	name: string,
	description: string | null,
	rfid: string | null,
	locationId: string,
	height: string,
	vintage?: number,
	assetTemplateId: string,
	assetTemplateRevisionId: string,
	assetTemplate: AssetTemplate,
	faults?: Fault[],
	faultsOpen?: Fault[],
	faultsOpenBySection?: FaultSection[],
	faultsClosed?: Fault[],
	faultsClosedBySection?: FaultSection[],
	location?: Location
}

export default AssetTag;