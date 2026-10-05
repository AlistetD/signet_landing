import { useForm } from '@tanstack/react-form'
import { useState, type ReactNode } from 'react'
import { postApplication } from '@/api/client'
import { SliderToggle } from '@/components/motion/slider-toggle'
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar'
import { fireSignetConfetti } from '@/components/ui/confetti'
import { ShineBorder } from '@/components/ui/shine-border'
import { citySuggestions, landingContent } from '@/content/landing'
import {
  applicationSchema,
  countCompletedFields,
  formatByPhoneMask,
  isValidByPhone,
  isValidResumeUrl,
  type ApplicationDraft,
  type SubmitResult,
} from '@/lib/application-schema'
import { useTheme } from '@/stores/theme'

const copy = landingContent.apply

export function ApplyForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { theme } = useTheme()

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '+375',
      city: '',
      position: '',
      resumeUrl: '',
      consent: false,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      const payload = {
        name: value.name,
        phone: value.phone,
        city: value.city,
        position: value.position,
        resumeUrl: value.resumeUrl,
        consent: value.consent,
      }
      const parsed = applicationSchema.safeParse(payload)
      if (!parsed.success) {
        setSubmitError(copy.errors.validation)
        return
      }
      let result: SubmitResult
      try {
        result = await postApplication(parsed.data)
      } catch {
        setSubmitError(copy.errors.unavailable)
        return
      }
      if (!result.ok) {
        setSubmitError(copy.errors[result.error])
        return
      }
      setSuccess(true)
      fireSignetConfetti()
    },
  })

  if (success) {
    return (
      <section
        id={copy.id}
        className="glass relative overflow-hidden rounded-[1.25rem] px-[clamp(1rem,4vw,1.5rem)] py-[clamp(1.5rem,4vh,2.5rem)] text-center"
      >
        <h2 className="type-title font-display uppercase tracking-[0.04em] text-fg">{copy.successTitle}</h2>
        <p className="type-lead mt-4 text-muted">{copy.successBody}</p>
      </section>
    )
  }

  return (
    <section id={copy.id} className="scroll-anchor relative">
      <form.Subscribe selector={(state) => state.values}>
        {(values) => {
          const completed = countCompletedFields(values as ApplicationDraft)
          const percent = completed * 25
          return (
            <div className="glass relative overflow-hidden rounded-[1.25rem] p-[1px]">
              <ShineBorder shineColor="#ed1c24" borderWidth={2} duration={12} />
              <div className="relative rounded-[1.2rem] px-[clamp(1rem,4vw,2rem)] py-[clamp(1.15rem,3vh,1.75rem)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="type-title leading-tight uppercase tracking-[0.04em]">{copy.title}</h2>
                  <AnimatedCircularProgressBar
                    className="size-14 shrink-0 sm:size-16 md:size-20"
                    value={percent}
                    gaugePrimaryColor="#ed1c24"
                    gaugeSecondaryColor={theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,17,0.12)'}
                    label={`${percent}%`}
                  />
                </div>

                <form
                  className="mt-[clamp(0.75rem,2vh,1rem)] grid gap-[clamp(0.75rem,2vh,1rem)]"
                  onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    void form.handleSubmit()
                  }}
                >
                  <form.Field name="name">
                    {(field) => (
                      <Field
                        id="apply-name"
                        label={copy.fields.name.label}
                        error={field.state.meta.isTouched && field.state.value.trim().length < 2 ? copy.errors.name : null}
                      >
                        <input
                          id="apply-name"
                          name="name"
                          autoComplete="name"
                          className={inputClass}
                          placeholder={copy.fields.name.placeholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="phone">
                    {(field) => (
                      <Field
                        id="apply-phone"
                        label={copy.fields.phone.label}
                        error={
                          field.state.meta.isTouched && !isValidByPhone(field.state.value) ? copy.errors.phone : null
                        }
                      >
                        <input
                          id="apply-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          className={inputClass}
                          placeholder={copy.fields.phone.placeholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(formatByPhoneMask(event.target.value))}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="city">
                    {(field) => (
                      <Field
                        id="apply-city"
                        label={copy.fields.city.label}
                        error={field.state.meta.isTouched && field.state.value.length < 2 ? copy.errors.city : null}
                      >
                        <select
                          id="apply-city"
                          name="city"
                          className={inputClass}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                        >
                          <option value="">{copy.errors.city}</option>
                          {citySuggestions.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="position">
                    {(field) => (
                      <Field
                        id="apply-position"
                        label={copy.fields.position.label}
                        error={
                          field.state.meta.isTouched && field.state.value.trim().length < 2
                            ? copy.errors.position
                            : null
                        }
                      >
                        <input
                          id="apply-position"
                          name="position"
                          className={inputClass}
                          placeholder={copy.fields.position.placeholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="resumeUrl">
                    {(field) => (
                      <Field
                        id="apply-resume"
                        label={copy.fields.resumeUrl.label}
                        error={
                          field.state.meta.isTouched && !isValidResumeUrl(field.state.value)
                            ? copy.errors.resumeUrl
                            : null
                        }
                      >
                        <input
                          id="apply-resume"
                          name="resumeUrl"
                          inputMode="url"
                          className={inputClass}
                          placeholder={copy.fields.resumeUrl.placeholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="consent">
                    {(field) => (
                      <SliderToggle
                        id="apply-consent"
                        checked={field.state.value}
                        onChange={field.handleChange}
                        label={copy.consent}
                      />
                    )}
                  </form.Field>

                  {submitError ? <p className="text-sm text-signet-red">{submitError}</p> : null}

                  <form.Subscribe selector={(state) => [state.values.consent, state.isSubmitting] as const}>
                    {([consent, isSubmitting]) => (
                      <button
                        type="submit"
                        disabled={!consent || isSubmitting}
                        className="h-12 min-h-11 select-none rounded-full bg-signet-red font-semibold uppercase tracking-wide text-white transition enabled:fine-hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {copy.submit}
                      </button>
                    )}
                  </form.Subscribe>
                  <p className="text-sm text-muted">{copy.reassurance}</p>
                </form>
              </div>
            </div>
          )
        }}
      </form.Subscribe>
    </section>
  )
}

const inputClass =
  'mt-2 h-12 w-full rounded-xl border border-fg/20 bg-field px-4 text-base text-fg outline-none placeholder:text-subtle focus:border-signet-red'

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error: string | null
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-muted">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-signet-red">{error}</p> : null}
    </div>
  )
}
