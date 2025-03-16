export const lpFromFields = [
  {
    name: "docoments",
    label: "Upload Contribution Agreement",
    description:
      "Make sure the contribution agreement is in the specified format. You can download the template from here.",
    type: "file",
    placeholder: "",
    required: false,
    multiple: false,
    dropZoneConfig: {
      useFsAccessApi: false,
      accept: {},
      maxFiles: 5,
      maxSize: 1024 * 1024 * 4,
      multiple: true,
    },
  },
  {
    type: "hr",
    className: "",
  },
  {
    type: "heading",
    label: "Manually fill details",
    className: "",
  },
  {
    type: "subheading",
    label: "You can also manually fill all required details",
  },
  {
    type: "subheading",
    label: "General",
  },
  {
    name: "lp_name",
    label: "Name",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Others", value: "others" },
    ],
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    placeholder: "",
    required: true,
    pastDisable: false,
    futureDisable: true,
  },
  {
    name: "mobile_no",
    label: "Mobile Number",
    type: "phone",
    required: true,
    className: "",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "",
    required: true,
  },
  {
    name: "pan",
    label: "PAN Number",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "address",
    label: "Adress",
    type: "textarea",
    placeholder: "",
    required: true,
  },
  {
    type: "hr",
    className: "",
  },
  {
    type: "subheading",
    label: "Contribution",
    className: "font-bold",
  },
  {
    type: "subheading",
    label: "Add relevant details about contribution",
  },
  {
    name: "nominee",
    label: "Nominee",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "commitment_amount",
    label: "Commitment Amount",
    description: "Should be greater than ₹1Cr",
    type: "number",
    min: 1,
    required: true,
    className: "",
  },
  {
    name: "acknowledgement_of_ppm",
    label: "Acknowledgement of PPM",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    name: "cml_file",
    label: "CML",
    type: "file",
    placeholder: "",
    required: true,
    multiple: false,
    dropZoneConfig: {
      useFsAccessApi: false,
      accept: {},
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      multiple: false,
    },
  },
  {
    name: "depository", // Not sure about this field
    label: "Depository",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "NSDL", value: "nsdl" },
      { label: "CDSL", value: "cdsl" },
    ],
  },
  {
    name: "dpid",
    label: "Dpid",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "client_id",
    label: "Client ID",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "class_of_shares",
    label: "Class of Share",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Class A", value: "INF1C8N22014" },
      { label: "Class B", value: "INF1C8N22022" },
    ],
  },
  {
    name: "isin",
    label: "ISIN",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "type",
    label: "Entity Type",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Individual", value: "individual" },
      { label: "Corporate", value: "corporate" },
      { label: "Partnership", value: "partnership" },
      { label: "Trust", value: "trust" },
    ],
  },
  {
    name: "citizenship",
    label: "Tax Jurisdiction",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Resident", value: "resident" },
      { label: "Non-Resident Ordinary (NRO)", value: "nro" },
      { label: "Non-Resident External (NRE)", value: "nre" },
      { label: "Non-resident", value: "non-resident" },
    ],
  },
  {
    name: "geography",
    label: "Geography",
    type: "country_select",
    placeholder: "",
    required: true,
  },
  {
    name: "emaildrawdowns",
    label: "Email For Drawdowns",
    description: "You can add multiple emails separated by a comma",
    type: "text",
    placeholder: "",
    required: true,
  },
];
