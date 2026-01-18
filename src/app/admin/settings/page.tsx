"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
    const { admin, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [form, setForm] = useState({
        currentPassword: "",
        newEmail: admin?.email || "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentEmail: admin?.email,
                    currentPassword: form.currentPassword,
                    newEmail: form.newEmail,
                    newPassword: form.newPassword || undefined
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: "Details updated successfully! Please login again." });
                setTimeout(async () => {
                    await logout();
                    router.push('/admin/login');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to update" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Security Credentials</h2>
                <p className="text-sm text-slate-500 mb-6">Update your admin login email or password.</p>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Email (Read Only)</label>
                        <input
                            type="text"
                            value={admin?.email || ''}
                            disabled
                            className="w-full rounded-md border-slate-200 bg-slate-50 text-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Email (Optional)</label>
                        <input
                            type="email"
                            name="newEmail"
                            value={form.newEmail}
                            onChange={handleChange}
                            className="w-full rounded-md border-slate-200 focus:border-primary focus:ring-primary"
                            placeholder="Enter new email ID"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            className="w-full rounded-md border-slate-200 focus:border-primary focus:ring-primary"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-md border-slate-200 focus:border-primary focus:ring-primary"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password (Required to save changes)</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border-slate-200 focus:border-primary focus:ring-primary"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-md font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
