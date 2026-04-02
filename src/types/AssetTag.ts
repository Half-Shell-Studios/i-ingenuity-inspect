import type AssetTemplate from "./AssetTemplate";
import type Fault from "./Fault";

export interface AssetTag {
	id: string,
	name: string,
	description: string | null,
	rfid: string | null,
	locationId: string,
	height: string,
	vintage: number,
	assetTemplateId: string,
	assetTemplate: AssetTemplate,
	faults?: Fault[],
	faultsOpen?: Fault[],
	faultsClosed?: Fault[],
}

export default AssetTag;