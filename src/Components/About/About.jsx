import React from 'react'
import MissionVision from './Mission'
import Overview from './Overview'
import Stats from './Stats'
import Team from './Team'
import Breadcrumb from './Breadcrumb'

function About() {
  return (
    <div>
      <Breadcrumb />
      <Overview />
      <MissionVision />
      <Stats />
    </div>
  )
}

export default About