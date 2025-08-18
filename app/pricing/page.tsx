import { Metadata } from 'next'
import PricingComponent from './pricingcomponent'
import { homeData } from '../actions/utils'

export const metadata: Metadata = {
  title: 'Pricing Plans | ChrisWrldArena',
  description: 'Choose your subscription plan and access premium predictions',
}

const paymentKeys: Record<string, string> = {
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY || '',
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY || '',
  FLW_ENCRYPTION_KEY: process.env.FLW_ENCRYPTION_KEY || '',
  FLW_BASE_URL: process.env.FLW_BASE_URL || '',
  FLW_SUBACCOUNT_ID: process.env.FLW_SUBACCOUNT_ID || '',
}

export default async function PricingPage() {
  const homedata = await homeData()
  return (
    <PricingComponent paymentKeys={paymentKeys} content={homedata} />
  )
}
