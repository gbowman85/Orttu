export default function SupportPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <h1 className="text-4xl font-bold mb-8">Support</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
                {/* Important Notice */}
                <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">No Support Provided</h2>
                    <p className="text-yellow-800 leading-relaxed">
                        This website is an academic project created by Graham Bowman for an MSc Computer Science course at Keele University.  
                        <strong>No technical support, customer service, or assistance is provided.</strong> This platform is designed 
                        for educational and demonstration purposes only.
                    </p>
                </section>

                {/* Self-Help Resources */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Self-Help Resources</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you're interested in learning about workflow automation or understanding how this platform works, 
                        you can explore these resources:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>User Guide:</strong> Visit our <a href="/guide" className="text-blue-600 hover:underline">guide page</a> for information about how to use the platform</li>
                        <li><strong>About Page:</strong> Learn more about the <a href="/about" className="text-blue-600 hover:underline">academic nature of this project</a></li>
                        <li><strong>Privacy Policy:</strong> Review our <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a> for data handling information</li>
                    </ul>
                </section>

                {/* Academic Context */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Academic Project Context</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This platform serves as a demonstration of workflow automation concepts and modern web development practices. 
                        It showcases:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Integration with third-party APIs and services</li>
                        <li>User authentication and authorization systems</li>
                        <li>Real-time data processing and workflow execution</li>
                        <li>Modern web application architecture and design patterns</li>
                        <li>Database design and management for complex workflows</li>
                    </ul>
                </section>

                {/* Troubleshooting */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">If You Encounter Issues</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Since this is an academic project with no support provided, if you encounter any issues:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Try refreshing the page or clearing your browser cache</li>
                        <li>Check that you're using a modern web browser</li>
                        <li>Ensure you have a stable internet connection</li>
                        <li>Consider that the platform may be temporarily unavailable</li>
                        <li>Remember that this is a demonstration project, not a production service</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
