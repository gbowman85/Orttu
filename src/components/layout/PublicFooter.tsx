import Image from 'next/image'

export default function PublicFooter() {
    return (
        <footer className="w-full border-t">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                            Privacy Policy
                        </a>
                        <a href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                            Support
                        </a>
                    </div>
                    <div>
                        <Image src="/images/logo/novaLearn-logo-120.png" alt="novaLearn Logo" className="h-16 w-16" width={120} height={120} />
                    </div>
                </div>
            </div>
        </footer>
    );
} 