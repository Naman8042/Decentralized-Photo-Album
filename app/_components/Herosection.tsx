"use client"
import RotatingText from 'react-rotating-text';

export default function Herosection() {
    return (
        <div className='flex flex-col  min-h-screen justify-center items-center'>
            <div>
                <p className='text-2xl md:text-6xl text-center mb-2 text-white '>
                    Share your favorite moments with <br /> Friends and Family!
                </p>
            </div>
            <div className='mb-4 flex flex-col items-center text-muted font-medium text-sm md:text-lg'>
                <p className='md:hidden'>Tap on create new album to create an</p>

                <h1 className='flex items-center gap-2 text-green-400'>
                    <p className='hidden md:block text-slate-300'>
                        Tap on create new album to create an album of your recent
                    </p>

                    <RotatingText
                        items={['Trip 🏕️', 'Wedding 💍', 'Party 🪩', 'Get Together 🚀']}
                        typingInterval={100} // Adjust typing speed
                        pause={2000} // Adjust pause duration between rotations

                    />

                </h1>

            </div>
            <Createnewalbumbutton/>
        </div>

    )
}

function Createnewalbumbutton() {
    return (
        <div>
            <button className='bg-green-800 text-white py-1 px-2 rounded-md'>
                Create new Album
            </button>
        </div>
    )
}