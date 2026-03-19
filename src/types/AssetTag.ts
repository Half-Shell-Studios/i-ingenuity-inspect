import type { faultsTable } from "@/src/db/schema";
import type AssetTemplate from "./AssetTemplate";

// type AssetTemplate = typeof assetTemplatesTable.$inferSelect;
type Fault = typeof faultsTable.$inferSelect;

type AssetTag = {
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