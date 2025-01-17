export type PubsQueryOrderingField =
	| 'collectionRank'
	| 'publishDate'
	| 'updatedDate'
	| 'creationDate'
	| 'title';

export type PubsQueryOrdering = { field: PubsQueryOrderingField; direction: 'ASC' | 'DESC' };

export type PubsQuery = {
	collectionIds?: null | string[];
	excludeCollectionIds?: null | string[];
	communityId: string;
	excludePubIds?: null | string[];
	isReleased?: boolean;
	hasReviews?: boolean;
	limit?: null | number;
	offset?: number;
	ordering?: PubsQueryOrdering;
	scopedCollectionId?: string;
	withinPubIds?: null | string[];
	term?: string;
};

export type PubEdgeIncludesOptions = {
	includeCommunityForPubs?: boolean;
	includeTargetPub?: boolean;
	includePub?: boolean;
};

export type PubGetOptions = {
	isAuth?: boolean;
	isPreview?: boolean;
	getCollections?: boolean;
	getMembers?: boolean;
	getCommunity?: boolean;
	getExports?: boolean;
	getEdges?: 'all' | 'approved-only';
	getDraft?: boolean;
	getDiscussions?: boolean;
	getReviews?: boolean;
	getEdgesOptions?: PubEdgeIncludesOptions;
};
