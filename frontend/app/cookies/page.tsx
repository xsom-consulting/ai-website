import { LegalPage, legalTitle } from "@/components/LegalPage";
import { commonPageMetadata, commonPageSite } from "@/lib/seo";

export const generateMetadata = () => commonPageMetadata(legalTitle("cookies"), "/cookies");

export default async function Page() {
  return <LegalPage document="cookies" site={await commonPageSite()} />;
}
