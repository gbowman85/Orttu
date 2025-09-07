export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none space-y-8">
                {/* Important Notice */}
                <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Important Notice</h2>
                    <p className="text-yellow-800 leading-relaxed">
                        This website is an academic project created by Graham Bowman for an MSc Computer Science course at Keele University.
                        It is not intended for public use or commercial purposes. No guarantees are provided regarding data security,
                        privacy protection, or service availability.
                    </p>
                </section>

                {/* Data Collection */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Collection and Usage</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        As an academic demonstration project, this platform may collect and process the following types of data:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Account information (email, name) for user authentication</li>
                        <li>Workflow configurations and automation settings</li>
                        <li>Third-party service connection data (OAuth tokens, API keys)</li>
                        <li>Usage analytics and workflow execution logs</li>
                    </ul>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Third-Party Service Connections</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This platform integrates with various third-party services (such as Gmail, Google Drive, etc.)
                        through secure OAuth connections. When you connect these services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>We store only the necessary authentication tokens required for automation</li>
                        <li>We do not access or store your personal data from these services</li>
                        <li>All connections are handled through industry-standard OAuth protocols</li>
                        <li>You can revoke access at any time through your account settings</li>
                    </ul>
                </section>

                {/* Data Security */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                        While we implement standard security practices, this is an academic project and should not be considered
                        production-ready. We recommend:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                        <li>Not using this platform with sensitive or confidential data</li>
                        <li>Regularly reviewing and revoking third-party service connections</li>
                        <li>Using strong, unique passwords for your account</li>
                        <li>Being cautious when connecting personal or business accounts</li>
                    </ul>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
                    <p className="text-gray-700 leading-relaxed">
                        As an academic project, data may be retained for research and demonstration purposes.
                        However, you can request deletion of your account and associated data at any time.
                        Please note that this is a demonstration platform and data may be periodically cleared
                        or reset for academic purposes.
                    </p>
                </section>

                {/* No Commercial Use */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">No Commercial Use</h2>
                    <p className="text-gray-700 leading-relaxed">
                        This platform is created solely for academic purposes and is not intended for commercial use.
                        We do not sell, rent, or monetize any user data. The platform is provided as-is for
                        educational and demonstration purposes only.
                    </p>
                </section>


            </div>
        </div>
    );
} 