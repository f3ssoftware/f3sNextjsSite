import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";

interface TibiaItemsTableProps {
  filteredItems: any[];
  t: (key: string, opts?: any) => string;
}

export default function TibiaItemsTable({ filteredItems, t }: TibiaItemsTableProps) {
  return (
    <TreeTable
      value={filteredItems.map((item, i) => ({
        key: i.toString(),
        data: item,
        children: [],
      }))}
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column field="type" header={t("Type", { defaultMessage: "Type" })} sortable showFilterMenu={false}></Column>
      <Column field="name" header={t("Name", { defaultMessage: "Name" })} sortable></Column>
      <Column field="weight" header={t("Weight", { defaultMessage: "Weight" })} sortable></Column>
      <Column field="atk" header={t("Atk", { defaultMessage: "Atk" })} sortable></Column>
      <Column field="def" header={t("Def", { defaultMessage: "Def" })} sortable></Column>
      <Column field="def_mod" header={t("Def Mod", { defaultMessage: "Def Mod" })} sortable></Column>
      <Column field="imbuement_slots" header={t("Imbuement Slots", { defaultMessage: "Imbuement Slots" })}></Column>
      <Column field="tier" header={t("Tier", { defaultMessage: "Tier" })} sortable></Column>
      <Column field="min_level" header={t("Min Level", { defaultMessage: "Min Level" })} sortable></Column>
      <Column
        field="item_protections"
        header={t("Protections", { defaultMessage: "Protections" })}
        body={(rowData) => {
          const protections = rowData.data.item_protections || [];
          if (!protections.length) return "-";
          return protections
            .map((prot: any) => `${prot.element}: ${prot.value}%`)
            .join(", ");
        }}
      ></Column>
      <Column
        field="item_bonus_skills"
        header={t("Bonus Skills", { defaultMessage: "Bonus Skills" })}
        body={(rowData) => {
          const skills = rowData.data.item_bonus_skills || [];
          if (!skills.length) return "-";
          return skills
            .map((skill: any) => `${skill.skill}: ${skill.value}`)
            .join(", ");
        }}
      ></Column>
      <Column
        field="item_vocations"
        header={t("Vocations", { defaultMessage: "Vocations" })}
        body={(rowData) => {
          return (rowData.data.item_vocations || [])
            .map((voc: any) => t(voc.vocation, { defaultMessage: voc.vocation }))
            .join(", ");
        }}
        showFilterMenu={false}
      ></Column>
    </TreeTable>
  );
} 