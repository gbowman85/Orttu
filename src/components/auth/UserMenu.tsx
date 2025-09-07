'use client'

import { useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '@/../convex/_generated/api'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const getInitials = (name: string) => {
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
}

export function UserMenu() {
    const user = useQuery(api.data_functions.users.currentUser)
    const { signOut } = useAuthActions()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success('Signed out successfully')
        } catch {
            toast.error('Failed to sign out')
        }
    }

    // If no user is found, don't render anything
    if (!user) {
        return null
    }

    const initials = user.name ? getInitials(user.name) : '?'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
