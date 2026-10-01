import { LegalDocument } from '@/modules/promo/components/LegalDocument'
import { termsDoc } from '@/modules/promo/data/legal-content'
export function TermsPage() {
  return <LegalDocument doc={termsDoc} />
}
