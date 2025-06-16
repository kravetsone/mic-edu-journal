import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '../hooks/demo.form'

export const Route = createFileRoute('/demo/form/simple')({
  component: SimpleForm,
})

const schema = z.object({
  email: z.string().trim().min(1, 'Почта не может быть пустой'),
  password: z.string().trim().min(1, 'Пароль не может быть пустым'),
})

function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      // Show success message
      alert('Form submitted successfully!')
    },
    
  })
  

  return (
    <div className="w-full h-screen bg-black flex justify-around items-center text-white">
    <div>
      <h1 className="first-letter:text-accentSecondary text-4xl font-bold">
        Московский
      </h1>
      <h1 className="first-letter:text-accentSecondary text-4xl font-bold">
        Индустриальный
      </h1>
      <h1 className="first-letter:text-accentSecondary text-4xl font-bold">
        Колледж
      </h1>
      <p className="text-textSecondary mt-2 text-2xl font-medium">
        Админ-панель
      </p>
    </div>
    <div className="bg-[#0A0A0A] text-center rounded-2xl p-6 w-1/4">
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
          <h3 className="text-2xl">Авторизация</h3>
          <div className="flex flex-col gap-2 text-textSecondary">
          <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField name="email">
            {(field) => <field.TextField label="E-mail" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => <field.TextArea label="Пароль" />}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton label="Войти" />
            </form.AppForm>
          </div>
        </form>
        </div>
        </form>
    </div>
  </div>
  )
}
