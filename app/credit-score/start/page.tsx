'use client'

import React, { useState } from 'react'
import { 
  VStack, 
  Box, 
  FormControl, 
  FormLabel, 
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormErrorMessage,
  Button,
  Link
 } from '@chakra-ui/react'
import { Formik, Field, Form } from 'formik';

import OtpInput from 'react-otp-input';

export default function Page() {
  const [otp, setOtp] = useState('');
  return (
    <Box>
      <Box>We've send a code to your phone ending in 9666</Box>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      <Link>Send again</Link>
      <Box>Incorrect code. Try again</Box>
    </Box>
  );
}

