'use client'

import Image from 'next/image'
import Form from 'next/form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginAction } from '@/app/(auth)/login/actions'
import { useActionState } from 'react'
import { TriangleAlert } from 'lucide-react'

const initialState = {
  values: { email: '', password: '' },
  errors: null,
  success: false,
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form action={formAction}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                <Image
                  src="/logo.png"
                  alt="SceneZone"
                  width={140}
                  height={40}
                  className="p-2"
                />
              </div>
              <span className="sr-only">SceneZone</span>
            </a>
            <h1 className="text-xl font-bold">
              Welcome to SceneZone&apos;s Admin Panel
            </h1>
          </div>

          {/* Global/Root Error Message */}
          {state.errors?.root && (
            <div className="flex items-center p-3 text-sm text-red-500 rounded-md border border-red-700">
              <TriangleAlert className="inline-block mr-2" size={16} />
              {state.errors.root[0]}
            </div>
          )}

          <Field data-invalid={!!state.errors?.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              defaultValue={state.values?.email}
              aria-invalid={!!state.errors?.email}
              disabled={pending}
            />
            {state.errors?.email && (
              <FieldError>{state.errors.email[0]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!state.errors?.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              defaultValue={state.values?.password}
              aria-invalid={!!state.errors?.password}
              disabled={pending}
            />
            {state.errors?.password && (
              <FieldError>{state.errors.password[0]}</FieldError>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Logging in...' : 'Login'}
            </Button>
          </Field>
        </FieldGroup>
      </Form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{' '}
        <a href="https://www.thescenezone.com/privacy">Terms of Service</a> and{' '}
        <a href="https://www.thescenezone.com/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
