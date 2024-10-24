"use client"

import { useSelector, useDispatch } from 'react-redux';
// import {  setUserInfo } from '@shared-store/slices/user';
import { AppDispatch, RootState } from '@shared-store/index'; 
import { useEffect } from 'react';

import { Button } from "@/components/ui/button"

import Link from "next/link"

export default function homePage() {


    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        console.log("Updated user info: ", user);
    }, [user]);




    return(
        <div>
            <div>home page</div>
            <Button asChild><Link href="/game/ginrummy">GinRummy</Link></Button>
        </div>
     
    )
}