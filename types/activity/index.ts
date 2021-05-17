import { CommunityActivityItem } from './community';
import { CollectionActivityItem } from './collection';
import { PubActivityItem } from './pub';

export type InsertableActivityItem =
	| CommunityActivityItem
	| CollectionActivityItem
	| PubActivityItem
	| MemberActivityItem;

export type ActivityItem = InsertableActivityItem & {
	id: string;
	createdAt: string;
	updatedAt: string;
};
