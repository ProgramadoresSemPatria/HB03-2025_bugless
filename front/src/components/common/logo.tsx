import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href='/' className='flex items-center'>
      <Image
        src='/assets/logo/bugless_logo_transparent.png'
        alt='Bugless logo'
        width={36}
        height={36}
        className='size-9 lg:size-11'
      />
      <span className='text-xl lg:text-2xl'>Bugless</span>
    </Link>
  )
}
