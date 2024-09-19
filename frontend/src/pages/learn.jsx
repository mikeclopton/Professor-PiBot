import React, { useState } from 'react'
import './learn.css'
import Input from '../components/input'
import Output from '../components/output'
import Tutor from '../components/tutor'

function Learn() {
  return(
    <>
        <div className="learn">
            <div className="learn-input">
            <Input />
            </div>
            <div className="learn-output">
            <Output />
            </div>
            <div className="learn-tutor">
            <Tutor />
            </div>
        </div>
    </>
  )
}


export default Learn