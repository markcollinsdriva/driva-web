'use client'
import { useRef, useEffect } from 'react'
import Script from 'next/script'
import { Box } from '@chakra-ui/react'

export const TrustBox = () => {
  const ref = useRef(null)
  useEffect(() => {
    // @ts-ignore
    window?.Trustpilot?.loadFromElement(ref.current, true)
  }, [])

  return (
    <Box px='10'>
      <Script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.min.js"/>
      <div
        ref={ref} // We need a reference to this element to load the TrustBox in the effect.
        className="trustpilot-widget" data-locale="en-US" data-template-id="53aa8912dec7e10d38f59f36"
        data-businessunit-id="5e4b32c580da5a0001aed9a1" data-style-height="150px" data-style-width="100%" data-theme="light" data-stars="2,3,4,5">
        <a href="https://www.trustpilot.com/review/example.com" target="_blank" rel="noopener"> </a>
      </div>
    </Box>
  )
}