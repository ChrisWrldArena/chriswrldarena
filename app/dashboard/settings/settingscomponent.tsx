
'use client';
import { useAuth } from '@/app/contexts/AuthContext';
import { useContent } from '@/app/contexts/ContentContext';
import { Payment } from '@prisma/client';
import { CheckCircleIcon, X } from 'lucide-react';
import { User } from 'next-auth';
import router from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface PricingPlanProps {

    id: string;
    name: string;
    price: number;
    currency: string;
    plan: string;
    features: string[];
    isPopular: boolean;
}
type SettingsComponentProps = {
    currency: string;
    pricingPlans?: PricingPlanProps[];
};

const Settingscomponent = ({ currency }: SettingsComponentProps) => {
    const { user } = useAuth()
    const { content } = useContent()

    const [users, setUsers] = useState<User[]>([])
    const [pricingPlans, setPricingPlans] = useState<PricingPlanProps[]>([])
    const settings = content?.settings || {}
    const [transactions, setTransaction] = useState<Payment[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedPlan, setSelectedPlan] = useState(pricingPlans[0])
    const [autoRenew, setAutoRenew] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingPlanIdx, setEditingPlanIdx] = useState<number | null>(null);
    const [editPlan, setEditPlan] = useState<any>(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [userRes, paymentRes] = await Promise.all([
                    await fetch("/api/user"),
                    await fetch("/api/payment/?include={ \"user\":true }"),
                ]);
                if (!userRes.ok) throw new Error("Failed to fetch users");
                if (!paymentRes.ok) throw new Error("Failed to fetch payments");
                const data = await userRes.json();
                const payments = await paymentRes.json();

                setUsers(data);
                setTransaction(payments);
            } catch {
                setUsers([]);
            } finally {

            }
        };
        fetchUsers();
    }, []);

    function handleUserChange(option: any) {
        setSelectedUser(option)
        console.log("Selected user:", option)
    }

    function handlePlanChange(option: any) {
        setSelectedPlan(option)
        console.log("Selected plan:", option)
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Calculate expiresAt based on selected plan
        const expiresAt = new Date();
        switch (selectedPlan.plan) {
            case "DAILY":
                expiresAt.setDate(expiresAt.getDate() + 1);
                break;
            case "WEEKLY":
                expiresAt.setDate(expiresAt.getDate() + 7);
                break;
            case "MONTHLY":
                expiresAt.setMonth(expiresAt.getMonth() + 1);
                break;
            case "YEARLY":
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                break;
            default:
                expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        const subdata = {
            userId: selectedUser?.id,
            plan: selectedPlan.plan,
            status: "ACTIVE",
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
        }

        const paydata = {
            userId: selectedUser?.id,
            price: selectedPlan.price,
            reference: Date.now().toString(),
            status: "SUCCESS",
            currency: user?.location?.currencycode || "USD",
        }
        console.log("Subscription data:", subdata)
        // console.log("Payment data:", paydata)
        setIsSubmitting(true);
        try {
            const [subResponse, payResponse] = await Promise.all([
                await fetch("/api/subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(subdata),
                }),
                await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paydata),
                }),
            ]);
            if (!subResponse.ok || !payResponse.ok) {
                throw new Error("Failed to create subscription or payment.");
            }
            if (!subResponse.ok || !payResponse) throw new Error("Failed to create user." + subResponse.statusText || payResponse.statusText);
            toast.success("User created successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/users");
        } catch (error: any) {
            toast.error("Failed to create user. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }


    }

    const handleUpdateSubmit = async (e: React.FormEvent, updateid: string) => {
        e.preventDefault();
        // Save to DB
        console.log("Updating plan:", editPlan);
        try {
            const { id, ...planData } = editPlan;
            const updateres = await fetch(`/api/pricing/${updateid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(planData),
            });
            if (!updateres.ok) {
                const { id, ...planData } = editPlan;
                const res = await fetch(`/api/pricing`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(planData),
                });
                if (!res.ok) throw new Error("Failed to Save pricing plan. " + res.statusText);

            }
            toast.success("Plan updated!");
            setEditingPlanIdx(null);

        } catch (err: any) {
            toast.error("Failed to update plan. " + err.message);
        }
    }



    useEffect(() => {
        if (content?.pricing) {
            const plans = content.pricing.map((plan: PricingPlanProps) => ({
                id: plan.id,
                name: plan.name,
                price: plan.price,
                currency: plan.currency || currency,
                plan: plan.plan,
                features: plan.features || [],
                isPopular: plan.isPopular || false,
            }));
            setPricingPlans(plans);
        }
    }, [content, currency]);


    return (
        <div className='w-full'>
            <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mx-auto my-16">
                <div className={`flex items-center justify-center bg-neutral-100 rounded-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-dashed  border-neutral-600`}>
                    <button className='size-16 rounded-full bg-blue-500 hover:bg-blue-600 text-3xl text-white'
                        onClick={() => {
                            if (pricingPlans.length >= 4) toast.error("You can only have a maximum of 4 pricing plans.")
                        }}>
                        <svg className="h-8 w-8 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                </div>
                {pricingPlans.map((plan, idx) => (
                    <div
                        key={plan.id}
                        className={`flex flex-col relative bg-white rounded-lg p-6 transform hover:scale-105 hover:shadow-2xl py-12 transition-transform duration-300 ${plan.isPopular ? 'border-2 border-blue-600' : 'border border-neutral-200 shadow-md'
                            }`}>

                        {/* Popular Tag */}
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg">
                                Popular
                            </div>
                        )}
                        {editingPlanIdx === idx ? (
                            // Editable Card
                            <form
                                onSubmit={(e) => handleUpdateSubmit(e, plan.id)}
                                className="flex flex-col h-full"
                            >
                                <input
                                    className="text-xl font-bold text-gray-800 mb-4 border rounded px-2 py-1"
                                    value={editPlan.name}
                                    onChange={e => setEditPlan({ ...editPlan, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="text-2xl font-bold text-blue-600 mb-6 border rounded px-2 py-1"
                                    type="number"
                                    value={editPlan.price}
                                    onChange={e => setEditPlan({ ...editPlan, price: Number(e.target.value) })}
                                    required
                                />
                                <input
                                    className="mb-4 border rounded px-2 py-1"
                                    value={editPlan.currency}
                                    onChange={e => setEditPlan({ ...editPlan, currency: e.target.value })}
                                    required
                                />
                                <input
                                    className="mb-4 border rounded px-2 py-1"
                                    value={editPlan.plan}
                                    onChange={e => setEditPlan({ ...editPlan, plan: e.target.value })}
                                    required
                                />
                                <label className="block text-sm text-red-500 mb-2">Features (one feature per line, press enter to separete them)</label>
                                <textarea
                                    className="mb-4 border rounded px-2 py-1"
                                    value={editPlan.features.join('\n')}
                                    onChange={e => setEditPlan({ ...editPlan, features: e.target.value.split('\n') })}
                                    required
                                />
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                        onClick={() => setEditingPlanIdx(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Normal Card
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">{plan.name}</h2>
                                <p className="text-2xl font-bold text-blue-600 mb-6">
                                    <span className="text-base text-neutral-500">{plan.currency}</span>
                                    {plan.price.toLocaleString()}
                                    <span className="text-lg font-normal text-gray-500">/{plan.plan}</span>
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="w-full mt-auto bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                                    onClick={() => {
                                        setEditingPlanIdx(idx);
                                        setEditPlan({ ...plan, features: [...plan.features] });
                                    }}
                                >
                                    Edit Pricing
                                </button>
                            </>
                        )}
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Settingscomponent