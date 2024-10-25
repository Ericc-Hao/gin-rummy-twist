'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@shared-store/index'; 
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'; 
import { useState } from "react";

import { clearUserInfo } from '@shared-store/slices/user';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import { Dialog, DialogTrigger, DialogOverlay,DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import Dialog components
  
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExitIcon } from "@radix-ui/react-icons"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";


export function HeaderBar() {
    // 使用 useSelector 读取 Redux store 中的数据
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("Updated user info: ", user);
        console.log("Current URL:",  pathname )
    }, [user]);

    useEffect(() => {
        if (open) {
            // 禁用背景滚动，防止页面内容被压缩
            document.body.classList.add('overflow-hidden');
        } else {
            // 恢复滚动
            document.body.classList.remove('overflow-hidden');
        }
    }, [open]);



 
    function handleLogout() {
        dispatch(clearUserInfo());
    }

    function handleLeave(){
        setOpen(true)
    }
    

    return (
        <header className="sticky top-0 z-99 w-full flex items-center justify-between px-4 py-2 flex-row ">
            {pathname !== "/home" ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild> 
                            <Button size="icon" variant="ghost" onClick={handleLeave}><ExitIcon  className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center" className="bg-black text-white px-3 py-2 rounded-md shadow-lg">
                            <p>leave the game</p>
                        </TooltipContent>
                    </Tooltip>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent onInteractOutside={(event) => event.preventDefault()}
                                        className="w-[400px] h-[200px] max-w-full max-h-full p-6 rounded-md shadow-lg">
                            <DialogHeader>
                                <DialogTitle>Leave Game</DialogTitle>
                                <DialogDescription className='flex flex-col h-full justify-center'>
                                    <span>Are you sure you want to leave the game?</span>
                                    <span>Progress will not be saved</span>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className='flex flex-col h-full justify-center'>
                                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={() => {router.push('/home'); setOpen(false);}}>Leave</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TooltipProvider>

            ) : (<div>HOME</div>)}



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
