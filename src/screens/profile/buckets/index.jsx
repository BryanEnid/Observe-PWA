import React, { useMemo, useState, useRef, useEffect, forwardRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useBuckets } from '@/hooks/useBuckets';
import { useProfile } from '@/hooks/useProfile';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/chadcn/DropDown';
import { Typography } from '@/chadcn/Typography.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@/chadcn/Button.jsx';
import { Input } from '@/chadcn/Input.jsx';
import { Separator } from '@/chadcn/Separator.jsx';
import { PageModal } from '@/components/PageModal.jsx';

import { BucketItem } from './BucketItem';

const UNCATEGORIZED_BUCKETS_LABEL = 'Default';

// ! Remove this when ios supports Array.groupBy
const groupBy = (array, keyFunc) => {
	return array.reduce((result, item) => {
		const key = keyFunc(item);
		(result[key] = result[key] || []).push(item);
		return result;
	}, {});
};

const CategoryLabel = forwardRef(
	({ value, categoryEditing, category, onSubmit, onChange, editCategory, cancelEditCategory, onDelete }, ref) => (
		<>
			{categoryEditing !== category && (
				<div className="mb-9 flex gap-2 items-center">
					<Typography variant="h3" onClick={() => editCategory(category)}>
						{category}
					</Typography>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" className="rounded-full">
								<Icon icon="mi:options-horizontal" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem className="py-3 px-3" onClick={() => editCategory(category)}>
								<Icon icon="clarity:edit-line" className="pr-1 text-xl" />
								Rename section
							</DropdownMenuItem>
							<DropdownMenuItem
								className="py-3 px-3 text-red-500 hover:text-red-500 focus:text-red-500"
								onClick={onDelete}
							>
								<Icon icon="fluent:delete-48-regular" className="pr-1 text-xl" />
								Delete section
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
			{categoryEditing === category && (
				<form onSubmit={onSubmit}>
					<div className="mb-9 flex items-center gap-1">
						<Input
							ref={ref}
							value={value}
							placeholder="Section Name"
							onChange={({ target }) => onChange(target.value)}
							className="bg-white/10 w-[300px]"
						/>
						<Button
							type="submit"
							variant="default"
							className="rounded-full border"
							disabled={!value?.length}
							iconBegin={<Icon icon="ic:round-plus" />}
						>
							Save
						</Button>
						<Button type="button" variant="secondary" className="rounded-full" onClick={() => cancelEditCategory()}>
							Cancel
						</Button>
					</div>
				</form>
			)}
		</>
	)
);
CategoryLabel.displayName = 'CategoryLabel';

export function Buckets() {
	// Hooks
	const { data: profile } = useProfile();
	const { data: buckets, updateBucketsCategory, deleteBucketsCategory } = useBuckets(profile);
	const [{ isUserProfile, createBucket }] = useOutletContext();

	// State
	const [confirmDelete, setConfirmDelete] = useState(null);
	const [deleteWithBuckets, setDeleteWithBuckets] = useState(false);

	const [showNewCategory, setShowNewCategory] = useState(false);
	const [newCategoryValue, setNewCategoryValue] = useState('');
	const [tmpCategories, setTmpCategories] = useState([]);
	const [categoryEditing, setCategoryEditing] = useState();

	// Refs
	const newCategoryRef = useRef();
	const categoryInpRef = useRef();

	const groupedBucket = useMemo(
		() => groupBy(buckets || [], ({ category }) => category || UNCATEGORIZED_BUCKETS_LABEL),
		[buckets]
	);

	useEffect(() => {
		if (showNewCategory) {
			newCategoryRef.current?.focus?.();
		}
	}, [showNewCategory]);

	useEffect(() => {
		if (categoryEditing) {
			categoryInpRef.current?.focus?.();
		}
	}, [categoryEditing]);

	useEffect(() => {
		const filteredCategories = tmpCategories.filter((category) => !groupedBucket[category]);
		setTmpCategories(filteredCategories);
	}, [buckets]);

	const saveCategory = (e) => {
		e.preventDefault();

		if (!newCategoryValue?.length) {
			return;
		}

		setNewCategoryValue('');
		setShowNewCategory(false);
		setTmpCategories((val) => [newCategoryValue, ...val]);
	};

	const editCategory = (category) => {
		setCategoryEditing(category);
		setNewCategoryValue(category);
		setShowNewCategory(false);
	};
	const cancelEditCategory = () => {
		setCategoryEditing(null);
		setNewCategoryValue('');
	};
	const submitEditCategory = (e) => {
		e.preventDefault();
		if (!newCategoryValue?.length) {
			return;
		}

		updateBucketsCategory(
			{ category: encodeURIComponent(categoryEditing), data: { label: newCategoryValue } },
			{
				onSuccess: () => {
					setCategoryEditing(null);
					setNewCategoryValue('');
				}
			}
		);
	};

	const submitEditTmpCategory = (e) => {
		e.preventDefault();
		if (!newCategoryValue?.length) {
			return;
		}

		setTmpCategories((val) => val.map((item) => (item === categoryEditing ? newCategoryValue : item)));
		setCategoryEditing(null);
		setNewCategoryValue('');
	};

	const deleteCategory = (withBuckets) => {
		if (tmpCategories.includes(confirmDelete)) {
			setTmpCategories((categories) => categories.filter((item) => item !== confirmDelete));
			setConfirmDelete(null);
			setDeleteWithBuckets(false);
		} else {
			deleteBucketsCategory(
				{ category: encodeURIComponent(confirmDelete), withBuckets },
				{
					onSuccess: () => {
						setConfirmDelete(null);
						setDeleteWithBuckets(false);
					}
				}
			);
		}
	};

	return (
		<div>
			{isUserProfile && (
				<div className="flex mb-8 min-h-[40px]">
					<Button
						variant="ghost"
						className="rounded-full border"
						disabled={showNewCategory}
						iconBegin={<Icon icon="ic:round-plus" />}
						onClick={() => {
							setShowNewCategory(true);
							setCategoryEditing(null);
							setNewCategoryValue('');
						}}
					>
						Add section
					</Button>
				</div>
			)}

			<div className="flex flex-col">
				{showNewCategory && (
					<form onSubmit={saveCategory}>
						<div className="mb-20 flex items-center gap-1">
							<Input
								ref={newCategoryRef}
								value={newCategoryValue}
								placeholder="Section Name"
								onChange={({ target }) => setNewCategoryValue(target.value)}
								className="bg-white/10 w-[300px]"
							/>
							<Button
								type="submit"
								variant="default"
								className="rounded-full border"
								disabled={!newCategoryValue?.length}
								iconBegin={<Icon icon="ic:round-plus" />}
							>
								Save
							</Button>
							<Button
								type="button"
								variant="secondary"
								className="rounded-full"
								onClick={() => setShowNewCategory(false)}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}

				{!!tmpCategories.length &&
					tmpCategories.map((category) => (
						<div key={category} className="mb-20">
							<CategoryLabel
								ref={categoryInpRef}
								value={newCategoryValue}
								categoryEditing={categoryEditing}
								category={category}
								editCategory={editCategory}
								cancelEditCategory={cancelEditCategory}
								onDelete={() => setConfirmDelete(category)}
								onChange={setNewCategoryValue}
								onSubmit={submitEditTmpCategory}
							/>
							<div className="grid grid-cols-5 gap-16">
								{isUserProfile && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="flex items-center"
									>
										<BucketItem
											defaultIcon="ic:round-plus"
											width="w-[64px]"
											iconProps={{ color: '#06f', fontSize: '42px' }}
											onClick={() => createBucket({ category })}
										/>
									</motion.div>
								)}
							</div>
						</div>
					))}

				{Object.keys(groupedBucket).map((category) => (
					<div key={category} className="mb-20">
						<CategoryLabel
							ref={categoryInpRef}
							value={newCategoryValue}
							category={category}
							categoryEditing={categoryEditing}
							editCategory={editCategory}
							cancelEditCategory={cancelEditCategory}
							onDelete={() => setConfirmDelete(category)}
							onChange={setNewCategoryValue}
							onSubmit={submitEditCategory}
						/>
						<div className="grid grid-cols-5 gap-16">
							{groupedBucket[category].map((bucket, index) => (
								<motion.div
									key={bucket.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
								>
									<BucketItem
										data={bucket}
										name={bucket.name}
										preview={bucket.videos[0]?.videoUrl}
										documentId={bucket.id}
									/>
								</motion.div>
							))}
							{isUserProfile && (
								<motion.div
									key="ADD NEW"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: groupedBucket[category].length * 0.05 }}
									className="flex items-center"
								>
									<BucketItem
										defaultIcon="ic:round-plus"
										width="w-[64px]"
										iconProps={{ color: '#06f', fontSize: '42px' }}
										onClick={() => createBucket({ category })}
									/>
								</motion.div>
							)}
						</div>
					</div>
				))}
				{!Object.keys(groupedBucket).length && isUserProfile && !tmpCategories.length && (
					<motion.div
						key="ADD NEW"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="flex items-center mt-10"
					>
						<BucketItem
							defaultIcon="ic:round-plus"
							width="w-[64px]"
							iconProps={{ color: '#06f', fontSize: '42px' }}
							onClick={() => createBucket({ category: 'Unlisted' })}
						/>
					</motion.div>
				)}
			</div>
			<PageModal show={!!confirmDelete} onClose={() => setConfirmDelete(null)} width="600px">
				<div className="flex flex-col justify-center p-16 gap-5">
					<div>
						<Typography variant="h3" className="pb-2">
							Are you sure you want to delete this section?
						</Typography>
						<Typography>
							This section {confirmDelete} includes {groupedBucket[confirmDelete]?.length || 0} buckets
						</Typography>
					</div>
					{groupedBucket[confirmDelete]?.length && (
						<div>
							<label className="flex items-center gap-1">
								<Input
									checked={!deleteWithBuckets}
									type="radio"
									name="deleteCategoryOption"
									className="w-auto"
									onChange={(e) => setDeleteWithBuckets(!e.target.checked)}
								/>
								Delete this section and keep these {groupedBucket[confirmDelete]?.length || 0} buckets
							</label>
							<label className="flex items-center gap-1">
								<Input
									checked={deleteWithBuckets}
									type="radio"
									name="deleteCategoryOption"
									className="w-auto"
									onChange={(e) => setDeleteWithBuckets(e.target.checked)}
								/>
								Delete this section and delete these {groupedBucket[confirmDelete]?.length || 0} buckets
							</label>
						</div>
					)}
					<div className="w-full">
						<div className="pt-5 flex gap-2 justify-end">
							<Button variant="secondary" className="rounded-full" onClick={() => setConfirmDelete(null)}>
								Cancel
							</Button>
							<Button variant="destructive" className="rounded-full" onClick={() => deleteCategory(deleteWithBuckets)}>
								Delete section
							</Button>
						</div>
					</div>
				</div>
			</PageModal>
		</div>
	);
}
