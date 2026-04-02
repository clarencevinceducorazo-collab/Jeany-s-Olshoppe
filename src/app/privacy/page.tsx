export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-headline mb-8">Privacy Policy</h1>
      
      <div className="prose prose-neutral min-w-full">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Jeany's Olshoppe. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Data We Collect</h2>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and social media profile photo.</li>
          <li><strong>Contact Data</strong> includes email address.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
        <p className="mb-4">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>To register you as a new customer.</li>
          <li>To process and deliver your order.</li>
          <li>To manage our relationship with you.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Facebook Login Data</h2>
        <p className="mb-4">
          If you choose to register and log in using your Facebook account, we will receive your name, email address, and profile picture from Facebook as approved by you during the login process. We do not access or post to your Facebook timeline or interact with your Facebook friends.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@example.com.
        </p>
      </div>
    </div>
  );
}
