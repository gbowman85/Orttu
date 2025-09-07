import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Clock, Shield, CheckCircle } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                Automate our Work Life
                                <span className="text-blue-600"> Effortlessly</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Connect your favorite apps and services to create powerful automated workflows.
                                Save time, reduce errors, and focus on what matters most.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button size="lg" className="text-lg px-8 py-6" asChild>
                                    <Link href="/login">
                                        Get Started
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                                    <Link href="/guide">
                                        Learn More
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right side - Hero Image */}

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/orttu-screenshot.png"
                                alt="Workflow automation dashboard showing connected apps and automated processes"
                                width={600}
                                height={400}
                                className="w-full h-auto"
                                priority
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Powerful Automation Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to streamline your business processes and boost productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Easy Setup</h3>
                            <p className="text-gray-600">
                                Create complex workflows in minutes with our intuitive drag-and-drop interface.
                                No coding required.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Scheduled Automation</h3>
                            <p className="text-gray-600">
                                Set up recurring tasks that run automatically on your schedule.
                                Daily, weekly, or custom intervals.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure Connections</h3>
                            <p className="text-gray-600">
                                Enterprise-grade security for all your integrations.
                                Your data is protected with industry-standard encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Connect Your Apps</h3>
                            <p className="text-gray-600">
                                Link your favorite services like Gmail, Google Drive, and more with secure OAuth connections.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Build Your Workflow</h3>
                            <p className="text-gray-600">
                                Choose triggers and actions to create automated sequences that work exactly how you need them.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Automate & Monitor</h3>
                            <p className="text-gray-600">
                                Watch your workflows run automatically and track their performance through detailed analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Save Time and Reduce Errors
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Stop doing repetitive tasks manually. Our automation platform handles the work
                                so you can focus on growing your business.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Eliminate Manual Work</h3>
                                        <p className="text-gray-600">Automate routine tasks and free up hours in your day</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Reduce Human Error</h3>
                                        <p className="text-gray-600">Consistent, reliable execution every time</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Scale Your Operations</h3>
                                        <p className="text-gray-600">Handle more work without adding more people</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Image
                                src="/images/orttu-examples.png"
                                alt="Dashboard showing workflow analytics and performance metrics"
                                width={600}
                                height={400}
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Automate Your Workflows?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already saving time and boosting productivity
                        with our automation platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/login">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white hover:bg-white hover:text-gray-900" asChild>
                            <Link href="/guide">
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
