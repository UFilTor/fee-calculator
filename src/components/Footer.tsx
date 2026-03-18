export default function Footer() {
  return (
    <footer className="mt-8 text-xs text-gray-400 space-y-1 print:hidden">
      <p>
        Understory Pay fees from{" "}
        <span className="font-medium text-gray-500">help.understory.io</span>.
        Stripe fees from{" "}
        <span className="font-medium text-gray-500">stripe.com/pricing</span>.
        Stripe Dit MobilePay also has a 35 DKK/month membership fee (not included above).
      </p>
      <p>All fees are for standard EEA cards. Actual costs may vary.</p>
      <p className="text-gray-300">Last updated: March 2026</p>
    </footer>
  );
}
