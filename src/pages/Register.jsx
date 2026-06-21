import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, Phone, User, Camera, ChevronDown } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { COUNTRY_MAP, detectCountryFromPhone, generateApplicationId } from "@/lib/appIdGenerator";

const COUNTRY_OPTIONS = Object.entries(COUNTRY_MAP).map(([code, calling]) => ({
  code, calling, label: `${code} (+${calling})`
}));

export default function Register() {
  const [step, setStep] = useState("register"); // register | otp | profile
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("QAT");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setStep("profile");
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  // Upload avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAvatarUrl(file_url);
    } catch {
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Save profile with generated Application ID
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    if (!displayName.trim()) { setError("Display name is required"); return; }
    if (!phone.trim()) { setError("Mobile number is required"); return; }
    setLoading(true);
    try {
      const me = await base44.auth.me();

      // Auto-detect country from phone or use selected
      const fullPhone = `+${COUNTRY_MAP[selectedCountry]}${phone.replace(/\D/g, "")}`;
      const countryCode = detectCountryFromPhone(fullPhone) || selectedCountry;

      // Fetch all existing application IDs to ensure uniqueness
      const allProfiles = await base44.entities.UserProfile.list();
      const existingIds = allProfiles.map(p => p.application_id).filter(Boolean);
      const appId = generateApplicationId(countryCode, existingIds);

      setGeneratedId(appId);

      await base44.entities.UserProfile.create({
        user_id: me.id,
        display_name: displayName.trim(),
        avatar_url: avatarUrl,
        phone: fullPhone,
        country_code: countryCode,
        application_id: appId,
        previous_application_ids: [],
        is_online: true,
        setup_complete: true,
        role: "User",
        is_lucky_id: false,
      });

      // Provision all Supabase records via FK-safe chain (non-blocking)
      try {
        await base44.functions.invoke('supabaseProvision', {
          display_name: displayName.trim(),
          avatar_url: avatarUrl,
          phone: fullPhone,
          country_code: countryCode,
          application_id: appId,
        });
      } catch {
        // Supabase provisioning is secondary — Base44 profile is the source of truth
      }

      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  // ── OTP Screen ──
  if (step === "otp") {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a code to ${email}`}>
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
              <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Resend</button>
        </p>
      </AuthLayout>
    );
  }

  // ── Profile Setup Screen ──
  if (step === "profile") {
    return (
      <AuthLayout icon={UserPlus} title="Set up your profile" subtitle="Complete your profile to continue">
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="avatar-upload" className="cursor-pointer group">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 bg-muted flex items-center justify-center">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : uploading
                  ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  : <Camera className="w-7 h-7 text-muted-foreground" />
              }
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <p className="text-xs text-muted-foreground mt-2">Upload profile photo *</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="displayName" type="text" placeholder="Your display name" value={displayName}
                onChange={e => setDisplayName(e.target.value)} className="pl-10 h-12" required />
            </div>
          </div>

          {/* Country Selector */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select id="country" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
                className="w-full h-12 pl-3 pr-10 rounded-md border border-input bg-background text-sm appearance-none outline-none focus:ring-2 focus:ring-ring">
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number *</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 h-12 rounded-md border border-input bg-muted text-sm font-medium min-w-[70px]">
                +{COUNTRY_MAP[selectedCountry]}
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="300 1234567" value={phone}
                  onChange={e => setPhone(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Your Application ID will be auto-generated based on your country</p>
          </div>

          <Button type="submit" className="w-full h-12 font-medium" disabled={loading || uploading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating profile...</> : "Complete Setup →"}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // ── Register Screen ──
  return (
    <AuthLayout
      icon={UserPlus} title="Create your account" subtitle="Sign up to get started"
      footer={<>Already have an account?{" "}<Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
    >
      <Button variant="outline" className="w-full h-12 text-sm font-medium mb-6" onClick={handleGoogle}>
        <GoogleIcon className="w-5 h-5 mr-2" />Continue with Google
      </Button>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}