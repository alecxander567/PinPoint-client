import { useState } from "react";
import { ReportCountContext } from "./ReportCountContext";

export function ReportCountProvider({ children }) {
  const [reportCount, setReportCount] = useState(0);

  return (
    <ReportCountContext.Provider value={{ reportCount, setReportCount }}>
      {children}
    </ReportCountContext.Provider>
  );
}
