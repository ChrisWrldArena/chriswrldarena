import { NextRequest, NextResponse } from 'next/server'

interface FlutterwaveTransaction {
    id: number
    tx_ref: string
    flw_ref: string
    device_fingerprint: string
    amount: number
    currency: string
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    ip: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    amount_settled: number
    card?: {
        first_6digits: string
        last_4digits: string
        issuer: string
        country: string
        type: string
        expiry: string
    }
    customer?: {
        id: number
        name: string
        phone_number: string
        email: string
        created_at: string
    }
}

interface FlutterwaveTransactionsResponse {
    status: string
    message: string
    data: FlutterwaveTransaction[]
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tx_ref, provider } = body

        if (!tx_ref) {
            return NextResponse.json(
                { status: 'failed', message: 'Missing tx_ref parameter' },
                { status: 400 }
            )
        }

        if (provider === 'flutterwave') {
            // Verify with Flutterwave
            const flutterwaveSecretKey = process.env.FLW_SECRET_KEY

            if (!flutterwaveSecretKey) {
                console.error('Flutterwave secret key not configured')
                return NextResponse.json(
                    { status: 'failed', message: 'Payment provider not configured' },
                    { status: 500 }
                )
            }

            // Fetch all transactions and filter by tx_ref
            const transactionsResponse = await fetch(
                'https://api.flutterwave.com/v3/transactions',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${flutterwaveSecretKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!transactionsResponse.ok) {
                console.error('Flutterwave transactions fetch failed:', transactionsResponse.status)
                return NextResponse.json(
                    { status: 'failed', message: 'Failed to fetch transactions' },
                    { status: 500 }
                )
            }

            const transactionsData: FlutterwaveTransactionsResponse = await transactionsResponse.json()

            // Find transaction with matching tx_ref
            const matchingTransaction = transactionsData.data?.find(
                (transaction: FlutterwaveTransaction) => transaction.tx_ref === tx_ref
            )
            //Get matching details

            if (!matchingTransaction) {
                return NextResponse.json(
                    { status: 'failed', message: 'Transaction not found' },
                    { status: 404 }
                )
            }

            // Check transaction status
            if (matchingTransaction.status === 'successful') {
                // Payment is successful
                return NextResponse.json({
                    status: 'success',
                    message: 'Payment verified successfully',
                    data: matchingTransaction
                })
            } else if (matchingTransaction.status === 'failed') {
                // Payment failed
                return NextResponse.json({
                    status: 'failed',
                    message: 'Payment failed',
                    data: matchingTransaction
                })
            } else {
                // Payment is still pending
                return NextResponse.json({
                    status: 'pending',
                    message: 'Payment is still pending',
                    data: matchingTransaction
                })
            }
        } else {
            return NextResponse.json(
                { status: 'failed', message: 'Unsupported payment provider' },
                { status: 400 }
            )
        }

    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { status: 'failed', message: 'Internal server error' },
            { status: 500 }
        )
    }
}
