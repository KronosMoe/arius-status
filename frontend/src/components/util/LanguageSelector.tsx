import { ISetting } from '@/types/setting'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useTranslation } from 'react-i18next'
import { SupportedLanguages } from '@/lib/i18n.ts'
import { useMutation } from '@apollo/client'
import { UPDATE_LANGUAGE_MUTATION } from '@/gql/settings'
import { useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

type Props = {
  settings: ISetting
  setSettings: React.Dispatch<React.SetStateAction<ISetting>>
}

export default function LanguageSelector({ settings, setSettings }: Props) {
  const { isAuthenticated } = useAuth()
  const { i18n } = useTranslation()
  const [updateLanguage] = useMutation(UPDATE_LANGUAGE_MUTATION, {
    onCompleted: () => {
      toast.success('Language updated successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const changeLanguage = useCallback(
    async (lang: string) => {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang)
        localStorage.setItem('language', lang)
        setSettings((prev) => ({ ...prev, language: lang }))

        if (isAuthenticated) {
          await updateLanguage({ variables: { language: lang } })
        }
      }
    },
    [i18n, setSettings, updateLanguage, isAuthenticated],
  )

  return (
    <Select value={settings.language} onValueChange={(value) => changeLanguage(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {SupportedLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
