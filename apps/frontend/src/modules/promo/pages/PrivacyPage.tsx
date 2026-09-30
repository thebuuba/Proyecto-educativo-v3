import { LegalDocument } from '@/modules/promo/components/LegalDocument'
import { privacyDoc } from '@/modules/promo/data/legal-content'
export function PrivacyPage() {
  return <LegalDocument doc={privacyDoc} />
}
