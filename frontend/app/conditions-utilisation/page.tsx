import { LegalPage, legalTitle } from "@/components/LegalPage";
import { commonPageMetadata, commonPageSite } from "@/lib/seo";

export const generateMetadata = () => commonPageMetadata(legalTitle("conditions-utilisation"), "/conditions-utilisation");

export default async function Page() {
  return <LegalPage document="conditions-utilisation" site={await commonPageSite()} />;
}
