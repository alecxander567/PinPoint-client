import { createContext } from "react";

export const ReportCountContext = createContext({
  reportCount: 0,
  setReportCount: () => {},
});
