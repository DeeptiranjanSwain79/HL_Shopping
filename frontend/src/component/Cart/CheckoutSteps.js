import { Typography, Stepper, Step, StepLabel } from '@mui/material'
import React, { Fragment } from 'react';
import { MdLocalShipping } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
import "./CheckoutSteps.css"

const CheckoutSteps = ({ activeStep }) => {//eslint-disable-next-line
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <MdLocalShipping />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <MdCheckCircle />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <MdAccountBalance />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box"
  }

  return (
    <Fragment>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step key={index} active={(activeStep === index) ? true : false}
            completed={(activeStep >= index) ? true : false}
          >
            <StepLabel icon={item.icon} style={{ color: (activeStep >= index) ? "deepskyblue" : "rgba(0, 0, 0, 0.65)", fontSize: "36px" }}
            >{item.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Fragment>
  )
}

export default CheckoutSteps
