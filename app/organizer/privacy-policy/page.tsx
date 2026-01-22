"use client";

import { AppHeader } from "@/components/app-header";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader showLogo={true} showAvatar={false} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-16 max-w-3xl text-gray-900">
        <div className="text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm md:text-base text-gray-700">
            Effective Date: <span className="font-medium">1st August 2025</span>
          </p>
        </div>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-800">
          <p>
            <strong>ghumakker</strong> (We/Us/Our) is an online platform where users (You) can discover and
            search fixed departure group trips. We partner with group trip organizers who
            list their trips, bringing together diverse and exciting travel experiences
            in one trustworthy place.
          </p>

          <p>
            We are currently in the development stage, and while the platform is not yet
            available for its intended purpose, we invite you to join our early access
            and updates list. By sharing your email address, you will be among the first
            to receive updates about our platform.
          </p>

          <p>
            Protecting your privacy is our priority. This Privacy Policy explains how we
            collect, use, and protect your personal information when you visit our
            prelaunch page and share your details with us. Please note that this policy
            applies only to our prelaunch page. It will be updated after launch as our
            services and data processing evolve.
          </p>

          <section>
            <h2 className="font-bold text-lg mb-2">1. Information We Collect</h2>
            <p>
              For the purpose to notify you about our launch, provide early access, and
              keep you informed about new features and opportunities, we collect your{" "}
              <strong>Email Address</strong> when you sign up as a traveler for early
              access.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Send you updates about our launch, features, and services.</li>
              <li>Improve our website and prelaunch experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">3. Sharing of Information</h2>
            <p>
              We do not sell or rent your personal information. We share your information
              with trusted service providers such as email communication platforms or
              hosting providers who assist us in operating our website, under strict
              confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">4. Data Security</h2>
            <p>
              We take the security of your personal information seriously. To safeguard
              it, we implement reasonable technical and organizational measures, including
              encryption and secure transmission of information, restricted access
              controls so that only authorized personnel and service providers can access
              your data, regular monitoring of our systems to detect and prevent
              unauthorized access or misuse, and secure hosting arrangements with trusted
              third-party providers who are bound by confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">5. Your Choices and Rights</h2>
            <p>
              You may unsubscribe from our communications at any time by clicking the
              “unsubscribe” link in our emails or by contacting us directly at{" "}
              <a
                href="mailto:connect@ghumakker.in"
                className="text-blue-600 hover:underline font-medium"
              >
                connect@ghumakker.in
              </a>
              .
            </p>
            <p>
              You may request access, correction, or deletion of your information by
              writing to us at{" "}
              <a
                href="mailto:connect@ghumakker.in"
                className="text-blue-600 hover:underline font-medium"
              >
                connect@ghumakker.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill
              the purposes outlined in this Privacy Policy, such as sending you updates
              or providing early access. Once the purpose for which the information was
              collected is fulfilled, or if you request deletion, we will securely delete,
              unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">7. Non-Applicability</h2>
            <p>
              Our website and services, including the prelaunch page, are not directed at
              individuals under the age of 18 and individuals residing outside India. If
              you fall within these categories, we kindly ask you not to use our platform
              at this stage.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">8. Data Protection Board of India</h2>
            <p>
              We aim to address all privacy-related concerns promptly. If you feel your
              issue has not been resolved to your satisfaction by us, you may raise it
              with the Data Protection Board of India in accordance with the Digital
              Personal Data Protection Act, 2023.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any updates will be
              posted here with a revised “Effective Date.”
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">10. Contact Us</h2>
            <p>
              If you have any questions or concerns, please contact us at{" "}
              <a
                href="mailto:connect@ghumakker.in"
                className="text-blue-600 hover:underline font-medium"
              >
                connect@ghumakker.in
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs md:text-sm text-gray-500 border-t border-gray-200 pt-4">
          © 2025 Copyright. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
