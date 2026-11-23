import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/dashboard/page-header";
import { OfficeExplorer } from "@/components/virtual-office/office-explorer";

export default async function VirtualOfficePage() {
  const t = await getTranslations("virtualOffice");
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <PageHeader title={t("title")} description={t("description")} descriptionMode="summary" />
      <OfficeExplorer />
    </div>
  );
}
