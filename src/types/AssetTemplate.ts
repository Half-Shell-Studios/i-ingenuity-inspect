import type AssetTemplateRevision from "./AssetTemplateRevision"

type AssetTemplate = {
	id: string,
	revisionActiveId?: string,
	revisionActive?: AssetTemplateRevision,
}

export default AssetTemplate