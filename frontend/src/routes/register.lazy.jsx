import { createLazyFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '../features/auth/pages/RegisterPage';

export const Route = createLazyFileRoute('/register')({
  component: RegisterPage,
});
