'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@shared-store/index'; 
import { useEffect } from 'react';
// import { useRouter } from "next/navigation";

import { clearUserInfo } from '@shared-store/slices/user';

import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";


export function HeaderBar() {
    // 使用 useSelector 读取 Redux store 中的数据
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        console.log("Updated user info: ", user);
    }, [user]);


    // const router = useRouter();
    function handleLogout() {
        dispatch(clearUserInfo());
        // router.push("/login");
      }
    

    return (
        <header className="sticky top-0 z-50 w-full h-100px flex items-center justify-between px-4 py-2 flex-row ">
            <h1>HOME</h1>
            {user.username ? (
                    <HoverCard openDelay={0} closeDelay={100}>
                        <HoverCardTrigger asChild>
                            <Button variant="ghost">{user.username}</Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="bottom" align="end" className=" w-auto h-auto flex flex-col gap-2 shadow-lg border-none">
                                <Button variant="ghost">My Profile</Button>
                                <Button variant="ghost">My Friends</Button>
                                <Button variant="ghost" onClick={handleLogout}>Log out</Button>
                        </HoverCardContent>
                    </HoverCard>


                ) : (
                    <Button variant="ghost"><Link href="/login">Log in</Link></Button>
                )
            }
        </header>
    );
}
