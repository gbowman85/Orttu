export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <h1 className="text-4xl font-bold mb-8">About</h1>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                    This website has been built by Graham Bowman as a project for an MSc Computer Science course at Keele University.
                    While the platform allows users to sign in and connect to various third-party tools and services,
                    it is not intended to be used as a commercial project. This is an academic demonstration of
                    workflow automation and integration capabilities. No guarantees are provided regarding the
                    reliability, security, or availability of the service, and users should exercise appropriate
                    caution when connecting their accounts to third-party applications.
                </p>
            </div>
        </div>
    );
} 