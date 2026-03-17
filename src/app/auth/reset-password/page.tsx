import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
