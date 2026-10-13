import { LegalPage, legalTitle } from "@/components/LegalPage";
import { commonPageMetadata, commonPageSite } from "@/lib/seo";

export const generateMetadata = () => commonPageMetadata(legalTitle("confidentialite"), "/confidentialite");

export default async function Page() {
  return <LegalPage document="confidentialite" site={await commonPageSite()} />;
}
