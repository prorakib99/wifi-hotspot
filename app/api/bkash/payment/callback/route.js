import axios from 'axios';
import { bkashAuth } from '@/app/api/bkashAuth';
import { getUserById } from '@/queries/user';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    if (status === 'cancel' || status === 'failure') {
        return NextResponse.redirect(`${process.env.BASE_URL}/dashboard?message=${status}`);
    }

    if (status === 'success') {
        const authSuccess = await bkashAuth(req);

        if (!authSuccess) {
            return NextResponse.json({ error: 'Authentication failed', status: 401 });
        }

        try {
            const { data } = await axios.post(
                process.env.BKASH_EXECUTE_PAYMENT_URL,
                { paymentID },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        authorization: req.id_token,
                        'x-app-key': process.env.BKASH_API_KEY
                    }
                }
            );

            if (data && data.statusCode === '0000') {
                // Get UserId to UserIf
                const user = await getUserById(userId);

                // Create New user in mikrotik
                const createdUserInMikrotik = await fetch(
                    `${process.env.BASE_URL}/api/mikrotik/addHotspotUser`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        },
                        body: JSON.stringify({
                            username: user?.phone,
                            password: user?.phone
                        })
                    }
                );
                const mikrotikResponse = await createdUserInMikrotik.json();

                return NextResponse.redirect(
                    `${process.env.BASE_URL}/dashboard?success=${mikrotikResponse?.success}${
                        mikrotikResponse?.error && `&error=${mikrotikResponse?.error}`
                    }`
                );
            } else {
                return NextResponse.redirect(
                    `${process.env.BASE_URL}/dashboard?message=${data.statusMessage}`
                );
            }
        } catch (error) {
            return NextResponse.redirect(
                `${process.env.BASE_URL}/dashboard?message=${error.message}`
            );
        }
    }
}
