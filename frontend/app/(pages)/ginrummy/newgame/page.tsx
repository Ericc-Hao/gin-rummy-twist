"use client"

import { HeaderBar } from "@/lib/my-components/header-bar"

import  DealCards from "@/lib/my-components/deal-card-animation"


export default function GamePage() {

    return(
        <div className='h-full w-full flex flex-col '>
            <HeaderBar></HeaderBar>
            <div className="flex felx-row items-center justify-center w-full h-[600px] py-6 gap-4 px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                    <DealCards />
                     
                </div>
                {/* <div className="bg-gray-100 w-[100px] h-full">
                    dfsd
                 </div>  */}
            </div>
            
        </div>
        
    )
}