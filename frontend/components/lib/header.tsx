'use client';

import { PersonIcon } from '@radix-ui/react-icons';
import { MyShowTooltipButton } from './button';

import { useSelector } from 'react-redux';
import { RootState } from '../../shared-store/index';
import { useEffect } from 'react';


export function MyHeader() {
    // 使用 useSelector 读取 Redux store 中的数据
    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        // console.log("Updated user info: ", user);
      }, [user]);

    return (
        <header className="sticky top-0 z-50 w-full flex items-center justify-around px-5 py-2 flex-row border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h1>COOKIE STOCK</h1>
            <MyShowTooltipButton IconName={PersonIcon} tooltipContent={"Log In"} link='/login' />
        </header>
    );
}
