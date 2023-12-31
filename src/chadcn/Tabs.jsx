import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import PropTypes from 'prop-types';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
	<TabsPrimitive.List ref={ref} className={cn('w-full border-b', className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

TabsList.propTypes = {
	/** Additional class name */
	className: PropTypes.string
};

/**
 * @typedef {Object} TabsTriggerProps
 * @property {string} [className] - Additional class name
 * @property {boolean} [disabled] - Whether tab is disabled
 * @property {'active' | 'inactive'} [state] - State of tab
 */

/**
 * Renders a tab trigger element
 */
const TabsTrigger = React.forwardRef(
	/**
	 * @param {TabsTriggerProps} props
	 * @param {React.Ref} ref
	 */
	({ className, ...props }, ref) => (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(
				'inline-flex items-center justify-center  whitespace-nowrap px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-[#06F] data-[state=active]:font-bold',
				className
			)}
			{...props}
		/>
	)
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsTrigger.propTypes = {
	/** Additional class name */
	className: PropTypes.string,

	/** Whether tab is disabled */
	disabled: PropTypes.bool,

	/** State of tab */
	state: PropTypes.oneOf(['active', 'inactive'])
};

/**
 * @typedef {Object} TabsContentProps
 * @property {string} [className] - Additional class name
 */

/** Renders the tab content element */
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
TabsContent.propTypes = {
	/** Additional class name */
	className: PropTypes.string
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
