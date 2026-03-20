import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';

const userSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio.'),
  email: z.string().trim().min(1, 'El email es obligatorio.').email('Ingresa un email valido.'),
  telefono: z.string().trim().optional().or(z.literal('')),
  rol: z.enum(['admin', 'turista'], { message: 'Selecciona un rol valido.' }),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
});

const defaultValues = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rol: 'turista',
  password: '',
};

export function UserFormDialog({ open, onOpenChange, onSubmit, isPending }) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>Crea una cuenta y asigna su rol dentro de la plataforma.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full space-y-6 overflow-hidden">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-name">Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} id="admin-user-name" name="nombre" placeholder="Nombre" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-lastname">Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} id="admin-user-lastname" name="apellido" placeholder="Apellido" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} id="admin-user-email" name="email" type="email" placeholder="correo@ejemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-phone">Telefono</FormLabel>
                    <FormControl>
                      <Input {...field} id="admin-user-phone" name="telefono" placeholder="3331234567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-role">Rol</FormLabel>
                    <FormControl>
                      <Select {...field} id="admin-user-role" name="rol">
                        <option value="turista">Turista</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-user-password">Contrasena</FormLabel>
                    <FormControl>
                      <Input {...field} id="admin-user-password" name="password" type="password" placeholder="Minimo 8 caracteres" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <LoaderCircle size={16} className="mr-2 animate-spin" /> : <UserPlus size={16} className="mr-2" />}
                Crear usuario
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
