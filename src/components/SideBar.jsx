import React from 'react';

import { Icon } from '@iconify/react';
import { ObserveIcon } from '@/components/ObserveIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/chadcn/Separator';
import { cn } from '@/lib/utils';
import { useAuthenticationProviders } from '@/hooks/useAuthenticationProviders';
import { useAuth } from '@/providers/Authentication';

export function SideBar() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user } = useAuth();

	// if (isLoading) return <></>;

	return (
		<aside className="inline-flex items-center flex-col  h-screen p-4 text-gray-400 fixed top-0 left-0 border-r-2">
			<button onClick={() => navigate('/')}>
				<ObserveIcon size={50} rounded />
			</button>

			<div className="inline-flex flex-col items-center gap-8   mt-10">
				<button
					onClick={() => navigate('/profile')}
					className={cn(
						'transition ease-in-out hover:text-primary hover:scale-105  rounded-full p-2 shadow-xl',
						user?.uid === pathname.split('/')[1] && 'text-primary'
					)}
				>
					<Icon width={40} icon="iconamoon:profile" />
				</button>

				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={45} icon="ion:compass-outline" />
				</button>
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={40} icon="ion:briefcase-outline" />
				</button>
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={40} icon="ion:analytics" />
				</button>

				<Separator className="my-5" />

				<button className="transition ease-in-out hover:text-primary hover:scale-105 rounded-full border-dashed border-[3px] p-2 border-gray-300">
					<Icon width={30} icon="ion:add" />
				</button>
			</div>

			{/* <div>
        <button>
          <Icon width={40} icon="iconamoon:trash" />
        </button>
      </div> */}
		</aside>
	);
}
