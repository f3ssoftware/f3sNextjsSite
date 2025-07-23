"use client";

import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import { AutoComplete } from "primereact/autocomplete";
import { useIsClient } from "../../../../../../hooks/useIsClient";

interface AddressGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function AddressGenerator({ onValueChange }: AddressGeneratorProps) {
  const isClient = useIsClient();
  const [address, setAddress] = useState<{
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const searchCountry = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = countries.filter(country => 
      country.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

  const generateAddress = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generators/addressGenerator`);
      const data = await res.json();
      setAddress(data);
      onValueChange(data);
    } catch (e) {
      toast.current?.show({
        severity: "error",
        summary: t("ERROR"),
        detail: t("UNKNOWN_ERROR"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (address.street) {
      const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
      navigator.clipboard.writeText(fullAddress);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: t("ADDRESS_COPIED"),
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: t("ERROR"),
        detail: t("COPY_FAILED"),
        life: 3000,
      });
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-column gap-2">
      <Toast ref={toast} />
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "10px",
        width: "100%"
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: "1" }}>
            <span className="p-float-label">
              <InputText
                id="street"
                value={address.street}
                readOnly
                style={{ width: '100%' }}
              />
              <label htmlFor="street">{t("STREET")}</label>
            </span>
          </div>
          <div style={{ flex: "1" }}>
            <span className="p-float-label">
              <InputText
                id="city"
                value={address.city}
                readOnly
                style={{ width: '100%' }}
              />
              <label htmlFor="city">{t("CITY")}</label>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: "0 0 100px" }}>
            <span className="p-float-label">
              <InputText
                id="state"
                value={address.state}
                readOnly
                style={{ width: '100%' }}
              />
              <label htmlFor="state">{t("STATE")}</label>
            </span>
          </div>
          <div style={{ flex: "0 0 120px" }}>
            <span className="p-float-label">
              <InputText
                id="zip"
                value={address.zip}
                readOnly
                style={{ width: '100%' }}
              />
              <label htmlFor="zip">{t("ZIP")}</label>
            </span>
          </div>
          <div style={{ flex: "1" }}>
            <span className="p-float-label">
              <AutoComplete
                id="country"
                value={address.country}
                suggestions={filteredCountries}
                completeMethod={searchCountry}
                onChange={(e) => {
                  setAddress({ ...address, country: e.value });
                  onValueChange({ ...address, country: e.value });
                }}
                style={{ width: '100%' }}
                dropdown
              />
              <label htmlFor="country">{t("COUNTRY")}</label>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px" }}>
          <Button
            icon="pi pi-copy"
            rounded
            text
            severity="secondary"
            onClick={copyToClipboard}
            disabled={!address.street}
            tooltip={t("COPY_ADDRESS")}
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            icon="pi pi-refresh"
            rounded
            text
            severity="secondary"
            onClick={generateAddress}
            loading={loading}
            tooltip={t("GENERATE_ADDRESS")}
            tooltipOptions={{ position: "bottom" }}
          />
        </div>
      </div>
    </div>
  );
}