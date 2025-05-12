import { apiClient } from "../../../services/apiClient";

import { Report } from "../../../models/datamodels";

// Create a new report
const createReport = async (report: Report) => {
  const { data } = await apiClient.post("/report", report);
  return data;
};

// Get all reports
const getAllReports = async () => {
  const { data } = await apiClient.get("/report");
  return data;
};

// Get all reports with filters
const getReportsWithFilters = async (
  status: string,
  startDate: string,
  endDate: string
) => {
  const { data } = await apiClient.get(
    `/report?status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};

// Get a report by ID
const getReportById = async (reportId: string) => {
  const { data } = await apiClient.get(`/report/${reportId}`);
  return data;
};

// Update report status
const updateReportStatus = async (reportId: string, status: string) => {
  
  const { data } = await apiClient.patch(`/report/${reportId}/status`, {
    status,
  });
  return data;
};

// Delete a report
const deleteReport = async (reportId: string) => {
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
