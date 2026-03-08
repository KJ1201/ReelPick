'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight, Github, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';

function AuthForm() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/reels';

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            });
            if (error) throw error;
            setStep('OTP');
            showToast('Verification code sent to your email', 'success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });
            if (error) throw error;
            showToast('Access granted. Welcome back!', 'premium');
            router.push(next);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] opacity-30" />

            <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 p-6 relative z-10 animate-fade-in">

                {/* Left Column: Branding & Inspiration */}
                <div className="hidden md:flex flex-1 flex-col items-start gap-8 max-w-[500px]">
                    <div className="flex flex-col gap-6">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                            <h1 className="text-3xl font-display font-black tracking-[-0.03em] text-primary">R</h1>
                        </div>
                        <h2 className="text-6xl font-sans font-black tracking-[-0.03em] text-white leading-[1.05]">
                            See everyday fashion from your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">close creators</span>.
                        </h2>
                    </div>

                    {/* Image Stack Inspiration */}
                    <div className="relative w-full h-[400px] mt-8 select-none pointer-events-none">
                        <div className="absolute top-0 left-0 w-[240px] aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl rotate-[-6deg] translate-x-4 bg-ink-80">
                            <Image
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop"
                                alt="Fashion 1"
                                fill
                                unoptimized
                                className="object-cover opacity-80"
                            />
                        </div>
                        <div className="absolute top-10 left-32 w-[240px] aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl rotate-[3deg] z-10 bg-ink-80">
                            <Image
                                src="https://images.unsplash.com/photo-1549439602-43bbcb62588a?w=600&auto=format&fit=crop"
                                alt="Fashion 2"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30" />
                                <div className="w-20 h-2 rounded-full bg-white/30" />
                            </div>
                        </div>
                        <div className="absolute top-20 left-64 w-[240px] aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl rotate-[-2deg] translate-x-[-20px] bg-ink-80">
                            <Image
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop"
                                alt="Fashion 3"
                                fill
                                unoptimized
                                className="object-cover opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Auth Form */}
                <div className="w-full max-w-md">
                    <div className="bg-[#111114]/60 backdrop-blur-3xl border border-white/[0.08] rounded-[40px] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col items-center">

                        <Link href="/store" className="mb-12 group">
                            <h1 className="text-4xl font-display font-black tracking-[-0.03em] text-primary group-hover:scale-105 transition-transform duration-500">
                                ReelShop
                            </h1>
                        </Link>

                        <div className="w-full space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight">
                                    {step === 'OTP' ? 'Security Check' : (mode === 'LOGIN' ? 'Log into ReelShop' : 'Create an Account')}
                                </h2>
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                                    {step === 'OTP' ? `Verifying session for ${email}` : (mode === 'LOGIN' ? 'Access your curated ecosystem' : 'Join the commerce revolution')}
                                </p>
                            </div>

                            <form onSubmit={step === 'EMAIL' ? handleSendOTP : handleVerifyOTP} className="space-y-6">
                                {step === 'EMAIL' ? (
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Phone number, username or email"
                                                className="w-full h-14 bg-white/[0.03] border border-white/[0.1] rounded-2xl px-6 text-white text-[15px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            required
                                            maxLength={8}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Verification Code"
                                            className="w-full h-14 bg-white/[0.03] border border-white/[0.1] rounded-2xl px-6 text-white text-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20 text-center tracking-[0.4em] font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setStep('EMAIL')}
                                            className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] hover:text-primary transition-colors w-full text-center"
                                        >
                                            Return to login hub
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-[11px] font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <span>{step === 'OTP' ? 'Authorize Session' : (mode === 'LOGIN' ? 'Log in' : 'Sign up')}</span>
                                    )}
                                </button>
                            </form>

                            <div className="pt-6 border-t border-white/[0.05] text-center">
                                <p className="text-[13px] text-white/40">
                                    {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"} {' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        {mode === 'LOGIN' ? 'Sign up' : 'Log in'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-6">
                        <p className="text-[10px] text-white/10 font-bold uppercase tracking-[0.4em]">
                            Global Node Architecture v2.0
                        </p>
                        <div className="flex items-center gap-1.5 text-white/20 opacity-50 grayscale contrast-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            <span className="text-[11px] font-black tracking-tighter">METASPACE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/10" />
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}
