"use client"

import { useActionState } from "react"
import { signup } from "@/app/actions/auth"
import { Button } from "@/app/components/ui/button"
import { Field, Input } from "@/app/components/ui/field"

export default function Home() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <main className="grid min-h-dvh place-content-center bg-ink px-6 py-12 font-courier-prime">
      <div className="relative w-full max-w-md border-2 border-ink bg-paper p-8 shadow-boxes-big shadow-rust md:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-bevan text-4xl font-medium italic text-ink">
            Groove &amp; Grind
          </h1>
          <span className="font-courier-prime text-xs font-bold tracking-widest uppercase text-rust">
            staff access only
          </span>
        </div>

        <form action={action} className="flex flex-col gap-5 pt-8" noValidate>
          <Field
            label="Username"
            htmlFor="username"
            error={state?.errors?.username?.[0]}
          >
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              spellCheck={false}
              placeholder="asmith"
              required
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            error={state?.errors?.password?.[0]}
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              required
            />
          </Field>

          {state?.message ? (
            <p
              role="alert"
              className="border-2 border-ink bg-surface-2 px-3 py-2 font-courier-prime text-xs font-bold text-rust"
            >
              {state.message}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={pending}
            className="mx-auto mt-2"
          >
            {pending ? "Checking…" : "Log in"}
          </Button>
        </form>

        <span className="absolute right-8 top-0 -translate-y-1/2 -rotate-6 border-2 border-ink bg-signal px-2 py-1 font-courier-prime text-xs font-bold uppercase shadow-boxes-small shadow-ink">
          est. 2026
        </span>
      </div>
    </main>
  )
}
