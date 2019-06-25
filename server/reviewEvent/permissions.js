import {
	Branch,
	BranchPermission,
	PubManager,
	CommunityAdmin,
	Review,
	ReviewEvent,
} from '../models';
import { getBranchAccess } from '../branch/permissions';

export const getPermissions = ({ userId, communityId, pubId, reviewId, reviewEventId }) => {
	if (!userId || !communityId || !pubId || !reviewId) {
		return new Promise((resolve) => {
			resolve({});
		});
	}

	const findBranch = (branchId) => {
		return Branch.findOne({
			where: { id: branchId },
			include: [
				{
					model: BranchPermission,
					as: 'permissions',
					required: false,
				},
			],
		});
	};
	return Review.findOne({
		where: {
			id: reviewId,
		},
	})
		.then((reviewData) => {
			const sourceBranchId = reviewData.sourceBranchId;
			const destinationBranchId = reviewData.destinationBranchId || null;
			return Promise.all([
				findBranch(sourceBranchId),
				findBranch(destinationBranchId),
				PubManager.findOne({ where: { pubId: pubId, userId: userId } }),
				CommunityAdmin.findOne({ where: { communityId: communityId, userId: userId } }),
				ReviewEvent.findOne({ where: { id: reviewEventId } }),
			]);
		})
		.then(
			([
				sourceBranchData,
				destinationBranchData,
				pubManagerData,
				communityAdminData,
				reviewEventData,
			]) => {
				if (!sourceBranchData) {
					return {};
				}

				const sourceAccess = getBranchAccess(
					null,
					destinationBranchData,
					userId,
					communityAdminData,
					pubManagerData,
				);
				const destinationAccess = destinationBranchData
					? getBranchAccess(
							null,
							destinationBranchData,
							userId,
							communityAdminData,
							pubManagerData,
					  )
					: {};

				const editProps = reviewEventData && reviewEventData.id === userId ? ['data'] : [];

				return {
					create: sourceAccess.canManage || destinationAccess.canManage,
					update: editProps,
					destroy: false,
				};
			},
		);
};
