"use client"

// import { useSelector, useDispatch } from 'react-redux';
// // import {  setUserInfo } from '@shared-store/slices/user';
// import { AppDispatch, RootState } from '@shared-store/index'; 
// import { useEffect } from 'react';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image';

import { HeaderBar } from '@/lib/my-components/header-bar';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"; 
  import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 



export default function homePage() {

    // 不要删
    // const dispatch = useDispatch<AppDispatch>();
    // const user = useSelector((state: RootState) => state.user);
    // useEffect(() => {
    //     console.log("Updated user info: ", user);
    // }, [user]);

    return(
        <div className='h-full w-full '>
            <HeaderBar></HeaderBar>
            <div className='flex felx-row items-center justify-center w-full flex-1 pt-[100px]'>
                <div className="group w-[300px] h-[300px] flex items-center justify-center bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                    <div className='flex flex-col gap-4 items-center justify-center '>
                        <Image 
                            src="/main-image/home.jpg"
                            alt="/main-image/home.jpg"
                            width={200}
                            height={200}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="w-full transition-transform duration-300 hover:opacity-75">Play Gin Rummy</Button>
                            </DrawerTrigger>
                            <DrawerContent className="m-4 w-full h-auto flex items-center justify-center">
                                <VisuallyHidden>
                                    <DialogTitle>Game Options</DialogTitle>
                                    <DialogDescription>Choose your game mode and start playing!</DialogDescription>
                                </VisuallyHidden>
                                <div className='flex flex-col w-[300px] gap-4 m-4 '>
                                    {StartButton("/ginrummy/newgame", "Start a New Game")}
                                    {StartButton("", "Continue a Game")}
                                    {StartButton("", "Start a Tutorial")}
                                    {StartButton("", "Play with a Friend")}
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </div>    
    )
}

export function StartButton(href: string, name: string) {
    return (
      <Button asChild className="w-full">
        <Link
          href={href}
          className="w-full text-center transition-transform duration-300 hover:opacity-75" 
        >
          {name}
        </Link>
      </Button>
    );
  }

