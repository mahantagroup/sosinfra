import React from 'react'
import Breadcrumb from './Breadcrumb'
import ExploreCities from './ServiceCard'
import ServiceList from './ServiceList'
import FaqSection from './ServiceFeature'

function Service() {
  return (
    <div>
    <Breadcrumb/>
    <ExploreCities/>
    {/* <ServiceList/> */}
    <FaqSection/>
    </div>
  )
}

export default Service