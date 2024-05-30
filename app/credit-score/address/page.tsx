'use client'

import React, { useState } from 'react'
import { 
  VStack, 
  Button, 
  FormControl, 
  FormLabel, 
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormErrorMessage
 } from '@chakra-ui/react'
import { Formik, Field, Form } from 'formik';

export default function Page() {
  return (
    <>
      <FormControl>
        <FormLabel>Address</FormLabel>
      </FormControl>
      <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    validate={(value: any) => {
                      let error;

                      if (value.length < 6) {
                        error = "Password must contain at least 6 characters";
                      }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button type="submit" width="full">
                  Login
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
    </>
  );
}

