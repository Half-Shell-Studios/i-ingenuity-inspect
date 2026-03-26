import type AssetTemplateRevision from "./AssetTemplateRevision"

export interface AssetTemplate {
	id: string,
	revisionActiveId?: string,
	revisionActive?: AssetTemplateRevision,
}

export default AssetTemplate