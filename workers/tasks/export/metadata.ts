import dateFormat from 'dateformat';

import * as types from 'types';
import ensureUserForAttribution from 'utils/ensureUserForAttribution';
import { getPubPublishedDate, getPubUpdatedDate } from 'utils/pub/pubDates';
import { getPrimaryCollection } from 'utils/collections/primary';
import { renderJournalCitation } from 'utils/citations';
import {
	Collection,
	CollectionPub,
	Community,
	Pub,
	PubAttribution,
	Release,
	includeUserModel,
} from 'server/models';

import { getLicenseForPub } from 'utils/licenses';
import { PubMetadata } from './types';

const getPrimaryCollectionMetadata = (collectionPubs: types.CollectionPub[]) => {
	const primaryCollection = getPrimaryCollection(collectionPubs);
	if (primaryCollection) {
		const { metadata, title } = primaryCollection;
		return { primaryCollectionMetadata: metadata, primaryCollectionTitle: title };
	}
	return null;
};

export const getPubMetadata = async (pubId: string): Promise<PubMetadata> => {
	const pubData = await Pub.findOne({
		where: { id: pubId },
		include: [
			{
				model: CollectionPub,
				as: 'collectionPubs',
				include: [
					{
						model: Collection,
						as: 'collection',
					},
				],
			},
			{ model: Community, as: 'community' },
			{
				model: PubAttribution,
				as: 'attributions',
				include: [includeUserModel({ as: 'user' })],
			},
			{
				model: Release,
				as: 'releases',
			},
		],
	});
	const publishedDate = getPubPublishedDate(pubData);
	const license = getLicenseForPub(pubData, pubData.community);
	const updatedDate = getPubUpdatedDate({ pub: pubData });
	const publishedDateString = publishedDate && dateFormat(publishedDate, 'mmm dd, yyyy');
	const updatedDateString = updatedDate && dateFormat(updatedDate, 'mmm dd, yyyy');
	const primaryCollection = getPrimaryCollection(pubData.collectionPubs);
	return {
		title: pubData.title,
		slug: pubData.slug,
		doi: pubData.doi,
		publishedDateString,
		updatedDateString,
		communityTitle: renderJournalCitation(
			primaryCollection?.kind,
			pubData.community.citeAs,
			pubData.community.title,
		),
		accentColor: pubData.community.accentColorDark,
		attributions: pubData.attributions
			.concat()
			.sort((a, b) => a.order - b.order)
			.filter((attr) => attr.isAuthor)
			.map((attr) => ensureUserForAttribution(attr)),
		citationStyle: pubData.citationStyle,
		citationInlineStyle: pubData.citationInlineStyle,
		nodeLabels: pubData.nodeLabels,
		publisher: pubData.community.publishAs || pubData.communityTitle,
		...getPrimaryCollectionMetadata(pubData.collectionPubs),
		license,
	};
};
