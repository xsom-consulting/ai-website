import { LegalPage, legalTitle } from "@/components/LegalPage";
import { commonPageMetadata, commonPageSite } from "@/lib/seo";

export const generateMetadata = () => commonPageMetadata(legalTitle("mentions-legales"), "/mentions-legales");

export default async function Page() {
  return <LegalPage document="mentions-legales" site={await commonPageSite()} />;
}
