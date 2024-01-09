import { useProfile } from './useProfile';
import { useAuth } from '@/providers/Authentication.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createBucket as handleCreateBucket,
	getBucket as handleGetBucket,
	getBuckets as handleGetBuckets,
	updateBucket as handleUpdateBucket,
	deleteBucket as handleDeleteBucket,
	uploadVideo as handleUploadVideo,
	updateBucketsCategory as handleUpdateBucketsCategory,
	deleteBucketsCategory as handleDeleteBucketsCategory
} from './api/buckets';

const COLLECTION_NAME = 'Buckets';

export const useBuckets = (owner) => {
	// Hooks
	const queryClient = useQueryClient();
	const { user, ...auth } = useAuth();

	const queryKey = [COLLECTION_NAME, owner?.id];

	const { data } = useQuery({
		gcTime: Infinity,
		queryKey,
		queryFn: async () => handleGetBuckets(auth, { ownerId: owner.id }),
		enabled: Boolean(owner?.id)
	});

	const createBucket = useMutation({
		mutationFn: async ({ data }) => handleCreateBucket(auth, data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const updateBucket = useMutation({
		mutationFn: ({ data: body, documentId: id }) => handleUpdateBucket(auth, { body, id }),
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const deleteBucket = useMutation({
		mutationFn: ({ documentId }) => handleDeleteBucket(auth, documentId),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const uploadVideo = useMutation({
		mutationFn: ({ id, data }) => {
			const body = new FormData();
			body.append('video', data.video);
			body.append('image', data.image);
			return handleUploadVideo(auth, id, body);
		},
		onMutate: ({ onLoading }) => {
			onLoading && onLoading(); // This is a callback that fires when onMutate fires
		},
		onSuccess: () => {
			// TODO: Optimistic updates
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const updateBucketsCategory = useMutation({
		mutationFn: ({ data: body, category }) => handleUpdateBucketsCategory(auth, { body, category }),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	const deleteBucketsCategory = useMutation({
		mutationFn: ({ category, withBuckets }) => handleDeleteBucketsCategory(auth, category, withBuckets),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		}
	});

	return {
		data,
		createBucket: createBucket.mutate,
		deleteBucket: deleteBucket.mutate,
		updateBucket: updateBucket.mutate,
		uploadVideo: uploadVideo.mutate,
		updateBucketsCategory: updateBucketsCategory.mutate,
		deleteBucketsCategory: deleteBucketsCategory.mutate

		// uploadFile: createBucket.mutate,
		// uploadResumableFile: createBucket.mutate,
		// appendVideo: createBucket.mutate
	};
};
