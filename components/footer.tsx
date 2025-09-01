const Footer = () => {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">RozgaarSetu</h3>
            <p className="text-gray-400 text-sm">
              Connecting blue-collar workers with opportunities across India.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Post Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How it Works
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 RozgaarSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
