import { useMemo, useState } from "react";
import { createTransferRequest } from "@arrivio/firebase";
import {
  createTransferRequestCode,
  initialTransferFormState,
  validateTransferForm,
  type TransferFormState
} from "../src/transferFormModel";
import { mapTransferFormToRequest } from "../src/transferRequestMapper";

export default function TransferPage() {
  const [form, setForm] = useState<TransferFormState>(initialTransferFormState);
  const [status, setStatus] = useState<string>("");
  const [requestCode, setRequestCode] = useState<string>("");

  const title = useMemo(() => "Arrivio Transfer Request", []);

  async function submitTransferRequest() {
    const error = validateTransferForm(form);
    if (error) {
      setStatus(error);
      return;
    }

    const code = createTransferRequestCode();
    const payload = mapTransferFormToRequest(form, code);
    await createTransferRequest(payload);
    setRequestCode(code);
    setStatus("Transfer request created. Arrivio will contact you soon.");
  }

  function updateField<K extends keyof TransferFormState>(key: K, value: TransferFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return null;
}
