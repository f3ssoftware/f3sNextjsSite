import { useTranslations } from "next-intl";
import { TabMenu } from "primereact/tabmenu";

export default function Generators() {
  const t = useTranslations();
  const items = [
    { label: t("ADDRESS_GENERATOR"), icon: "pi pi-home" },
    { label: t("DOCUMENT_GENERATOR"), icon: "pi pi-chart-line" },
    { label: t("CNS_GENERATOR"), icon: "pi pi-list" },
    { label: t("CREDIT_CARD_GENERATOR"), icon: "pi pi-inbox" },
  ];
  return (
    <div className="generators-container">
      <TabMenu model={items} />
    </div>
  );
}
