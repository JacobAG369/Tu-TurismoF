import { createLazyFileRoute } from '@tanstack/react-router';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';

export const Route = createLazyFileRoute('/recuperar-contrasena')({
  component: ForgotPasswordPage,
});
