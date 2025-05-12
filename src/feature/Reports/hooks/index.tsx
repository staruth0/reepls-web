import { useQuery, useMutation } from "@tanstack/react-query";
import { createReport, deleteReport, getAllReports, getReportById, getReportsWithFilters, updateReportStatus } from "../api";
import { Report } from "../../../models/datamodels";

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (report: Report) => createReport(report),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error creating report:", error);
    },
  });
};

export const useGetAllReports = () => {
  return useQuery({
    queryKey: ["allReports"],
    queryFn: () => getAllReports(),
  });
};

export const useGetReportsWithFilters = (
  status: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ["reportsWithFilters", status, startDate, endDate],
    queryFn: () => getReportsWithFilters(status, startDate, endDate),
  });
};

export const useGetReportById = (reportId: string) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId),
  });
};

export const useUpdateReportStatus = () => {
  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: string }) =>
      updateReportStatus(reportId, status),
    onError: (error) => {
      console.error("Error updating report status:", error);
    },
  });
};

export const useDeleteReport = () => {
  return useMutation({
    mutationFn: (reportId: string) => deleteReport(reportId),
    
    onError: (error) => {
      console.error("Error deleting report:", error);
    },
  });
};
