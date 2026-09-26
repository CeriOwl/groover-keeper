"use client"

import { useActionState, useState, useTransition } from "react"
import { createStaff, deleteStaff } from "@/app/actions/staff"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Field, Input, Select } from "@/app/components/ui/field"
import { Panel } from "@/app/components/ui/panel"
import type { StaffFormState } from "@/app/lib/definitions"

type StaffRow = {
  idPublic: string
  username: string | null
  roleId: number | null
  role: string | null
}

type Role = { id: number; name: string }

export const StaffManager = ({
  staff,
  roles,
  currentIdPublic,
}: {
  staff: StaffRow[]
  roles: Role[]
  currentIdPublic: string
}) => {
  const [state, action, pending] = useActionState<StaffFormState, FormData>(
    createStaff,
    undefined,
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const [deleting, startTransition] = useTransition()

  const remove = (member: StaffRow) => {
    if (!window.confirm(`Delete ${member.username ?? "this account"}?`)) return
    startTransition(async () => {
      const result = await deleteStaff(member.idPublic)
      setFeedback(result.message)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel title={`Team (${staff.length})`}>
        <ul className="flex flex-col divide-y divide-ink/15">
          {staff.map((member) => (
            <li
              key={member.idPublic}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex flex-col gap-1">
                <span className="font-bevan text-lg leading-tight text-ink">
                  {member.username ?? "—"}
                </span>
                <span className="font-courier-prime text-[11px] tracking-wide text-muted">
                  {member.role ?? "No role"}
                  {member.idPublic === currentIdPublic ? " · you" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={member.roleId === 1 ? "ink" : "outline"}>
                  {member.role ?? "Unassigned"}
                </Badge>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={member.idPublic === currentIdPublic || deleting}
                  onClick={() => remove(member)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Create a login">
        <form
          key={state?.message ?? "new"}
          action={action}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Username"
              htmlFor="staff-username"
              error={state?.errors?.username?.[0]}
            >
              <Input
                id="staff-username"
                name="username"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="rholt"
                required
              />
            </Field>
            <Field
              label="Password"
              htmlFor="staff-password"
              error={state?.errors?.password?.[0]}
              hint="At least 8 characters with a letter, number, and symbol."
            >
              <Input
                id="staff-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
              />
            </Field>
          </div>

          <Field
            label="Role"
            htmlFor="staff-role"
            error={state?.errors?.roleId?.[0]}
          >
            <Select id="staff-role" name="roleId" defaultValue={roles[0]?.id}>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </Field>

          {state?.message ? (
            <p
              role="status"
              className="border-2 border-ink bg-signal px-3 py-2 font-courier-prime text-xs font-bold text-ink"
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink/10 pt-4">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Creating…" : "Create account"}
            </Button>
          </div>
        </form>
      </Panel>

      {feedback ? (
        <p
          role="status"
          className="border-2 border-ink bg-surface-2 px-4 py-3 font-courier-prime text-xs font-bold text-ink"
        >
          {feedback}
        </p>
      ) : null}
    </div>
  )
}
