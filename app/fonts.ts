import localFont from 'next/font/local'

export const PPNeue = localFont({
  src: [
    {
      path: '../public/fonts/PPNeueMontreal/web/PPNeueMontreal-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontreal/web/PPNeueMontreal-SemiBold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
})