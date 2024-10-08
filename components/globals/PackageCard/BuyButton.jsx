"use client";

import { toast } from "sonner";
import SubmitButton from "../SubmitButton/SubmitButton";

const BuyButton = ({ amount, user, packageId, disabled }) => {

    const packagePaymentAction = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bkash/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, userId: user?.id, packageId })
            });
            const result = await response.json();
            if (!result?.success) {
                toast.error(result?.error);
                return;
            }
            if (result?.paymentUrl) {
                window.location.href = result?.paymentUrl;
                return;
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <form action={packagePaymentAction} className="w-full">
                <SubmitButton disabled={disabled} className="w-full h-10 text-lg text-green-500 bg-transparent border-green-500 disabled:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted-foreground" variant="outline">
                    {disabled ? "Already Buy" : "Buy"}
                </SubmitButton>
            </form>
        </>
    );
};

export default BuyButton;