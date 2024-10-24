"use client"

import { Button } from "@/components/ui/button"

import SortableCardList from "@my-components/form/card-form"

import Link from "next/link"


export default function SignUp() {
    return(
        <div>
            <Button asChild><Link href="/home">Home</Link></Button>
            <div>game main page</div>
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-4">Drag and Sort the Cards</h1>
                <SortableCardList />
            </div>
            
        </div>
        
    )
}