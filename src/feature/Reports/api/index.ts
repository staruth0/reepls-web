import { apiClient } from "../../../services/apiClient";

import { Report } from "../../../models/datamodels";

// Create a new report
const createReport = async (report: Report) => {
  console.log("Creating report:", report);
  const { data } = await apiClient.post("/report", report);
  return data;
};

// Get all reports
const getAllReports = async () => {
  console.log("Fetching all reports");
  const { data } = await apiClient.get("/report");
  return data;
};

// Get all reports with filters
const getReportsWithFilters = async (
  status: string,
  startDate: string,
  endDate: string
) => {
  console.log("Fetching reports with filters");
  const { data } = await apiClient.get(
    `/report?status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};

// Get a report by ID
const getReportById = async (reportId: string) => {
  console.log("Fetching report with ID:", reportId);
  const { data } = await apiClient.get(`/report/${reportId}`);
  return data;
};

// Update report status
const updateReportStatus = async (reportId: string, status: string) => {
  console.log(
    "Updating report status for report with ID:",
    reportId,
    "Status:",
    status
  );
  const { data } = await apiClient.patch(`/report/${reportId}/status`, {
    status,
  });
  return data;
};

// Delete a report
const deleteReport = async (reportId: string) => {
  console.log("Deleting report with ID:", reportId);
  const { data } = await apiClient.delete(`/report/${reportId}`);
  return data;
};

export {
  createReport,
  getAllReports,
  getReportsWithFilters,
  getReportById,
  updateReportStatus,
  deleteReport,
};
