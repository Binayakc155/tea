import dynamic from 'next/dynamic';

const ResetPasswordForm = dynamic(() => import('./ResetPasswordForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="text-white text-lg">Loading...</div>
    </div>
  ),
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
