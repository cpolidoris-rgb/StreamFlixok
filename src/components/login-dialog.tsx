'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore } from '@/firebase/provider';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  username: z.string().optional(),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

/**
 * Filtro de color Rojo Intenso para logos negros
 */
const RED_FILTER = { filter: 'invert(11%) sepia(100%) saturate(6449%) hue-rotate(360deg) brightness(103%) contrast(115%)' };

type AuthMode = 'login' | 'signup';

export default function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    form.reset();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: '¡Bienvenido de nuevo!',
          description: 'Has iniciado sesión correctamente.',
        });
      } else {
        if (!values.username) {
          toast({
            variant: 'destructive',
            title: 'Error de registro',
            description: 'El nombre de usuario es obligatorio para registrarse.',
          });
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;

        if (user && firestore) {
          await updateProfile(user, { displayName: values.username });
          await setDoc(doc(firestore, 'users', user.uid), {
            id: user.uid,
            username: values.username,
            email: values.email,
            joinDate: serverTimestamp(),
            avatarUrl: '',
            isAdmin: false,
          });
        }

        toast({
          title: '¡Cuenta creada!',
          description: 'Te has registrado correctamente.',
        });
      }
      setOpen(false);
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      let errorMessage = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      
      // Manejo específico de credenciales inválidas para evitar bloqueos
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres).';
      }

      toast({
        variant: 'destructive',
        title: mode === 'login' ? 'Error de inicio de sesión' : 'Error de registro',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setMode('login'); 
    }}>
      <DialogTrigger asChild>
        <Button className="font-black h-9 text-sm">Ingresar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex justify-center items-center mb-4">
            <Image
              src="https://inforosario.com/logostream.png"
              alt="StreamFLIX Logo"
              width={800}
              height={208}
              style={RED_FILTER}
              className="w-[200px] h-auto mx-auto"
            />
          </div>
          <DialogTitle className="text-2xl font-black font-headline text-center uppercase tracking-tighter">
            {mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </DialogTitle>
          <DialogDescription className="text-center font-medium opacity-70">
            {mode === 'login' 
              ? 'Introduce tus credenciales para acceder a StreamFLIX.' 
              : 'Únete a la comunidad de streaming más grande de Argentina.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold uppercase text-[10px] tracking-widest opacity-70">Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="TuNombre"
                        {...field}
                        className="bg-white/5 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase text-[10px] tracking-widest opacity-70">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tu@email.com"
                      {...field}
                      type="email"
                      className="bg-white/5 border-white/10"
                    />
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
                  <FormLabel className="font-bold uppercase text-[10px] tracking-widest opacity-70">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      type="password"
                      className="bg-white/5 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-black uppercase tracking-widest h-12" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Registrarme'}
            </Button>
          </form>
        </Form>

        <DialogFooter className="flex flex-col items-center sm:justify-center border-t border-white/5 pt-6 gap-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              {mode === 'login' ? '¿No tienes una cuenta todavía?' : '¿Ya tienes una cuenta?'}
            </p>
            <Button 
              variant="link" 
              onClick={toggleMode} 
              className="text-primary font-black uppercase text-[10px] tracking-widest h-auto p-0 hover:no-underline"
            >
              {mode === 'login' ? 'Crear una cuenta nueva' : 'Ingresar con mi cuenta'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
