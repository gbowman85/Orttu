'use client'

import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Settings, Key } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAuthActions } from '@convex-dev/auth/react'
import { PasswordReset } from '@/components/auth/PasswordReset'

export default function AccountPage() {
    const user = useQuery(api.data_functions.users.currentUser)
    const { signOut } = useAuthActions()
    const [isChangingPassword, setIsChangingPassword] = useState(false)


    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success('Signed out successfully')
        } catch (error) {
            toast.error('Failed to sign out')
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <div className="grid gap-6">
                {/* User Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Your basic account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={user.name}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>Account created: {new Date(user._creationTime).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Reset */}
                {isChangingPassword ? (
                    <PasswordReset
                        onCancel={() => setIsChangingPassword(false)}
                        onSuccess={() => setIsChangingPassword(false)}
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Password & Security
                            </CardTitle>
                            <CardDescription>
                                Change your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                )}


                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Account Actions
                        </CardTitle>
                        <CardDescription>
                            Manage your account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-medium">Sign Out</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Sign out of your account on this device
                                    </p>
                                </div>
                                <Button variant="outline" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 