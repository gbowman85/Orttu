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
            <img src="/images/logo/nova-Learn-logo_120.png" alt="novaLearn Logo" className="h-16" />
          </div>
        </div>
      </div>
    </footer>
  );
} 