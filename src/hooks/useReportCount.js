import { useContext } from "react";
import { ReportCountContext } from "../components/ReportCountContext";

export function useReportCount() {
  return useContext(ReportCountContext);
}
